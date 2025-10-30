import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import MobileFriend from "@/Components/logo/MobileFriendly.svg";
import PoweredByAI from "@/Components/logo/PoweredByAI.svg";
import OnePlatform from "@/Components/logo/OnePlatform.svg";

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* 12-col grid -> 2/3 : 1/3 → 1/3 : 1/3 : 1/3 → 1/3 : 2/3 */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[200px]">
          {/* A — 2/3 (lg:col-span-8) */}
          <Card className="lg:col-span-8 rounded-2xl border-2 transition">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Always thinking for you
                </h3>
                <p className="text-sm text-muted-foreground">
                  Orion anticipates needs and turns every support signal into
                  insight.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { k: "Urgency", v: "Medium" },
                  { k: "Expected resolution", v: "Analyzing context..." },
                  { k: "Recommended action", v: "Synthesizing response..." },
                  { k: "Assigned to", v: "Orion Assistant" },
                ].map((r) => (
                  <div
                    key={r.k}
                    className="bg-muted/40 border rounded-lg px-3 py-2 text-xs flex items-center justify-between"
                  >
                    <span className="text-muted-foreground">{r.k}</span>
                    <span className="font-medium">{r.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* B — 1/3 (lg:col-span-4) -> subdivided into 3 mini cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Collaborative */}
            {/*<Card className="rounded-2xl border-2 transition">
              <CardContent className="p-5 -mt-4 text-center">
                <h4 className="text-sm font-semibold mb-1">Collaborative</h4>
                <p className="text-xs text-muted-foreground">
                  AI assists, your team leads the way.
                </p>
              </CardContent>
            </Card>*/}

            {/* Mobile Friendly */}
            <Card className="rounded-2xl border-2 transition">
              <CardContent className="p-5 -mt-2 flex flex-col  items-center text-center">
                <img
                  src={MobileFriend}
                  alt="Mobile Friendly"
                  className="w-10 h-10 mb-2 opacity-90"
                />
                <h4 className="text-sm font-semibold mb-1">Mobile ready</h4>
                <p className="text-xs text-muted-foreground">
                  Stay connected and in control anywhere.
                </p>
              </CardContent>
            </Card>

            {/* Powered by AI */}
            <Card className="rounded-2xl border-2 transition -mt-4">
              <CardContent className="p-5 -mt-2 flex flex-col items-center text-center">
                <img
                  src={PoweredByAI}
                  alt="Powered by AI"
                  className="w-10 h-10 mb-2 opacity-90"
                />
                <h4 className="text-sm font-semibold mb-1">Powered by AI</h4>
                <p className="text-xs text-muted-foreground">
                  Confidence-based answers and smart routing.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* C — 1/3 */}
          <Card className="lg:col-span-4 rounded-2xl border-2 transition">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Manage any workflow
                </h3>
                <p className="text-sm text-muted-foreground">
                  From FAQs to escalations — Orion keeps every process seamless.
                </p>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { dot: "bg-accent", label: "5 tickets pending" },
                  { dot: "bg-primary", label: "2 awaiting review" },
                  { dot: "bg-green-500", label: "1 resolved" },
                ].map((i) => (
                  <div key={i.label} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${i.dot}`} />
                    <span>{i.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* D — 1/3 */}
          <Card className="lg:col-span-4 rounded-2xl border-2 transition">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="-mt-4">
                <h3 className="font-display text-lg font-semibold mb-2">
                  Always in the loop
                </h3>
                <p className="text-xs text-muted-foreground">
                  Keep teammates, vendors, and clients aligned in real time.
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  "Ticket resolved successfully",
                  "New inquiry awaiting triage",
                  "Weekly insights ready",
                ].map((t) => (
                  <div
                    key={t}
                    className="bg-muted/40 border rounded-lg px-3 py-2 text-[11px]"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* E — 1/3 */}
          <Card className="lg:col-span-4 mt-12 rounded-2xl border-2 transition bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
              <img
                src={OnePlatform}
                alt="One Platform"
                className="w-12 h-12 mb-3 opacity-90"
              />
              <h3 className="font-display text-2xl font-bold mb-1">
                One Platform
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Bring your apps, teams, and conversations together — all powered
                by Orion.
              </p>
            </CardContent>
          </Card>

          {/* F — 1/3 (lg:col-span-4) -> subdivided into 3 mini cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {[
              {
                title: "FAQ Intelligence",
                desc: "Instant answers powered by your uploaded FAQs.",
              },
              {
                title: "Escalation Tracking",
                desc: "Flags low-confidence chats for review automatically.",
              },
              {
                title: "Insight Analytics",
                desc: "Live metrics on accuracy, speed, and performance.",
              },
            ].map((c) => (
              <Card key={c.title} className="rounded-2xl border-2 transition">
                <CardContent className="p-5 -mt-4">
                  <h4 className="text-sm font-semibold mb-1">{c.title}</h4>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* G — 2/3 (lg:col-span-8) -> split inside 1:2 */}
          <div className="lg:col-span-8 -mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1/3 */}
            <Card className="lg:col-span-1 rounded-2xl border-2 transition">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                <h3 className="font-display text-lg font-semibold mb-2">
                  Customer Portal
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Track tickets, follow progress, and view complete chat
                  history.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[11px] px-3 border-2 hover:border-primary hover:text-primary"
                >
                  Continue with Google
                </Button>
              </CardContent>
            </Card>

            {/* 2/3 */}
            <Card className="lg:col-span-2 rounded-2xl border-2 transition">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Portals for everyone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create tailored portals for partners, clients, and teams —
                  share updates, approvals, and live data seamlessly with Orion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
