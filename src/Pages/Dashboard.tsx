import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Link } from "@tanstack/react-router"

export default function DashboardPage() {
  const conversations = [
    { id: "user_24", topic: "Refund issue", confidence: 0.91, status: "Resolved" },
    { id: "user_13", topic: "Account login", confidence: 0.74, status: "Escalated" },
    { id: "user_9", topic: "Order status", confidence: 0.96, status: "Resolved" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Mission Control</h1>
        <p className="text-muted-foreground">Monitor your AI support assistant in real-time</p>
      </div>

      {/* System Summary Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">System Summary</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-sm font-medium text-primary">Online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Last cache refresh: <span className="font-medium text-foreground">2 minutes ago</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Live Conversations Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Live Conversations</h2>
            <Button variant="outline" size="sm">
              View all
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Topic</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="py-3 px-4">
                      <Link
                        to="/dashboard/conversations/$id"
                        params={{ id: conv.id }}
                        className="font-medium hover:text-primary"
                      >
                        {conv.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{conv.topic}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          conv.confidence >= 0.85 ? "text-green-600" : "text-accent"
                        }`}
                      >
                        {conv.confidence}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          conv.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-accent/20 text-accent-foreground"
                        }`}
                      >
                        {conv.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
              to="/dashboard/faq">Add FAQ</Link>            
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
