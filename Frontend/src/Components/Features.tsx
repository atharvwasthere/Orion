import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { FeatureIcon } from "@/Components/logo/feature-icon";

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* 12-col grid -> 2/3 : 1/3 → 1/3 : 1/3 : 1/3 → 1/3 : 2/3 */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[200px]">
          {/* A — 2/3 (lg:col-span-8) */}
          <Card className="lg:col-span-8 rounded-2xl border-2 hover:border-primary/50 transition">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">Always thinking for you</h3>
                <p className="text-sm text-muted-foreground">
                  Orion enriches your data and helps you make smarter decisions.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { k: "Urgency", v: "Medium" },
                  { k: "Expected resolution", v: "Orion analyzing..." },
                  { k: "Recommended action", v: "Gathering insights..." },
                  { k: "Assigned to", v: "Orion Agent" },
                ].map((r) => (
                  <div key={r.k} className="bg-muted/40 border rounded-lg px-3 py-2 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">{r.k}</span>
                    <span className="font-medium">{r.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* B — 1/3 (lg:col-span-4) -> subdivided into 3 mini cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {[
              { title: "Collaborative", desc: "AI assists, humans decide." },
              { title: "Mobile friendly", desc: "Dashboards that fit any screen." },
              { title: "Powered by AI", desc: "Confidence-based responses & smart escalation." },
            ].map((x) => (
              <Card key={x.title} className="rounded-2xl border-2 hover:border-primary/50 transition">
                <CardContent className="p-5 -mt-4">
                  <h4 className="text-sm font-semibold mb-1">{x.title}</h4>
                  <p className="text-xs text-muted-foreground">{x.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* C — 1/3 */}
          <Card className="lg:col-span-4 rounded-2xl border-2 hover:border-primary/50 transition">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">Manage any workflow</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered workflows from tickets to escalations.
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
<Card className="lg:col-span-4 rounded-2xl border-2 hover:border-primary/50 transition">
  <CardContent className="p-6 h-full flex flex-col justify-between">
    <div>
      <h3 className="font-display text-lg font-semibold mb-2">Always in the loop</h3>
      <p className="text-xs text-muted-foreground">
        Auto-notify teammates, customers, and vendors.
      </p>
    </div>

    <div className="mt-3 space-y-2">
      {["Your ticket was resolved", "New inquiry waiting for review", "Weekly summary ready"].map((t) => (
        <div key={t} className="bg-muted/40 border rounded-lg px-3 py-2 text-[11px]">
          {t}
        </div>
      ))}
    </div>
  </CardContent>
</Card>

          {/* E — 1/3 */}
<Card className="lg:col-span-4 mt-12 rounded-2xl border-2 hover:border-primary/50 transition bg-gradient-to-br from-primary/5 to-accent/5">
  <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
    <FeatureIcon type="lightning" className="w-10 h-60 mb-2" />
    <h3 className="font-display text-2xl font-bold mb-1">One Platform</h3>
    <p className="text-sm text-muted-foreground max-w-sm">
      All your apps and data live together. No more juggling emails and spreadsheets.
    </p>
  </CardContent>
</Card>

          {/* F — 1/3 (lg:col-span-4) -> subdivided into 3 mini cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {[
              { title: "eSigning", desc: "Automated signatures (coming soon)." },
              { title: "Payment handling", desc: "Refunds & billing inside chat." },
              { title: "Meeting scheduling", desc: "Suggest & confirm slots instantly." },
            ].map((c) => (
              <Card key={c.title} className="rounded-2xl border-2 hover:border-primary/50 transition">
                <CardContent className="p-5 -mt-4">
                  <h4 className="text-sm font-semibold mb-1">{c.title}</h4>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* G — 2/3 (lg:col-span-8) -> split inside 1:2 */}
          <div className="lg:col-span-8 mt-12 -mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1/3 */}
            <Card className="lg:col-span-1  rounded-2xl border-2 hover:border-primary/50 transition">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                <h3 className="font-display text-lg font-semibold mb-2">Customer Portal</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Track progress and view chat history.
                </p>
                <Button size="sm" variant="outline" className="text-[11px] px-3 border-2 hover:border-primary hover:text-primary">
                  Continue with Google
                </Button>
              </CardContent>
            </Card>

            {/* 2/3 */}
            <Card className="lg:col-span-2 rounded-2xl border-2 hover:border-primary/50 transition">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <h3 className="font-display text-xl font-semibold mb-2">Portals for all</h3>
                <p className="text-sm text-muted-foreground">
                  Create partner, vendor, or client portals. Share updates, approvals, and live data — all powered by Orion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}



// export default function Features() {
//   return (
//     <section className="py-20 bg-background">
//       <div className="container mx-auto px-6">
//         {/* twelve-column grid so we can use spans for 2/3 : 1/3 */}
//         <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[200px]">
//           {/* Row 1 — A takes 8 cols (≈2/3), B takes 4 cols (≈1/3) */}
//           <div className="lg:col-span-8 bg-red-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             A (2/3)
//           </div>
//           <div className="lg:col-span-4 bg-blue-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             B (1/3)
//           </div>

//           {/* Row 2 — three equal cards */}
//           <div className="lg:col-span-4 bg-green-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             C
//           </div>
//           <div className="lg:col-span-4 bg-yellow-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             D
//           </div>
//           <div className="lg:col-span-4 bg-pink-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             E
//           </div>

//           {/* Row 3 — also three equal cards */}
//           <div className="lg:col-span-4 bg-purple-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             F
//           </div>
//           <div className="lg:col-span-8 bg-orange-300 rounded-2xl flex items-center justify-center text-xl font-medium">
//             G
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

