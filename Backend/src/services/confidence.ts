export type TurnSignals = {
  model_conf: number | null;
  retrieval_score: number | null;
  user_feedback: 'retry' | 'helpful' | 'none';
  repeat_question: boolean;
};

/**
 * Update session confidence using EWMA (Exponentially Weighted Moving Average)
 * with penalty/boost adjustments based on turn signals
 */
export function updateSessionConfidence(
  prev: number,
  s: TurnSignals,
  env: NodeJS.ProcessEnv
) {
  const L = parseFloat(env.CONF_LAMBDA ?? '0.6');
  const lowStart = parseFloat(env.LOW_CONF_LINEAR_START ?? '0.5');
  const oHall = parseFloat(env.HALLUCINATION_PENALTY ?? '0.20');
  const negFb = parseFloat(env.NEG_FEEDBACK_PENALTY ?? '0.30');
  const reask = parseFloat(env.REASK_PENALTY ?? '0.15');
  const helpful = parseFloat(env.HELPFUL_BOOST ?? '0.10');
  const grounded = parseFloat(env.GROUNDED_BOOST ?? '0.05');
  const maxBoost = parseFloat(env.MAX_TURN_BOOST ?? '0.10');

  const r = s.retrieval_score ?? 0;
  const mc = s.model_conf;

  // Calculate penalties
  let penalty = 0;
  if (s.user_feedback === 'retry') penalty += negFb;
  if (s.repeat_question) penalty += reask;
  if (mc != null && mc < lowStart) penalty += (lowStart - mc);
  // Hallucination: confident answer but poor retrieval grounding.
  // Retrieval is now embedding cosine similarity (unrelated text floors ~0.3-0.4),
  // so the "ungrounded" cutoff is 0.40, not the old lexical-Jaccard 0.20.
  if (mc != null && mc >= 0.70 && r < 0.40) penalty += oHall;

  // Calculate boosts
  let boost = 0;
  if (s.user_feedback === 'helpful') boost += helpful;
  // Well-grounded response (cosine: strong matches sit ~0.7-0.85)
  if (mc != null && mc >= 0.75 && r >= 0.70) boost += grounded;
  if (boost > maxBoost) boost = maxBoost;

  // Apply penalty/boost to previous confidence
  const candidate = Math.max(0, Math.min(1, prev - penalty + boost));
  
  // Apply EWMA smoothing
  const next = L * prev + (1 - L) * candidate;
  
  return { next, penalty, boost };
}

/**
 * Check if per-message model confidence is below threshold
 */
export function shouldEscalateLowConfidence(
  model_conf: number | null,
  env: NodeJS.ProcessEnv
) {
  const TH = parseFloat(env.CONF_THRESHOLD ?? '0.4');
  return model_conf != null && model_conf < TH;
}

/**
 * Update OOS (Out-of-Scope) streak counter
 * Increments if retrieval score is below threshold, resets to 0 otherwise
 */
export function updateOOSStreak(
  prev: number,
  retrieval_score: number | null,
  env: NodeJS.ProcessEnv
) {
  // Embedding cosine: a related FAQ scores ~0.6+, unrelated text ~0.3-0.45,
  // so the out-of-scope cutoff is 0.45 (was 0.25 when retrieval was lexical Jaccard).
  const TH = parseFloat(env.OOS_THRESHOLD ?? '0.45');
  return (retrieval_score ?? 0) < TH ? prev + 1 : 0;
}

/**
 * Sustained low-confidence escalation gate.
 * Gates on the EWMA-smoothed session confidence meter (so it reacts to a trend,
 * not a single bad turn) after a warm-up of SESSION_MIN_TURNS turns.
 */
export function shouldEscalateSession(
  sessionConfidence: number,
  turnCount: number,
  env: NodeJS.ProcessEnv
) {
  const floor = parseFloat(env.SESSION_CONF_FLOOR ?? '0.35');
  const minTurns = parseInt(env.SESSION_MIN_TURNS ?? '3', 10);
  return turnCount >= minTurns && sessionConfidence < floor;
}

/**
 * Determine if session should be escalated for OOS
 * Either by consecutive low retrieval scores or explicit OOS classification
 */
export function isOOS(
  oosStreak: number,
  env: NodeJS.ProcessEnv,
  prob_oos?: number | null
) {
  const need = parseInt(env.OOS_STREAK ?? '2', 10);
  if (oosStreak >= need) return true;
  if (prob_oos != null && prob_oos >= 0.6) return true;
  return false;
}
