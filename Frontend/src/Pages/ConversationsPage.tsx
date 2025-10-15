import { Link } from "@tanstack/react-router" 
import { useMemo, useState } from "react"
import { Card } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import { Loader2 } from "lucide-react"
import { useSessions } from "@/hooks/useSessions"
import type { SessionStatus } from "@/hooks/useSessions"


function StatusBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    escalated: "bg-amber-50 text-amber-700 border border-amber-200",
    closed: "bg-zinc-50 text-zinc-700 border border-zinc-200",
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return <span className={`text-xs px-2 py-1 rounded-full ${map[status]}`}>{label}</span>
}

export default function ConversationsListPage() {
  const [tab, setTab] = useState<"all" | SessionStatus>("all")
  const { sessions, loading, error } = useSessions({ limit: 50 })

  const data = useMemo(() => {
    if (tab === "all") return sessions
    return sessions.filter((s) => s.status === tab)
  }, [tab, sessions])

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Conversations</h1>
          <p className="text-muted-foreground">Browse sessions and drill into details</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/chat">Open preview chat</Link>
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sessions list */}
        <Card className="p-0 border border-border/80 rounded-2xl lg:col-span-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600">
              <p className="font-medium">Error loading sessions</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="font-medium">No conversations found</p>
              <p className="text-sm mt-1">
                {tab === "all" ? "Start a chat to see sessions here." : `No ${tab} sessions.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {data.map((s) => (
                <Link
                  key={s.id}
                  to="/dashboard/conversations/$id"
                  params={{ id: s.id }}
                  className="flex items-start gap-3 p-4 hover:bg-muted/40 transition"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(s.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate">
                        <div className="font-medium truncate">{s.user}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.id}</div>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={s.status} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {s.messageCount ? `${s.messageCount} messages` : 'No messages'}
                      </span>
                      <span>{formatRelativeTime(s.updatedAt)}</span>
                    </div>
                    {s.confidence !== undefined && s.confidence > 0 && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              s.confidence >= 0.85 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${s.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {s.confidence.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Right: Placeholder panel */}
        <Card className="p-8 border border-border/80 rounded-2xl lg:col-span-2 flex items-center justify-center text-center">
          <div>
            <h2 className="font-display text-xl font-semibold mb-2">Select a conversation to view</h2>
            <p className="text-sm text-muted-foreground">
              Choose a session on the left to open its transcript, summary, and actions.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
