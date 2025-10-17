import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ensureCompanyId } from '@/lib/ensureCompanyId';

export type FAQ = {
  id: string;
  companyId: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateFAQInput = {
  question: string;
  answer: string;
  tags?: string[];
};

export type UpdateFAQInput = {
  question?: string;
  answer?: string;
  tags?: string[];
};

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);

    try {
      const companyId = await ensureCompanyId();
      const { data, error: apiError } = await apiFetch<FAQ[]>(
        `/companies/${companyId}/faqs`
      );

      if (apiError) {
        throw new Error(apiError);
      }

      setFaqs(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch FAQs');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return { faqs, loading, error, refetch: fetchFaqs };
}

/**
 * Create a new FAQ
 */
export async function createFaq(input: CreateFAQInput) {
  const companyId = await ensureCompanyId();
  
  return apiFetch<FAQ>(`/companies/${companyId}/faqs`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Update an existing FAQ
 */
export async function updateFaq(faqId: string, input: UpdateFAQInput) {
  const companyId = await ensureCompanyId();
  
  return apiFetch<FAQ>(`/companies/${companyId}/faqs/${faqId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/**
 * Delete a FAQ
 */
export async function deleteFaq(faqId: string) {
  const companyId = await ensureCompanyId();
  
  return apiFetch(`/companies/${companyId}/faqs/${faqId}`, {
    method: 'DELETE',
  });
}

/**
 * Bulk upload FAQs from JSON array
 * Uses optimized bulk endpoint that generates embeddings in parallel
 * and triggers company profile generation only once
 */
export async function bulkUploadFaqs(faqs: CreateFAQInput[]) {
  const companyId = await ensureCompanyId();
  
  const { data, error } = await apiFetch<{ created: number; faqs: FAQ[] }>(
    `/companies/${companyId}/faqs/bulk`,
    {
      method: 'POST',
      body: JSON.stringify({ faqs }),
    }
  );

  if (error) {
    throw new Error(error);
  }

  return { 
    successful: data?.created || 0, 
    failed: faqs.length - (data?.created || 0), 
    total: faqs.length 
  };
}
