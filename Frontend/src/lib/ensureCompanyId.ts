import { apiFetch } from './api';

/**
 * Ensures a companyId exists - first checks env, then localStorage, then fetches/creates
 */
export async function ensureCompanyId(): Promise<string> {
  // Check env variable first
  if (import.meta.env.VITE_COMPANY_ID) {
    return import.meta.env.VITE_COMPANY_ID;
  }

  // Check localStorage cache
  const cached = localStorage.getItem('companyId');
  if (cached) return cached;

  // Fetch existing companies
  const { data: companies, error: fetchErr } = await apiFetch<any[]>('/companies');
  
  if (!fetchErr && companies && companies.length > 0) {
    const id = companies[0].id;
    localStorage.setItem('companyId', id);
    return id;
  }

  // Create new company if none exist
  const { data: newCompany, error: createErr } = await apiFetch<{ id: string }>('/companies', {
    method: 'POST',
    body: JSON.stringify({ name: 'Acme Inc.' }),
  });

  if (createErr || !newCompany?.id) {
    throw new Error(`Failed to create company: ${createErr}`);
  }

  localStorage.setItem('companyId', newCompany.id);
  return newCompany.id;
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
