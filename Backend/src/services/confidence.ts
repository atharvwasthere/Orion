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
  // Hallucination: confident answer but poor retrieval grounding
  if (mc != null && mc >= 0.70 && r < 0.20) penalty += oHall;

  // Calculate boosts
  let boost = 0;
  if (s.user_feedback === 'helpful') boost += helpful;
  // Well-grounded response
  if (mc != null && mc >= 0.75 && r >= 0.60) boost += grounded;
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
  const TH = parseFloat(env.OOS_THRESHOLD ?? '0.25');
  return (retrieval_score ?? 0) < TH ? prev + 1 : 0;
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
