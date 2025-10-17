import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Route } from "@/routes/dashboard/conversations/$id"
import { useRouter } from "@tanstack/react-router"
import { Loader2, ArrowLeft } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { router } from "@/router"
import type { Message, Summary } from "@/hooks/useChat"

type Session = {
  id: string;
  user: string;
  status: 'active' | 'escalated' | 'closed';
  createdAt: string;
  updatedAt: string;
};

export default function ConversationDetailPage() {
  const { id: sessionId } = Route.useParams();
  
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data - READ ONLY, no session creation
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch messages
        const { data: messagesData, error: messagesError } = await apiFetch<Message[]>(
          `/sessions/${sessionId}/messages`
        );
        if (messagesError) throw new Error(messagesError);
        if (messagesData) setMessages(messagesData);

        // Only fetch summary if messages exist
        if (messagesData && messagesData.length > 0) {
          const { data: summaryData } = await apiFetch<Summary>(
            `/sessions/${sessionId}/summary`
          );
          if (summaryData) setSummary(summaryData);
        }

        // Fetch session info (if available)
        const { data: sessionData } = await apiFetch<Session>(
          `/sessions/${sessionId}`
        );
        if (sessionData) setSession(sessionData);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversation');
        console.error('Error loading conversation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'escalated': return 'bg-amber-100 text-amber-700';
      case 'closed': return 'bg-zinc-100 text-zinc-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Conversation</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.navigate({ to: '/dashboard/conversations' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Conversations
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold">{session?.user || 'Conversation'}</h1>
            {session?.status && (
              <Badge className={getStatusColor(session.status)}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Session ID: {sessionId} · {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.navigate({ to: '/dashboard/conversations' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Transcript */}
        <Card className="lg:col-span-2 border-2">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Chat Transcript</h2>
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No messages in this conversation yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === "user" ? "bg-[#FF7A1A] text-white" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.text}</p>
                      <div className="flex items-center justify-between gap-2 text-xs opacity-70">
                        <span>{formatTime(msg.createdAt)}</span>
                        {msg.sender === "bot" && msg.confidence !== undefined && (
                          <span className="font-medium">Confidence: {msg.confidence.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Confidence Timeline */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-semibold mb-4">Confidence Timeline</h3>
              <div className="space-y-3">
                {messages
                  .filter((m) => m.sender === 'bot' && m.confidence !== undefined)
                  .map((msg) => (
                    <div key={msg.id} className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            msg.confidence! >= 0.85 ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(msg.confidence || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{msg.confidence?.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
              {messages.filter((m) => m.sender === 'bot' && m.confidence).length === 0 && (
                <p className="text-sm text-muted-foreground italic">No confidence data available.</p>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-semibold mb-3">Summary</h3>
              {summary ? (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {summary.summary}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatTime(summary.updatedAt)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No summary available yet. Summary is generated after conversation activity.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="border-2">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-display text-sm font-semibold mb-3">Session Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {session?.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                {session?.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  This is a read-only view. To continue the conversation, use the preview chat.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
