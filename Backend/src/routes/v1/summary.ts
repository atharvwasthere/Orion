import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";

const router = Router({ mergeParams: true }); // mergeParams to access sessionId from parent route

// GET summary for a session
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    
    // Get session with summary
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        summary: true,
        status: true,
        user: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    if (!session.summary) {
      return res.status(404).json({
        success: false,
        error: { message: "No summary available for this session" },
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        summary: session.summary,
        sessionStatus: session.status,
        messageCount: session._count.messages,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST create or update summary for a session
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const { summary } = req.body;

    // Validate required fields
    if (!summary) {
      return res.status(400).json({
        success: false,
        error: { message: "Summary content is required" },
      });
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    // Update session with summary
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { summary },
      select: {
        id: true,
        summary: true,
        status: true,
        user: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    res.status(session.summary ? 200 : 201).json({
      success: true,
      message: session.summary ? "Summary updated successfully" : "Summary created successfully",
      data: {
        sessionId: updatedSession.id,
        summary: updatedSession.summary,
        sessionStatus: updatedSession.status,
        messageCount: updatedSession._count.messages,
        createdAt: updatedSession.createdAt,
        updatedAt: updatedSession.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE summary from a session
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };

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

    if (!session.summary) {
      return res.status(404).json({
        success: false,
        error: { message: "No summary to delete" },
      });
    }

    // Remove summary from session
    await prisma.session.update({
      where: { id: sessionId },
      data: { summary: null },
    });

    res.json({
      success: true,
      message: "Summary deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// POST generate summary (AI-powered - placeholder for future implementation)
router.post("/generate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const { llmProvider = "mock" } = req.body; // Default to mock for now

    // Check if session exists with messages
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    if (session.messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: "Cannot generate summary: No messages in session" },
      });
    }

    // TODO: Implement actual LLM integration here
    // For now, create a mock summary
    const conversationText = session.messages
      .map(m => `${m.sender}: ${m.text}`)
      .join("\n");
    
    const mockSummary = `Summary of conversation with ${session.user}:\n` +
      `- Session started at ${session.createdAt.toISOString()}\n` +
      `- Total messages: ${session.messages.length}\n` +
      `- Status: ${session.status}\n` +
      `- Key topics discussed: [This would be generated by AI]\n` +
      `- Resolution: [This would be generated by AI]`;

    // Update session with generated summary
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { summary: mockSummary },
    });

    res.json({
      success: true,
      message: "Summary generated successfully",
      data: {
        sessionId: updatedSession.id,
        summary: updatedSession.summary,
        generatedBy: llmProvider,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;