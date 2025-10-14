import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";
import { updateSessionSummary } from "../../services/summary";

const router = Router({ mergeParams: true }); // mergeParams to access companyId from parent route

// GET all sessions for a company
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params as { companyId: string };
    const { status, user } = req.query;
    
    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }

    const sessions = await prisma.session.findMany({
      where: {
        companyId,
        ...(status && { status: status as string }),
        ...(user && { user: user as string }),
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
});

// GET single session by ID
router.get("/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, sessionId } = req.params as { companyId: string; sessionId: string };
    
    const session = await prisma.session.findFirst({
      where: { 
        id: sessionId,
        companyId,
      },
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

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

// POST create new session
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params as { companyId: string };
    const { user } = req.body;

    // Validate required fields
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { message: "User identifier is required" },
      });
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }

    const session = await prisma.session.create({
      data: {
        companyId,
        user,
        status: "active",
      },
      include: {
        messages: true,
      },
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH update session (status/escalation) - As per API contract Phase 2
router.patch("/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, sessionId } = req.params as { companyId: string; sessionId: string };
    const { status, escalationReason, summary } = req.body;

    // Validate status if provided
    if (status && !["active", "escalated", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid status. Must be 'active', 'escalated', or 'closed'" },
      });
    }

    // Check if session exists and belongs to the company
    const existingSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        companyId,
      },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    // If escalating, require escalationReason
    if (status === "escalated" && !escalationReason) {
      return res.status(400).json({
        success: false,
        error: { message: "Escalation reason is required when escalating a session" },
      });
    }

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(status && { status }),
        ...(escalationReason && { escalationReason }),
        ...(summary !== undefined && { summary }),
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

// PUT update session (full update for backward compatibility)
router.put("/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, sessionId } = req.params as { companyId: string; sessionId: string };
    const { status, escalationReason, summary } = req.body;

    // Validate status if provided
    if (status && !["active", "escalated", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid status. Must be 'active', 'escalated', or 'closed'" },
      });
    }

    // Check if session exists and belongs to the company
    const existingSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        companyId,
      },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    // If escalating, require escalationReason
    if (status === "escalated" && !escalationReason) {
      return res.status(400).json({
        success: false,
        error: { message: "Escalation reason is required when escalating a session" },
      });
    }

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(status && { status }),
        ...(escalationReason && { escalationReason }),
        ...(summary !== undefined && { summary }),
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
});

// GET session summary - Phase 4
router.get("/:sessionId/summary", async (req: Request, res: Response, next: NextFunction) => {
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

    // Generate and update summary
    const summary = await updateSessionSummary(sessionId);

    res.json({
      success: true,
      data: {
        sessionId,
        summary,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE session
router.delete("/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, sessionId } = req.params as { companyId: string; sessionId: string };

    // Check if session exists and belongs to the company
    const existingSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        companyId,
      },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        error: { message: "Session not found" },
      });
    }

    // Delete session (will cascade delete messages due to Prisma schema relations)
    await prisma.session.delete({
      where: { id: sessionId },
    });

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;