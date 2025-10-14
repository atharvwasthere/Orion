import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"

export default function EscalationsPage() {
  const escalations = [
    { id: "ESC-2041", user: "user_13", reason: "Low confidence", assignedTo: "Alex P.", status: "Open" },
    { id: "ESC-2040", user: "user_8", reason: "Complex inquiry", assignedTo: "Sarah M.", status: "In Progress" },
    { id: "ESC-2039", user: "user_22", reason: "Payment issue", assignedTo: "Mike R.", status: "Resolved" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">Escalations</h1>
        <p className="text-muted-foreground">Manage tickets requiring human attention</p>
      </div>

      {/* Escalations Table */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assigned to</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {escalations.map((esc) => (
                  <tr key={esc.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{esc.id}</td>
                    <td className="py-3 px-4 text-muted-foreground">{esc.user}</td>
                    <td className="py-3 px-4 text-muted-foreground">{esc.reason}</td>
                    <td className="py-3 px-4">{esc.assignedTo}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          esc.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : esc.status === "In Progress"
                              ? "bg-primary/20 text-primary"
                              : "bg-accent/20 text-accent-foreground"
                        }`}
                      >
                        {esc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
