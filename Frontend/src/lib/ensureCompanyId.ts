import { apiFetch } from './api';
import { ensureActiveCompany } from './companyContext';

/**
 * Ensures a companyId exists - delegates to the new company context system
 * @deprecated Use ensureActiveCompany from companyContext instead
 */
export async function ensureCompanyId(): Promise<string> {
  // Check env variable first (for backward compatibility)
  if (import.meta.env.VITE_COMPANY_ID) {
    return import.meta.env.VITE_COMPANY_ID;
  }

  // Delegate to new context system
  return ensureActiveCompany();
}

/**
 * Creates a new session for the given user
 */
export async function createSession(user: string): Promise<string> {
  const companyId = await ensureCompanyId();
  
  const { data: session, error } = await apiFetch<{ id: string }>(
    `/companies/${companyId}/sessions`,
    {
      method: 'POST',
      body: JSON.stringify({ user }),
    }
  );

  if (error || !session?.id) {
    throw new Error(`Failed to create session: ${error}`);
  }

  localStorage.setItem('sessionId', session.id);
  return session.id;
}
