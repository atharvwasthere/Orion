import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { ensureCompanyId, createSession } from '@/lib/ensureCompanyId';

/**
 * useChat hook for the preview chat (/chat route)
 * 
 * IMPORTANT: This hook automatically creates a session if none exists in localStorage.
 * Only use this for the interactive preview chat page.
 * 
 * For read-only views (e.g., /dashboard/conversations/:id), fetch session data
 * directly with apiFetch() instead of using this hook.
 */

export type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  createdAt: string;
  confidence?: number;
  retrievalScore?: number;
};

export type TurnResponse = {
  reply: string;
  confidence: number;
  retrievalScore: number;
  sessionConfidence: number;
  shouldEscalate: boolean;
  escalationReason?: string;
  userMessage: Message;
  botMessage: Message;
};

export type Summary = {
  summary: string;
  updatedAt: string;
};

export type Signals = {
  confidence: number;
  retrievalScore: number;
  sessionConfidence: number;
};

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [signals, setSignals] = useState<Signals>({
    confidence: 0,
    retrievalScore: 0,
    sessionConfidence: 0,
  });
  const [escalated, setEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session and company
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get or create company
        const cId = await ensureCompanyId();
        setCompanyId(cId);

        // Get or create session, ensuring it belongs to current company
        let sId = localStorage.getItem('sessionId');
        const sessionCompanyId = localStorage.getItem('sessionCompanyId');

        // If no session OR session belongs to different company, create new one
        if (!sId || sessionCompanyId !== cId) {
          console.log('[useChat] Creating new session for company:', cId);
          sId = await createSession('guest@example.com');
          // Store the company this session belongs to
          localStorage.setItem('sessionCompanyId', cId);
        }
        setSessionId(sId);

        // Load messages
        await loadMessages(sId);
        
        // Load summary
        await loadSummary(sId);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize chat');
        console.error('Chat init error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Load messages
  const loadMessages = async (sId: string) => {
    const { data, error: err } = await apiFetch<Message[]>(`/sessions/${sId}/messages`);
    if (err) {
      console.error('Failed to load messages:', err);
      return;
    }
    if (data && Array.isArray(data)) {
      setMessages(data);
      
      // Update signals from last bot message
      const lastBotMsg = [...data].reverse().find((m) => m.sender === 'bot');
      if (lastBotMsg && lastBotMsg.confidence !== undefined) {
        setSignals({
          confidence: lastBotMsg.confidence,
          retrievalScore: lastBotMsg.retrievalScore || 0,
          sessionConfidence: signals.sessionConfidence, // Keep existing or update from session
        });
      }
    }
  };

  // Load summary
  const loadSummary = async (sId: string) => {
    const { data, error: err } = await apiFetch<{ summary: string; updatedAt: string }>(`/sessions/${sId}/summary`);
    if (!err && data) {
      setSummary(data);
    }
  };

  // Send message
  const sendMessage = async (text: string) => {
    if (!sessionId || !text.trim() || sending || escalated) return;

    setSending(true);
    setError(null);

    // Optimistic update
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data, error: err } = await apiFetch<TurnResponse>(`/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ sender: 'user', text: text.trim() }),
      });

      if (err || !data) {
        throw new Error(err || 'Failed to send message');
      }

      // Replace temp message with real ones
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, data.userMessage, data.botMessage];
      });

      // Update signals
      setSignals({
        confidence: data.confidence,
        retrievalScore: data.retrievalScore,
        sessionConfidence: data.sessionConfidence,
      });

      // Handle escalation
      if (data.shouldEscalate) {
        setEscalated(true);
        setEscalationReason(data.escalationReason || 'Confidence threshold breached');
      }

      // Reload summary
      await loadSummary(sessionId);

      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      setError(err.message || 'Failed to send message');
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  return {
    sessionId,
    companyId,
    messages,
    summary,
    signals,
    escalated,
    escalationReason,
    loading,
    sending,
    error,
    sendMessage,
    scrollRef,
  };
}
