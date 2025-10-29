import { Router} from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { embedFAQText } from "../../lib/embeddings.js";
import { generateCompanyProfile } from "../../lib/companyProfile.js";

const router = Router({ mergeParams: true }); // mergeParams to access companyId from parent route

// POST bulk create FAQs (optimized for batch uploads)
router.post("/bulk", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params as { companyId: string };
    const { faqs } = req.body as { faqs: Array<{ question: string; answer: string; tags?: string[] }> };

    // Validate input
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: "FAQs array is required and must not be empty" },
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

    console.log(`📦 Bulk upload: Processing ${faqs.length} FAQs for company ${companyId}`);

    // Validate all FAQs first
    const invalidFaqs = faqs.filter(faq => !faq.question || !faq.answer);
    if (invalidFaqs.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `${invalidFaqs.length} FAQs missing question or answer` },
      });
    }

    // Generate embeddings for all FAQs concurrently
    console.log(` Generating embeddings for ${faqs.length} FAQs...`);
    const embeddingPromises = faqs.map(async (faq) => {
      const faqText = `${faq.question} ${faq.answer}`;
      const embedding = await embedFAQText(faqText);
      return {
        companyId,
        question: faq.question,
        answer: faq.answer,
        tags: faq.tags || [],
        embedding,
      };
    });

    const faqsWithEmbeddings = await Promise.all(embeddingPromises);
    console.log(`✅ All embeddings generated`);

    // Insert all FAQs in a single transaction
    console.log(` Saving ${faqs.length} FAQs to database...`);
    const createdFaqs = await prisma.$transaction(
      faqsWithEmbeddings.map((faq) =>
        prisma.fAQ.create({ data: faq })
      )
    );
    console.log(`✅ All FAQs saved`);

    // Regenerate company profile ONCE after all FAQs are saved
    console.log(` Generating company profile (single Gemini call)...`);
    try {
      await generateCompanyProfile(companyId);
      console.log(`✅ Company profile regenerated for company ${companyId}`);
    } catch (err: any) {
      console.error(`❌ Failed to regenerate company profile: ${err.message}`);
      // Don't fail the request if profile generation fails
    }

    res.status(201).json({
      success: true,
      data: {
        created: createdFaqs.length,
        faqs: createdFaqs,
      },
    });
  } catch (error) {
    next(error);
  }
});

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
// WARNING: This triggers a company profile regeneration (Gemini API call)
// For bulk uploads, use POST /bulk instead to avoid quota overuse
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
// WARNING: This triggers a company profile regeneration if content changes (Gemini API call)
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
// WARNING: This triggers a company profile regeneration (Gemini API call)
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