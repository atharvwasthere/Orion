import { prisma } from '../config/prisma.js';
import { embedQueryText } from '../lib/embeddings.js';

/**
 * Phase 5: Hybrid Context Retrieval
 * Combines company profile (condensed global context) with top-k FAQ matches
 */

export interface HybridContext {
  companyProfile: string | null;
  topFAQs: Array<{
    question: string;
    answer: string;
    score: number;
  }>;
}

/**
 * Retrieve hybrid context for a given query
 * @param companyId - Company identifier
 * @param query - User query text
 * @param topK - Number of top FAQs to retrieve (default: 3)
 * @returns Combined context with profile and top FAQs
 */
export async function getHybridContext(
  companyId: string,
  query: string,
  topK: number = 10
): Promise<HybridContext> {
  try {
    // 1. Fetch company profile (condensed global context)
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { companyProfile: true } ,
    });

    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    // 2. Fetch all FAQs with embeddings
    const faqs = await prisma.fAQ.findMany({
      where: { companyId },
      select: {
        question: true,
        answer: true,
        embedding: true,
      },
    });

    if (faqs.length === 0) {
      return {
        companyProfile: company.companyProfile,
        topFAQs: [],
      };
    }

    // 3. Embed user query
    const queryVec = await embedQueryText(query);

    // 4. Calculate cosine similarity for each FAQ
    const scoredFAQs = faqs
      .map((faq) => {
        if (!Array.isArray(faq.embedding) || faq.embedding.length === 0) {
          return null;
        }

        const score = cosineSimilarity(queryVec, faq.embedding);
        return {
          question: faq.question,
          answer: faq.answer,
          score,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // 5. Sort by score and take top K
    const topFAQs = scoredFAQs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return {
      companyProfile: company.companyProfile,
      topFAQs,
    };
  } catch (error) {
    console.error('Hybrid context retrieval error:', error);
    throw error;
  }
}

/**
 * Manual cosine similarity calculation
 * (Using local implementation since compute-cosine-similarity is not installed)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return normA && normB ? dot / (normA * normB) : 0;
}

/**
 * Format hybrid context for LLM prompt
 * Creates a structured context string combining profile and FAQs
 */
export function formatHybridContext(context: HybridContext): string {
  let formatted = '';

  // Add company profile if available
  if (context.companyProfile) {
    formatted += `Company Profile:\n${context.companyProfile}\n\n`;
  }

  // Add top FAQs
  if (context.topFAQs.length > 0) {
    formatted += 'Relevant FAQs:\n';
    context.topFAQs.forEach((faq, idx) => {
      formatted += `${idx + 1}. Q: ${faq.question}\n   A: ${faq.answer}\n   (Relevance: ${(faq.score * 100).toFixed(1)}%)\n\n`;
    });
  }

  return formatted.trim();
}
