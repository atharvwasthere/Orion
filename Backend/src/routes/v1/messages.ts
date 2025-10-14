import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";
import { generate } from "../../llm/adapter.ts";

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
      const { text: reply, confidence: botConfidence } = await generate({
        messages,
        knowledge,
      });

      // 4️⃣ Persist bot message
      botMsg = await prisma.message.create({
        data: {
          sessionId,
          sender: "orion",
          text: reply,
          confidence: botConfidence,
        },
      });

      // 5️⃣ Escalation logic
      const threshold = parseFloat(process.env.CONF_THRESHOLD ?? "0.4");
      shouldEscalate = botConfidence !== null && botConfidence < threshold;

      if (shouldEscalate) {
        await prisma.session.update({
          where: { id: sessionId },
          data: {
            status: "escalated",
            escalationReason: `Low confidence response (${botConfidence?.toFixed(2)}). Human assistance required.`,
          },
        });

        // Add system message about escalation
        await prisma.message.create({
          data: {
            sessionId,
            sender: "system",
            text: "This conversation has been escalated to a human agent due to complexity. An agent will assist you shortly.",
          },
        });
      }
    }

    // Update session's updatedAt timestamp
    await prisma.session.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    // 6️⃣ Respond to client
    res.status(201).json({
      success: true,
      data: {
        userMessageId: userMsg.id,
        userMessage: userMsg,
        ...(botMsg && {
          botMessageId: botMsg.id,
          botMessage: botMsg,
          reply: botMsg.text,
          confidence: botMsg.confidence,
        }),
        shouldEscalate,
      },
    });
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