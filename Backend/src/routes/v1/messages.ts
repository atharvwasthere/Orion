import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";
import { generate } from "../../llm/adapter.ts";
import {
  updateSessionConfidence,
  shouldEscalateLowConfidence,
  updateOOSStreak,
  isOOS,
} from "../../services/confidence.ts";
import { deriveUserFeedback, detectRepeatQuestion } from "../../services/helpers.ts";
import { faqRetrievalScore, cheapOOSClassifier } from "../../services/retrieval.ts";
import { shouldGenerateSummary, updateSessionSummary } from "../../services/summary.ts";

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

    // 1️⃣ Persist user message
    const userMsg = await prisma.message.create({
      data: {
        sessionId,
        sender,
        text,
        ...(confidence !== undefined && { confidence }),
      },
    });

    // Phase 3: LLM Orchestration - Generate intelligent response if sender is user
    let botMsg = null;
    let shouldEscalate = false;

    if (sender === "user") {
      // 2️⃣ Fetch context (recent messages, FAQs, summary)
      const sessionWithContext = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 10, // Last 10 messages for context
          },
          company: {
            include: {
              faqs: {
                take: 5, // Top 5 FAQs for context
              },
            },
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

      // Prepare knowledge base from FAQs
      const knowledge = sessionWithContext.company.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
      }));

      // 3️⃣ Generate response via LLM (Gemini or Mock)
      const { text: reply, confidence: model_conf } = await generate({
        messages,
        knowledge,
      });

      // 🔍 Phase 3.5: Compute retrieval score
      const retrieval_score = await faqRetrievalScore(
        sessionWithContext.company.id,
        text
      );

      // 🔍 Phase 3.5: Optional OOS classifier
      const prob_oos = cheapOOSClassifier(text);

      // 🔍 Phase 3.5: OOS handling (red wire - immediate escalation)
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

      // 🔍 Phase 3.5: Low-confidence check (per-message)
      if (!shouldEscalate && shouldEscalateLowConfidence(model_conf, process.env)) {
        shouldEscalate = true;
        escalationReason = 'low_confidence';
      }

      // 4️⃣ Persist bot message with confidence
      botMsg = await prisma.message.create({
        data: {
          sessionId,
          sender: "orion",
          text: reply,
          confidence: model_conf ?? undefined,
        },
      });

      // 🔍 Phase 3.5: Session confidence meter update
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

      // 📊 Logging for observability
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

      // 5️⃣ Update session with confidence tracking and escalation
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

      // 🔄 Phase 4: Auto-generate summary if threshold reached
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

    // 6️⃣ Respond to client with Phase 3.5 confidence metrics
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