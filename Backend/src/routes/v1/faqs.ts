import { Router} from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.ts";
import { embedFAQText } from "../../lib/embeddings.ts";
import { generateCompanyProfile } from "../../lib/companyProfile.ts";

const router = Router({ mergeParams: true }); // mergeParams to access companyId from parent route

// GET all FAQs for a company
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params as { companyId: string };
    
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

    const faqs = await prisma.fAQ.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
});

// GET single FAQ by ID
router.get("/:faqId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, faqId } = req.params as { companyId: string; faqId: string };
    
    const faq = await prisma.fAQ.findFirst({
      where: { 
        id: faqId,
        companyId,
      },
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: { message: "FAQ not found" },
      });
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
});

// POST create new FAQ
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params as { companyId: string };
    const { question, answer, tags = [] } = req.body ;

    // Validate required fields
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: { message: "Question and answer are required" },
      });
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId } ,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: "Company not found" },
      });
    }

    // Phase 2: Auto-generate embedding for FAQ
    const faqText = `${question} ${answer}`;
    const embedding = await embedFAQText(faqText);

    const faq = await prisma.fAQ.create({
      data: {
        companyId,
        question,
        answer,
        tags,
        embedding,
      },
    });

    // Phase 3: Regenerate company profile asynchronously
    generateCompanyProfile(companyId)
      .then(() => {
        console.log(`Company profile regenerated for company ${companyId}`);
      })
      .catch((err) => {
        console.error(`Failed to regenerate company profile: ${err.message}`);
      });

    res.status(201).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
});

// PUT update FAQ
router.put("/:faqId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, faqId } = req.params as { companyId: string; faqId: string };
    const { question, answer, tags } = req.body;

    // Check if FAQ exists and belongs to the company
    const existingFaq = await prisma.fAQ.findFirst({
      where: {
        id: faqId,
        companyId,
      },
    });

    if (!existingFaq) {
      return res.status(404).json({
        success: false,
        error: { message: "FAQ not found" },
      });
    }

    // Phase 2: Regenerate embedding if question or answer changed
    let embedding: number[] | undefined;
    if (question || answer) {
      const faqText = `${question || existingFaq.question} ${answer || existingFaq.answer}`;
      embedding = await embedFAQText(faqText);
    }

    const faq = await prisma.fAQ.update({
      where: { id: faqId },
      data: {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(tags !== undefined && { tags }),
        ...(embedding && { embedding }),
      },
    });

    // Phase 3: Regenerate company profile asynchronously if content changed
    if (question || answer) {
      generateCompanyProfile(companyId)
        .then(() => {
          console.log(`Company profile regenerated for company ${companyId}`);
        })
        .catch((err) => {
          console.error(`Failed to regenerate company profile: ${err.message}`);
        });
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE FAQ
router.delete("/:faqId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, faqId } = req.params as { companyId: string; faqId: string };

    // Check if FAQ exists and belongs to the company
    const existingFaq = await prisma.fAQ.findFirst({
      where: {
        id: faqId,
        companyId,
      },
    });

    if (!existingFaq) {
      return res.status(404).json({
        success: false,
        error: { message: "FAQ not found" },
      });
    }

    await prisma.fAQ.delete({
      where: { id: faqId },
    });

    // Phase 3: Regenerate company profile asynchronously
    generateCompanyProfile(companyId)
      .then(() => {
        console.log(`Company profile regenerated for company ${companyId}`);
      })
      .catch((err) => {
        console.error(`Failed to regenerate company profile: ${err.message}`);
      });

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;