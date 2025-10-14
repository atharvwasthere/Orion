import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { FeatureIcon } from "@/Components/logo/feature-icon";

function Features() {
  return (
    <>
          <section id="features" className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto auto-rows-fr">
            {/* Large Feature Card - Intelligent Routing */}
            <Card className="md:col-span-6 lg:col-span-5 lg:row-span-2 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col">
                <h3 className="font-display text-2xl font-bold mb-4">
                  Always thinking for you
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Orion enriches your data and helps you make smarter decisions.
                </p>

                <div className="flex-1 space-y-3">
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border">
                    <span className="text-sm text-muted-foreground">
                      Urgency
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border">
                    <span className="text-sm text-muted-foreground">
                      Expected resolution
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                      <span className="text-sm font-medium">
                        Orion is thinking...
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border">
                    <span className="text-sm text-muted-foreground">
                      Recommended action
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                      <span className="text-sm font-medium">
                        Orion is thinking...
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border">
                    <span className="text-sm text-muted-foreground">
                      Assigned to
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        AI
                      </div>
                      <span className="text-sm font-medium">Orion Agent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small Cards Column */}
            <div className="md:col-span-3 lg:col-span-3 space-y-6">
              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-bold">
                      Collaborative
                    </h3>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/80 border-2 border-card" />
                      <div className="w-8 h-8 rounded-full bg-accent/80 border-2 border-card" />
                      <div className="w-8 h-8 rounded-full bg-primary/60 border-2 border-card flex items-center justify-center text-xs font-medium">
                        +2
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">
                      Mobile friendly
                    </h3>
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">
                      Powered by AI
                    </h3>
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Management Card */}
            <Card className="md:col-span-3 lg:col-span-4 lg:row-span-2 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col">
                <h3 className="font-display text-2xl font-bold mb-3">
                  Manage any workflow
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Our AI-powered workflows help you manage any process, from
                  tickets to escalations.
                </p>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    </div>
                    <span className="text-sm font-medium">
                      5 tickets pending
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      2 tickets awaiting review
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm font-medium">
                      1 ticket resolved
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Auto-escalation</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Coming soon
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Smart routing</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Coming soon
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Center Large Card - One Platform */}
            <Card className="md:col-span-6 lg:col-span-5 lg:row-span-1 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="mb-4">
                  <FeatureIcon type="lightning" className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="font-display text-3xl font-bold mb-3">
                  One Platform
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  All your support channels and data live together. No more
                  juggling emails and spreadsheets.
                </p>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="md:col-span-6 lg:col-span-4 lg:row-span-1 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col">
                <h3 className="font-display text-xl font-bold mb-3">
                  Always in the loop
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Send notifications to teammates, customers, and vendors
                  automatically.
                </p>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border">
                    <div className="w-5 h-5 rounded bg-primary/20 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      Your ticket was resolved
                    </span>
                  </div>
                  <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border">
                    <div className="w-5 h-5 rounded bg-primary/20 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      A new inquiry is waiting for review
                    </span>
                  </div>
                  <div className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border">
                    <div className="w-5 h-5 rounded bg-primary/20 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      Customer support ticket resolved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Cards */}
            <Card className="md:col-span-2 lg:col-span-3 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <h3 className="font-display text-sm font-bold">
                    Smart replies
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Coming soon
                </span>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <h3 className="font-display text-sm font-bold">
                    Payment handling
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Coming soon
                </span>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="font-display text-sm font-bold">
                    Meeting scheduling
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Coming soon
                </span>
              </CardContent>
            </Card>

            {/* Portal Card */}
            <Card className="md:col-span-6 lg:col-span-3 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center h-full flex flex-col items-center justify-center">
                <h3 className="font-display text-xl font-bold mb-2">
                  Customer Portal
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Login to view ticket progress and chat history
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-2 hover:border-primary hover:text-primary bg-transparent"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </CardContent>
            </Card>

            {/* Portals Info Card */}
            <Card className="md:col-span-6 lg:col-span-4 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold mb-3">
                  Portals for all
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Easily create portals for partners, suppliers, and customers.
                  Share updates, streamline communication, and keep everyone on
                  the same page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>

  )
}

export default Features