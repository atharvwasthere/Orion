import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Link } from "@tanstack/react-router"
import { Progress } from "@/Components/ui/progress"

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

export default function DashboardPage() {
  const conversations = [
    { id: "user_24", topic: "Refund issue", confidence: 0.91, status: "Resolved" },
    { id: "user_13", topic: "Account login", confidence: 0.74, status: "Escalated" },
    { id: "user_9", topic: "Order status", confidence: 0.96, status: "Resolved" },
  ]

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
              <p className="font-semibold">Processing</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-semibold">Gemini 2.5 Flash</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Confidence threshold</p>
              <p className="font-semibold">0.82</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Context window</p>
              <p className="font-semibold">8 messages</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Uptime 99.97%</span>
              <Progress value={99.97} className="h-1 w-40 [&>div]:bg-green-500" />
            </div>
            <div className="text-sm text-muted-foreground">Last cache refresh: 2 minutes ago</div>
          </div>
        </CardContent>
      </Card>

      {/* Live Conversations Card */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Live Conversations</h2>
            <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
              View all
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-2.5">
                  <th>User</th>
                  <th>Topic</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {conversations.map((conv) => {
                  const good = conv.confidence >= 0.85
                  return (
                    <tr key={conv.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-4 py-2.5">
                        <Link
                        to="/dashboard/conversations/$id"
                        params={{ id: conv.id }}
                        className="font-medium hover:text-primary"
                        >
                          {conv.id}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{conv.topic}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 ${good ? "text-emerald-700" : "text-amber-700"}`}
                        >
                          {conv.confidence.toFixed(2)}
                          <TrendIcon up={good} />
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            conv.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {conv.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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

          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">142 FAQs</span> loaded ·{" "}
            <span className="font-semibold text-accent">3 flagged</span> for review · Last update:{" "}
            <span className="font-medium text-foreground">today 09:23</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
