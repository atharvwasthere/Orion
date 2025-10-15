const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

export { BASE };

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const err = await res.text();
      return { data: null as any, error: err || `HTTP ${res.status}` };
    }

    const json = await res.json();
    return { data: json.data || json };
  } catch (err: any) {
    return { data: null as any, error: err.message || 'Network error' };
  }
}
