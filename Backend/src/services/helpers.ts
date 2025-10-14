/**
 * Derive user feedback sentiment from message text
 * Uses pattern matching to detect retry requests or positive feedback
 */
export function deriveUserFeedback(user: string): 'retry' | 'helpful' | 'none' {
  const u = user.toLowerCase();
  
  // Check for negative feedback / retry patterns
  if (/(answer again|not.*help|didn.?t.*help|retry|try again|please explain|i don'?t understand)/i.test(u)) {
    return 'retry';
  }
  
  // Check for positive feedback
  if (/(thanks|thank you|that helps|that'?s helpful|got it|perfect|great|appreciate|helpful)/i.test(u)) {
    return 'helpful';
  }
  
  return 'none';
}

/**
 * Detect if user is re-asking a similar question
 * Uses Jaccard similarity to compare with recent user messages
 */
export function detectRepeatQuestion(
  user: string,
  recent: { sender: string; text: string }[]
): boolean {
  // Get last 2 user messages (excluding current)
  const lastQs = recent
    .filter(m => m.sender === 'user')
    .slice(-2)
    .map(m => m.text.toLowerCase());
  
  const u = user.toLowerCase();
  
  // Check if any recent question has high similarity (>85%)
  return lastQs.some(t => jaccard(u, t) > 0.85);
}

/**
 * Calculate Jaccard similarity between two strings
 * Returns value between 0 and 1, where 1 means identical word sets
 */
export function jaccard(a: string, b: string): number {
  // Tokenize by splitting on non-word characters
  const A = new Set(a.split(/\W+/).filter(Boolean));
  const B = new Set(b.split(/\W+/).filter(Boolean));
  
  // Calculate intersection
  const inter = [...A].filter(x => B.has(x)).length;
  
  // Calculate union
  const union = new Set([...A, ...B]).size;
  
  return union ? inter / union : 0;
}
