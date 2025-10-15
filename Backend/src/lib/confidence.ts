/**
 * Confidence Calculation & Smoothing Utilities
 * Phase 7: Adaptive Confidence & Escalation Intelligence
 */

export type ConfidenceMode = 'confident' | 'cautious' | 'unsure' | 'escalate';

// Environment-based thresholds with defaults
const CONF_THRESHOLD_STRONG = parseFloat(process.env.CONF_THRESHOLD_STRONG || '0.8');
const CONF_THRESHOLD_WEAK = parseFloat(process.env.CONF_THRESHOLD_WEAK || '0.5');
const CONF_THRESHOLD_ESCALATE = parseFloat(process.env.CONF_THRESHOLD_ESCALATE || '0.3');
export const CONF_SMOOTHING_FACTOR = parseFloat(process.env.CONF_SMOOTHING_FACTOR || '0.2');

/**
 * Apply sigmoid smoothing to prevent over-penalization for mild uncertainty
 * Maps raw confidence through a sigmoid curve centered at 0.5
 */
export function smoothConfidence(raw: number): number {
  // Sigmoid function: 1 / (1 + e^(-8*(x-0.5)))
  // This compresses extremes and keeps midrange stable
  const sigmoid = 1 / (1 + Math.exp(-8 * (raw - 0.5)));
  return Math.max(0, Math.min(1, sigmoid));
}

/**
 * Calculate confidence score from multiple signals
 * Uses geometric mean + familiarity boost + sigmoid smoothing
 */
export function calculateConfidence(params: {
  retrievalScore: number;
  llmConfidence: number;
  query: string;
  companyName: string;
}): number {
  const { retrievalScore, llmConfidence, query, companyName } = params;

  // Geometric mean keeps midrange stable (doesn't over-penalize one low score)
  let confidence = Math.pow(retrievalScore * llmConfidence, 0.5);

  // Context familiarity boost: reward company-related queries
  if (query.toLowerCase().includes(companyName.toLowerCase())) {
    confidence = Math.min(1, confidence + 0.1);
  }

  // Apply sigmoid smoothing to compress extremes
  confidence = smoothConfidence(confidence);

  return Math.min(1, Math.max(0, confidence));
}

/**
 * Determine confidence mode based on thresholds
 */
export function getConfidenceMode(confidence: number): ConfidenceMode {
  if (confidence >= CONF_THRESHOLD_STRONG) return 'confident';
  if (confidence >= CONF_THRESHOLD_WEAK) return 'cautious';
  if (confidence >= CONF_THRESHOLD_ESCALATE) return 'unsure';
  return 'escalate';
}

/**
 * Update session confidence using Exponential Moving Average (EMA)
 * Smooths confidence over time for conversational stability
 */
export function updateSessionConfidence(
  currentSessionConfidence: number,
  newTurnConfidence: number
): number {
  return (
    (1 - CONF_SMOOTHING_FACTOR) * currentSessionConfidence +
    CONF_SMOOTHING_FACTOR * newTurnConfidence
  );
}

/**
 * Check if escalation is warranted based on recent confidence history
 * Only escalates after sustained low confidence (not a single bad turn)
 */
export function shouldEscalate(recentConfidences: number[]): boolean {
  if (recentConfidences.length === 0) return false;

  // Look at last 3 turns
  const recent = recentConfidences.slice(-3);
  const avgRecent = recent.reduce((sum, conf) => sum + conf, 0) / recent.length;

  // Sustained low confidence threshold
  return avgRecent < 0.4;
}

/**
 * Generate reply prefix based on confidence mode
 * Adds hedging language for lower confidence responses
 */
export function getReplyPrefix(mode: ConfidenceMode, companyName: string): string {
  switch (mode) {
    case 'confident':
      return '';
    case 'cautious':
      return `Based on what I know about ${companyName}, I believe `;
    case 'unsure':
      return `I'm not entirely sure, but it might be `;
    case 'escalate':
      return '';
  }
}

/**
 * Get escalation message
 */
export function getEscalationMessage(): string {
  return "I'm not confident enough to answer that accurately. Let me connect you with someone who can help.";
}

/**
 * Get clarification request message
 */
export function getClarificationMessage(): string {
  return "I'm not sure I fully understand. Could you provide a bit more detail or context?";
}

/**
 * Log confidence metrics for monitoring and tuning
 */
export function logConfidenceMetrics(params: {
  sessionId: string;
  retrievalScore: number;
  llmConfidence: number;
  finalConfidence: number;
  mode: ConfidenceMode;
  escalated: boolean;
}): void {
  const timestamp = new Date().toISOString();
  console.log(
    `[CONFIDENCE] ${timestamp} | Session: ${params.sessionId} | ` +
    `Retrieval: ${params.retrievalScore.toFixed(3)} | ` +
    `LLM: ${params.llmConfidence.toFixed(3)} | ` +
    `Final: ${params.finalConfidence.toFixed(3)} | ` +
    `Mode: ${params.mode} | ` +
    `Escalated: ${params.escalated}`
  );
}

/**
 * Export thresholds for use in other modules
 */
export const CONFIDENCE_THRESHOLDS = {
  STRONG: CONF_THRESHOLD_STRONG,
  WEAK: CONF_THRESHOLD_WEAK,
  ESCALATE: CONF_THRESHOLD_ESCALATE,
} as const;
