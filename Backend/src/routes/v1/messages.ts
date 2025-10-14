import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";

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

    // Create the message
    const message = await prisma.message.create({
      data: {
        sessionId,
        sender,
        text,
        ...(confidence !== undefined && { confidence }),
      },
    });

    // Phase 2: Temporarily return a fixed bot message (mock) if sender is user
    let botResponse = null;
    if (sender === "user") {
      // Generate mock bot response
      const mockResponses = [
        "Thank you for your message. I'm here to help you with your inquiry.",
        "I understand your concern. Let me look into that for you.",
        "I appreciate you reaching out. Could you provide more details?",
        "Thanks for contacting support. I'll do my best to assist you.",
        "I see what you're asking about. Let me help you with that.",
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Create bot response message
      botResponse = await prisma.message.create({
        data: {
          sessionId,
          sender: "orion",
          text: randomResponse,
          confidence: 0.95, // Mock confidence score
        },
      });
    }

    // Update session's updatedAt timestamp
    await prisma.session.update({
      where: { id: sessionId } ,
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      success: true,
      data: {
        userMessage: message,
        ...(botResponse && { botResponse }),
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