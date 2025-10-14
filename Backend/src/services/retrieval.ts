import { prisma as db } from '../config/prisma';
import { jaccard } from './helpers';

/**
 * Calculate retrieval score for a user query against company FAQs
 * Returns a score between 0 and 1 indicating how well the query matches available FAQs
 * 
 * This is a simple lexical matching approach. In production, we'd use:
 * - Vector embeddings (cosine similarity)
 * - Semantic search with embedding models
 * - Hybrid search (lexical + semantic)
 */
export async function faqRetrievalScore(
  companyId: string,
  userQuery: string
): Promise<number> {
  try {
    // Fetch all FAQs for the company
    const faqs = await db.fAQ.findMany({
      where: { companyId },
      select: { question: true, answer: true }
    });

    if (faqs.length === 0) {
      return 0; // No FAQs available
    }

    const query = userQuery.toLowerCase();
    let maxScore = 0;

    // Find best matching FAQ using Jaccard similarity
    for (const faq of faqs) {
      const qScore = jaccard(query, faq.question.toLowerCase());
      const aScore = jaccard(query, faq.answer.toLowerCase()) * 0.5; // Answer less weighted
      
      const score = Math.max(qScore, aScore);
      if (score > maxScore) {
        maxScore = score;
      }
    }

    return maxScore;
  } catch (error) {
    console.error('FAQ retrieval score error:', error);
    return 0; // Default to 0 on error
  }
}

/**
 * Simple OOS (Out-of-Scope) classifier
 * Returns probability (0-1) that query is out of scope
 * 
 * This is a naive heuristic implementation. In production,we'd use:
 * - Fine-tuned classification model
 * - Intent detection service
 * - Rule-based + ML hybrid
 */
export function cheapOOSClassifier(userQuery: string): number | null {
  const query = userQuery.toLowerCase();
  
  // Patterns that suggest OOS
  const oosPatterns = [
    /talk to.*human/i,
    /speak.*person/i,
    /connect.*agent/i,
    /transfer.*someone/i,
    /this.*not.*helping/i,
    /different.*topic/i,
    /nothing.*related/i,
  ];

  // Count OOS pattern matches
  const matches = oosPatterns.filter(p => p.test(query)).length;
  
  if (matches > 0) {
    return Math.min(0.8, 0.4 + (matches * 0.2)); // Probability based on matches
  }

  return null; // No explicit OOS signals detected
}
