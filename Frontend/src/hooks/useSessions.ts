import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ensureCompanyId } from '@/lib/ensureCompanyId';

export type SessionStatus = 'active' | 'escalated' | 'closed';

export type Session = {
  id: string;
  user: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  confidence?: number;
  messageCount?: number;
};

export function useSessions(params?: { status?: SessionStatus; limit?: number }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      try {
        const companyId = await ensureCompanyId();
        
        // Build query params
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        
        const endpoint = `/companies/${companyId}/sessions${queryParams.toString() ? `?${queryParams}` : ''}`;
        const { data, error: err } = await apiFetch<Session[]>(endpoint);

        if (err) {
          setError(err);
          return;
        }

        if (data && Array.isArray(data)) {
          setSessions(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch sessions');
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [params?.status, params?.limit]);

  return { sessions, loading, error };
}
