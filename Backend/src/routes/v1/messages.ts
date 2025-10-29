import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import type { Message } from '@prisma/client';
import { generate } from "../../llm/adapter.js";
import {
  updateSessionConfidence,
  shouldEscalateLowConfidence,
  updateOOSStreak,
  isOOS,
} from "../../services/confidence.js";
import { deriveUserFeedback, detectRepeatQuestion } from "../../services/helpers.js";
import { faqRetrievalScore, cheapOOSClassifier } from "../../services/retrieval.js";
import { shouldGenerateSummary, updateSessionSummary } from "../../services/summary.js";
import { getHybridContext, formatHybridContext } from "../../services/hybridContext.js";
import { generateStructured } from "../../llm/structuredGenerate.js";

const router = Router({ mergeParams: true }); // mergeParams to access sessionId from parent route

// GET all messages for a session
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const { sender } = req.query;
    
    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        sessionId,
        ...(sender && { sender: sender as string }),
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// GET single message by ID
router.get("/:messageId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, messageId } = req.params as { sessionId: string; messageId: string };
    
    const message = await prisma.message.findFirst({
      where: { 
        id: messageId,
        sessionId,
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: { message: "Message not found" },
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

// POST create new message
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const { sender, text, confidence } = req.body;

    // Validate required fields
    if (!sender || !text) {
      return res.status(400).json({
        success: false,
        error: { message: "Sender and text are required" },
      });
    }

    // Validate sender type
    if (!["user", "orion", "system"].includes(sender)) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid sender. Must be 'user', 'orion', or 'system'" },
      });
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    // 1️ Persist user message
    const userMsg = await prisma.message.create({
      data: {
        sessionId,
        sender,
        text,
        ...(confidence !== undefined && { confidence }),
      },
    });

    // Phase 3: LLM Orchestration - Generate intelligent response if sender is user
    let botMsg: Message | null = null;
    let shouldEscalate = false;

    if (sender === "user") {
      // 2️ Fetch context (recent messages + hybrid context)
      const sessionWithContext = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 80, // Last 80 messages for context
          },
          company: {
            select: { id: true, name: true },
          },
        },
      });

      if (!sessionWithContext) {
        return res.status(404).json({
          success: false,
          error: { message: "Session not found" },
        });
      }

      // Prepare messages for LLM
      const messages = sessionWithContext.messages
        .slice(-6) // Use last 6 messages for context
        .map((m) => ({
          role: m.sender === "user" ? "user" : m.sender === "orion" ? "assistant" : "system",
          text: m.text,
        }));

      // Phase 5: Get hybrid context (company profile + top-k FAQs via embeddings)
      const hybridContext = await getHybridContext(
        sessionWithContext.company.id,
        text,
        20 // Top 20 FAQs
      );

      // Format hybrid context for LLM prompt
      const contextString = formatHybridContext(hybridContext);

      // Prepare knowledge base from hybrid context top FAQs
      const knowledge = hybridContext.topFAQs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
      }));

      // Add company profile as system message if available
      if (hybridContext.companyProfile) {
        messages.unshift({
          role: 'system',
          text: `Company Context: ${hybridContext.companyProfile}`,
        });
      }

      // 3️ Phase 9: Generate structured response via Gemini
      const USE_STRUCTURED = process.env.USE_STRUCTURED_OUTPUT === "true";
      
      let reply: string;
      let model_conf: number;
      let structuredMeta: any = null;

      if (USE_STRUCTURED) {
        const structuredResponse = await generateStructured({
          system: "You are Orion, a helpful customer support assistant. Use the provided context to answer questions accurately and professionally.",
          messages,
          knowledge,
          companyProfile: hybridContext.companyProfile,
        });

        reply = structuredResponse.summary;
        model_conf = structuredResponse.confidence;
        structuredMeta = {
          type: structuredResponse.type,
          title: structuredResponse.title,
          sections: structuredResponse.sections,
          contextUsed: structuredResponse.contextUsed,
          tone: structuredResponse.tone,
          shouldEscalate: structuredResponse.shouldEscalate,
        };
      } else {
        // Fallback to original generate function
        const response = await generate({
          messages,
          knowledge,
        });
        reply = response.text;
        model_conf = response.confidence;
      }

      //  Phase 3.5: Compute retrieval score
      const retrieval_score = await faqRetrievalScore(
        sessionWithContext.company.id,
        text
      );

      //  Phase 3.5: Optional OOS classifier
      const prob_oos = cheapOOSClassifier(text);

      //  Phase 3.5: OOS handling (red wire - immediate escalation)
      const newOOS = updateOOSStreak(
        session.oosStreak ?? 0,
        retrieval_score,
        process.env
      );
      const oosTrip = isOOS(newOOS, process.env, prob_oos);

      let escalationReason: 'low_confidence' | 'out_of_scope' | undefined;

      if (oosTrip) {
        shouldEscalate = true;
        escalationReason = 'out_of_scope';
      }

      //  Phase 3.5: Low-confidence check (per-message)
      if (!shouldEscalate && shouldEscalateLowConfidence(model_conf, process.env)) {
        shouldEscalate = true;
        escalationReason = 'low_confidence';
      }

      // 4️ Persist bot message with confidence and structured meta
      botMsg = await prisma.message.create({
        data: {
          sessionId,
          sender: "orion",
          text: reply,
          confidence: model_conf ?? undefined,
          ...(structuredMeta && { meta: structuredMeta }),
        },
      });

      //  Phase 3.5: Session confidence meter update
      const prevC = session.sessionConfidence ?? 1.0;
      const user_feedback = deriveUserFeedback(text);
      const messageHistory = messages.map(m => ({ sender: m.role === 'user' ? 'user' : 'orion', text: m.text }));
      const repeat_question = detectRepeatQuestion(text, messageHistory);

      const { next: sessionConfidence, penalty, boost } = updateSessionConfidence(
        prevC,
        {
          model_conf: model_conf ?? null,
          retrieval_score,
          user_feedback,
          repeat_question,
        },
        process.env
      );

      //  Logging for observability
      console.log({
        route: 'POST /messages',
        sessionId,
        model_conf,
        sessionConfidence,
        retrieval_score,
        shouldEscalate,
        escalationReason,
        penalty,
        boost,
        user_feedback,
        repeat_question,
      });

      // 5️ Update session with confidence tracking and escalation
      const updateData: any = {
        sessionConfidence,
        status: shouldEscalate ? 'escalated' : 'active',
        escalationReason: shouldEscalate ? escalationReason : null,
        oosStreak: oosTrip ? 0 : newOOS,
        updatedAt: new Date(),
      };
      
      if (penalty >= 0.25) {
        updateData.badTurns = { increment: 1 };
      }
      if (boost >= 0.05) {
        updateData.goodTurns = { increment: 1 };
      }

      await prisma.session.update({
        where: { id: sessionId },
        data: updateData,
      });

      // Add system message if escalated
      if (shouldEscalate) {
        await prisma.message.create({
          data: {
            sessionId,
            sender: "system",
            text:
              escalationReason === 'out_of_scope'
                ? "This conversation has been escalated to human support as your query appears to be outside our knowledge base."
                : "This conversation has been escalated to human support due to low confidence responses. An agent will assist you shortly.",
          },
        });
      }

      //  Phase 4: Auto-generate summary if threshold reached
      if (await shouldGenerateSummary(sessionId)) {
        // Generate summary asynchronously (don't block response)
        updateSessionSummary(sessionId)
          .then(summary => {
            console.log({
              event: 'auto_summary_generated',
              sessionId,
              summaryLength: summary.length,
            });
          })
          .catch(err => {
            console.error('Auto-summary error:', err);
          });
      }
    }

    // 6️ Respond to client with Phase 3.5 confidence metrics
    const responseData: any = {
      success: true,
      data: {
        userMessageId: userMsg.id,
        userMessage: userMsg,
        shouldEscalate,
      },
    };

    // Add bot response and confidence metrics if bot replied
    if (botMsg) {
      // Fetch updated session to get latest confidence values
      const updatedSession = await prisma.session.findUnique({
        where: { id: sessionId },
        select: { sessionConfidence: true, escalationReason: true },
      });

      responseData.data = {
        ...responseData.data,
        botMessageId: botMsg.id,
        botMessage: botMsg,
        reply: botMsg.text,
        confidence: botMsg.confidence,
        sessionConfidence: updatedSession?.sessionConfidence,
        retrievalScore: await faqRetrievalScore(session.companyId, text),
        escalationReason: updatedSession?.escalationReason,
      };
    }

    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
});

// PUT update message (rarely used, but included for completeness)
router.put("/:messageId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, messageId } = req.params as { sessionId: string; messageId: string };
    const { text, confidence } = req.body;

    // Check if message exists and belongs to the session
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: messageId,
        sessionId,
      },
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: { message: "Message not found" },
      });
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        ...(text && { text }),
        ...(confidence !== undefined && { confidence }),
      },
    });

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE message
router.delete("/:messageId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, messageId } = req.params as { sessionId: string; messageId: string };

    // Check if message exists and belongs to the session
    const existingMessage = await prisma.message.findFirst({
      where: {
        id: messageId,
        sessionId,
      },
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: { message: "Message not found" },
      });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;