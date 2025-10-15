import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Route } from "@/routes/dashboard/conversations/$id"
import { useRouter } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen";
import { router } from "@/router";

export default function ConversationDetailPage() {
const {id} = Route.useParams();

  const messages = [
    { role: "user", content: "I need help with my refund", timestamp: "10:23 AM" },
    {
      role: "orion",
      content: "I'd be happy to help you with your refund. Can you provide your order number?",
      timestamp: "10:23 AM",
      confidence: 0.91,
    },
    { role: "user", content: "Order #12345", timestamp: "10:24 AM" },
    {
      role: "orion",
      content: "I've located your order. Your refund has been processed and should appear in 3-5 business days.",
      timestamp: "10:24 AM",
      confidence: 0.94,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Conversation: {id} </h1>
          <p className="text-muted-foreground">Refund issue · Resolved</p>
        </div>
        <Button variant="outline" onClick={()=>{router.navigate({ to: "/dashboard/conversations" })}}>Close</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Transcript */}
        <Card className="lg:col-span-2 border-2">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Chat Transcript</h2>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.content}</p>
                    <div className="flex items-center justify-between gap-2 text-xs opacity-70">
                      <span>{msg.timestamp}</span>
                      {msg.role === "orion" && msg.confidence && (
                        <span className="font-medium">Confidence: {msg.confidence}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Confidence Timeline */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-semibold mb-4">Confidence Timeline</h3>
              <div className="space-y-3">
                {[0.91, 0.94, 0.89, 0.96].map((conf, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${conf * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{conf}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-semibold mb-3">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customer inquired about refund status for order #12345. Orion successfully located the order and
                confirmed refund processing timeline.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-2">
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Escalate
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Improve FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
