import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Link } from "@tanstack/react-router"
import { Progress } from "@/Components/ui/progress"
import { Loader2 } from "lucide-react"
import { useSessions } from "@/hooks/useSessions"
import { apiFetch } from "@/lib/api"
import { ensureCompanyId } from "@/lib/ensureCompanyId"

// Function for TrendIcon
function TrendIcon({ up }: { up: boolean }) {
  return up ? (
    <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 12l4-4 3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg className="h-3.5 w-3.5 text-amber-600" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 8l4 4 3-3 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { sessions, loading: loadingSessions } = useSessions({ limit: 3 });
  const [faqCount, setFaqCount] = useState(0);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [recentFaqs, setRecentFaqs] = useState(0);

  // Fetch FAQ count
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const companyId = await ensureCompanyId();
        const { data } = await apiFetch<Faq[]>(`/companies/${companyId}/faqs`);
        if (data && Array.isArray(data)) {
          setFaqCount(data.length);
          // Count FAQs added in last 24 hours
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const recent = data.filter((faq) => new Date(faq.createdAt) > oneDayAgo);
          setRecentFaqs(recent.length);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchFaqs();
  }, []);

  // System config from env or defaults
  const systemConfig = {
    model: import.meta.env.VITE_MODEL_NAME || 'Gemini 2.5 Flash',
    threshold: import.meta.env.VITE_CONFIDENCE_THRESHOLD || '0.82',
    contextWindow: import.meta.env.VITE_CONTEXT_WINDOW || '8 messages',
  };

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Mission Control</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time assistant health and traffic.</p>
        </div>
        <Link to="/chat" aria-label="Open preview chat">
          <Button className="rounded-lg bg-[#FF7A1A] hover:bg-[#FF7A1A]/90">Go to preview chat</Button>
        </Link>
      </div>

      {/* System Summary Card */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">System Summary</h2>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/90 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">Online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">Online</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-semibold">{systemConfig.model}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Confidence threshold</p>
              <p className="font-semibold">{systemConfig.threshold}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Context window</p>
              <p className="font-semibold">{systemConfig.contextWindow}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Uptime 99.9%</span>
              <Progress value={99.9} className="h-1 w-40 [&>div]:bg-green-500" />
            </div>
            <div className="text-sm text-muted-foreground">System running smoothly</div>
          </div>
        </CardContent>
      </Card>

      {/* Live Conversations Card */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Live Conversations</h2>
            <Link to="/dashboard/conversations">
              <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                View all
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loadingSessions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p>No active conversations yet.</p>
                <p className="text-sm">Start a chat to see sessions here.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="[&>th]:px-4 [&>th]:py-2.5">
                    <th>User</th>
                    <th>Last Updated</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {sessions.map((session) => {
                    const confidence = session.confidence || 0;
                    const good = confidence >= 0.85;
                    return (
                      <tr key={session.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-4 py-2.5">
                          <Link
                            to="/dashboard/conversations/$id"
                            params={{ id: session.id }}
                            className="font-medium hover:text-primary"
                          >
                            {session.user}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatRelativeTime(session.updatedAt)}
                        </td>
                        <td className="px-4 py-2.5">
                          {confidence > 0 ? (
                            <span
                              className={`inline-flex items-center gap-1 ${
                                good ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              {confidence.toFixed(2)}
                              <TrendIcon up={good} />
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              session.status === "active"
                                ? "bg-green-100 text-green-700"
                                : session.status === "escalated"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Summary Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Knowledge Base Summary</h2>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link 
              to="/dashboard/faqs">Add FAQ</Link>            
            </Button>
          </div>

          {loadingFaqs ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading FAQs...</span>
            </div>
          ) : (
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{faqCount} FAQs</span> loaded
              {recentFaqs > 0 && (
                <>
                  {" · "}
                  <span className="font-semibold text-emerald-600">{recentFaqs} added today</span>
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
