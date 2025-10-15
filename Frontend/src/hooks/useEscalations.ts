import { useEffect, useState } from 'react';
import { ensureCompanyId } from '@/lib/ensureCompanyId';
import { apiFetch } from '@/lib/api';
import type { Session } from './useSessions';

export type EscalationStatus = 'Open' | 'In Progress' | 'Resolved';

export type Escalation = {
  id: string;
  sessionId: string;
  user: string;
  reason: string;
  assignedTo?: string;
  status: EscalationStatus;
  createdAt: string;
  updatedAt?: string;
};

// Map session to escalation format
function sessionToEscalation(session: Session): Escalation {
  // Map session status to escalation status
  let escalationStatus: EscalationStatus;
  if (session.status === 'closed') {
    escalationStatus = 'Resolved';
  } else if (session.status === 'active') {
    escalationStatus = 'In Progress';
  } else {
    escalationStatus = 'Open';
  }

  return {
    id: `ESC-${session.id.slice(-6)}`,
    sessionId: session.id,
    user: session.user,
    reason: (session as any).escalationReason || 'Low confidence',
    assignedTo: (session as any).assignedTo,
    status: escalationStatus,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export function useEscalations() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEscalations = async () => {
    setLoading(true);
    setError(null);

    try {
      const companyId = await ensureCompanyId();
      
      // Fetch escalated sessions (status = 'escalated')
      const { data, error: apiError } = await apiFetch<Session[]>(
        `/companies/${companyId}/sessions?status=escalated`
      );

      if (apiError) {
        throw new Error(apiError);
      }

      // Convert sessions to escalation format
      const escalationsList = (data || []).map(sessionToEscalation);
      setEscalations(escalationsList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch escalations');
      console.error('Error fetching escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  return { escalations, loading, error, refetch: fetchEscalations };
}

/**
 * Update an escalation's status or assignment
 * (Updates the underlying session)
 */
export async function updateEscalation(
  sessionId: string,
  payload: { status?: EscalationStatus; assignedTo?: string }
) {
  // Map escalation status to session status
  let sessionStatus: 'active' | 'escalated' | 'closed' | undefined;
  if (payload.status === 'Resolved') {
    sessionStatus = 'closed';
  } else if (payload.status === 'In Progress') {
    sessionStatus = 'active';
  } else if (payload.status === 'Open') {
    sessionStatus = 'escalated';
  }

  return apiFetch(`/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...(sessionStatus && { status: sessionStatus }),
      ...(payload.assignedTo && { assignedTo: payload.assignedTo }),
    }),
  });
}

/**
 * Fetch details for a specific escalation (session)
 */
export async function getEscalationDetails(sessionId: string) {
  const { data } = await apiFetch<Session>(`/sessions/${sessionId}`);
  if (data) {
    return { data: sessionToEscalation(data) };
  }
  return { data: null };
}
