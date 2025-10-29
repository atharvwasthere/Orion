import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";

const router = Router();

// GET all companies
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
});

// GET single company by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            faqs: true,
            sessions: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
});

// POST create new company
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: "Company name is required" },
      });
    }

    const company = await prisma.company.create({
      data: { name },
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
});

// PUT update company
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: "Company name is required" },
      });
    }

    const company = await prisma.company.update({
      where: { id },
      data: { name },
    });

    res.json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }
    next(error);
  }
});

// DELETE company
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    await prisma.company.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }
    next(error);
  }
});

export default router;