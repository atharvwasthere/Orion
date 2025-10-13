import { Card, CardContent } from "@/Components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your AI assistant's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Chats", value: "1,847", change: "+12%" },
          { label: "Escalation Rate", value: "8.2%", change: "-2.1%" },
          { label: "Avg Confidence", value: "0.89", change: "+0.05" },
          { label: "FAQ Hit Ratio", value: "94%", change: "+3%" },
        ].map((stat, i) => (
          <Card key={i} className="border-2">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-primary font-medium">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <Card className="border-2">
        <CardContent className="p-6">
          <h2 className="font-display text-xl font-semibold mb-6">Conversations Over Time</h2>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
