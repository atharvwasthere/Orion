/**
 * Retrieval grounding is now computed via Gemini-embedding cosine similarity in
 * services/hybridContext.ts (getHybridContext → topFAQs[].score), reused directly by
 * the message route. The former lexical (Jaccard) faqRetrievalScore was removed.
 */

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
