import { FeatureBand } from "@/Components/FeatureBand"

import cursor from "@/Components/logo/cursor.svg"
import edit from "@/Components/logo/edit.svg"
import flash from "@/Components/logo/flash.svg"
import heart from "@/Components/logo/heart.svg"
import mail from "@/Components/logo/mail.svg"
import mailbox from "@/Components/logo/mailbox.svg"
import moon from "@/Components/logo/moon.svg"
import Conversations from "@/Components/images/Conversations_Innovate.png"
import managedByAI from "@/Components/images/Settings-Page.png" 
import Conversations2 from "@/Components/images/Conversations_page.png"

const set1 = {
  headline: "All your customer conversations, handled with intelligence",
  items: [
    {
      icon: cursor,
      description:
        "Orion understands every message — it remembers past chats and reacts with context, not templates.",
    },
    {
      icon: flash,
      description:
        "Orion responds instantly when confident, and escalates when nuance matters.",
    },
    {
      icon: mailbox,
      description:
        "You see a clear audit trail of every interaction — no more guessing who said what.",
    },
  ] as const,
}

const set2 = {
  headline: "Orion saves your team hours every week",
  items: [
    {
      icon: edit,
      description:
        "Automatically summarizes long threads so teammates start informed, not blind.",
    },
    {
      icon: moon,
      description:
        "Routes complex queries to the right person before anyone asks.",
    },
    {
      icon: heart,
      description:
        "Tracks confidence, learns from feedback, and keeps improving with every chat.",
    },
  ] as const,
}

const set3 = {
  headline: "Your workflows, powered by adaptive AI",
  items: [
    {
      icon: mail,
      description:
        "Connect Orion to your FAQs and internal docs — it finds the answer instantly.",
    },
    {
      icon: flash,
      description:
        "When unsure, Orion loops humans in and preserves the full context for them.",
    },
    {
      icon: heart,
      description:
        "Analytics show what’s working, what’s escalating, and where customers get stuck.",
    },
  ] as const,
}

export default function MarketingFeatureBands() {
  return (
    <main className="bg-background text-foreground">
      <FeatureBand id="context" headline={set1.headline} items={set1.items}  />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-2 shadow-xs rounded-2xl w-6xl">
          <img src={Conversations2} alt="Dashboard Setup" />
        </div>
      </div>
      <hr className="border-t border-border/60" />
      <FeatureBand id="time" headline={set2.headline} items={set2.items} />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 shadow-xs rounded-2xl w-6xl">
          <img src={Conversations} alt="Dashboard Setup" />
        </div>
      </div>
      <hr className="border-t border-border/60" />
      <FeatureBand id="workflows" headline={set3.headline} items={set3.items} />
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 shadow-xs rounded-2xl w-6xl">
          <img src={managedByAI} alt="Dashboard Setup" />
        </div>
      </div>
    </main>
  )
}
