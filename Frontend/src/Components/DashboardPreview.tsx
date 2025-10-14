import { Card, CardContent } from "@/Components/ui/card";

function DashboardPreview() {
  return (
    <>
          {/* Dashboard Preview Section */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-balance">
                Manage tickets, summarize chats, and stay in control
              </h2>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Your command center for AI-powered support automation
              </p>
            </div>

            <Card className="overflow-hidden rounded-3xl border-2 shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-muted p-12 min-h-[500px] flex items-center justify-center">
                  <div className="w-full max-w-3xl space-y-6">
                    {/* Mock Dashboard Elements */}
                    <div className="bg-card rounded-2xl p-6 shadow-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                          <span className="font-display font-semibold">
                            Active Conversations
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          247
                        </span>
                      </div>
                      <div className="space-y-2">
                        {[85, 92, 78].map((value, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                              {value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Resolved", value: "1,847" },
                        { label: "Avg Response", value: "12s" },
                        { label: "Satisfaction", value: "98%" },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-card rounded-xl p-4 shadow border"
                        >
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default DashboardPreview