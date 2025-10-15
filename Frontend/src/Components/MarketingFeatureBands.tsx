import { FeatureBand } from "@/Components/FeatureBand"



// ---- Copy presets you can tweak/remix ----
const set1 = {
  headline: "All your customer conversations, handled with intelligence",
  items: [
    {
      description:
        "Orion understands every message — it remembers past chats and reacts with context, not templates.",
    },
    {
      description:
        "Orion responds instantly when confident, and escalates when nuance matters.",
    },
    {
      description:
        "You see a clear audit trail of every interaction — no more guessing who said what.",
    },
  ] as const,
}

const set2 = {
  headline: "Orion saves your team hours every week",
  items: [
    {
      description:
        "Automatically summarizes long threads so teammates start informed, not blind.",
    },
    {
      description:
        "Routes complex queries to the right person before anyone asks.",
    },
    {
      description:
        "Tracks confidence, learns from feedback, and keeps improving with every chat.",
    },
  ] as const,
}

const set3 = {
  headline: "Your workflows, powered by adaptive AI",
  items: [
    {
      description:
        "Connect Orion to your FAQs and internal docs — it finds the answer instantly.",
    },
    {
      description:
        "When unsure, Orion loops humans in and preserves the full context for them.",
    },
    {
      description:
        "Analytics show what’s working, what’s escalating, and where customers get stuck.",
    },
  ] as const,
}

// Optional: if you use lucide-react, pass icons like <Sparkles /> to items.icon

export default function MarketingFeatureBands() {
    
  return (
    <main className="bg-background text-foreground">
      <FeatureBand id="context" headline={set1.headline} items={set1.items} />
      <hr className="border-t border-border/60" />
      <FeatureBand id="time" headline={set2.headline} items={set2.items} />
      <hr className="border-t border-border/60" />
      <FeatureBand id="workflows" headline={set3.headline} items={set3.items} />
    </main>
  )
}

