import { apiFetch } from './api';

const COMPANY_ID_KEY = 'companyId';
const COMPANY_NAME_KEY = 'companyName';

export type Company = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Get the currently active company ID from localStorage
 */
export function getActiveCompanyId(): string | null {
  return localStorage.getItem(COMPANY_ID_KEY);
}

/**
 * Get the currently active company name from localStorage
 */
export function getActiveCompanyName(): string | null {
  return localStorage.getItem(COMPANY_NAME_KEY);
}

/**
 * Set the active company (stores both ID and name)
 */
export function setActiveCompany(id: string, name: string): void {
  localStorage.setItem(COMPANY_ID_KEY, id);
  localStorage.setItem(COMPANY_NAME_KEY, name);
}

/**
 * Clear the active company from localStorage
 */
export function clearActiveCompany(): void {
  localStorage.removeItem(COMPANY_ID_KEY);
  localStorage.removeItem(COMPANY_NAME_KEY);
}

/**
 * Fetch all companies from the API
 */
export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await apiFetch<Company[]>('/companies');
  
  if (error) {
    console.error('Failed to fetch companies:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Create a new company
 */
export async function createCompany(name: string): Promise<Company | null> {
  const { data, error } = await apiFetch<Company>('/companies', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  if (error || !data) {
    console.error('Failed to create company:', error);
    throw new Error(error || 'Failed to create company');
  }

  return data;
}

/**
 * Ensure a company is selected. If none exists, fetch/create one.
 * This is the replacement for the old ensureCompanyId logic.
 */
export async function ensureActiveCompany(): Promise<string> {
  // Check if already set
  const existing = getActiveCompanyId();
  if (existing) return existing;

  // Fetch companies
  const companies = await fetchCompanies();

  if (companies.length > 0) {
    // Set the first company as active
    const firstCompany = companies[0];
    setActiveCompany(firstCompany.id, firstCompany.name);
    return firstCompany.id;
  }

  // No companies exist - create a default one
  const newCompany = await createCompany('Default Company');
  if (newCompany) {
    setActiveCompany(newCompany.id, newCompany.name);
    return newCompany.id;
  }

  throw new Error('Failed to ensure active company');
}

/**
 * Switch to a different company and reload the page
 */
export function switchCompany(company: Company): void {
  setActiveCompany(company.id, company.name);
  // Reload to refresh all data with new company context
  window.location.reload();
}
