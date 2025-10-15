import { Button } from "@/Components/ui/button"
import { OrionLogo } from "../Components/logo/orion-logo"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" aria-label="Orion Home" className="flex items-center gap-3">
            <OrionLogo />
          </a>
          <div className="flex items-center gap-8">
            <a href="/#platform" className="text-sm font-medium hover:text-primary transition-colors">
              Platform
            </a>
            <a aria-current="page" href="/about" className="text-sm font-semibold text-foreground">
              About
            </a>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/setup">Login</a>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" asChild>
                <a href="/chat">Get access now</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero band */}
      <header className="relative pt-36 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        {/* subtle ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="container mx-auto px-6">
          <div className="max-w-5xl">
            <span className="inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold tracking-wide text-foreground/80">
              MANIFESTO
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
              Big intelligence for small teams.
            </h1>

            {/* thin underline accent */}
            <div
              className="mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-primary/60 to-accent/60 animate-pulse-glow"
              aria-hidden
            />

            {/* Supporting intro from the provided text */}
            <div className="mt-8 space-y-6 text-lg md:text-xl leading-relaxed text-pretty max-w-3xl">
              <p>
                We built Orion because automation was never meant to belong only to billion-dollar enterprises. The
                future of work shouldn’t be gated behind sales demos, enterprise plans, and bloated dashboards.
              </p>
              <p>
                While giants chase scale and shareholder growth, we’re building for the operators, founders, and support
                teams who still answer customers themselves — the real builders.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="pb-28">
        <Section
          eyebrow="The problem"
          heading="The problem"
          paragraphs={[
            "Customer support software has become a graveyard of tabs, CRMs, and “AI” buttons that don’t actually think.",
            "Each new tool promises efficiency and delivers another login screen.",
            "Meanwhile, the small teams — the ones who power the majority of the world’s commerce — are left juggling a dozen disconnected systems, pretending that’s “digital transformation.”",
          ]}
        />

        <Section
          eyebrow="The truth"
          heading="The truth"
          paragraphs={[
            <span key="truth-1">
              AI isn’t magic. It’s context. That’s why Orion doesn’t just <em>generate</em> replies — it{" "}
              <em>understands</em> conversations.
            </span>,
            "It remembers, reasons, and reacts. It learns from your company’s own FAQs, tone, and history.",
            "It’s built to speak like you, not like a template.",
          ]}
        />

        <Section
          eyebrow="The belief"
          heading="The belief"
          paragraphs={[
            "We believe intelligence should be infrastructure — invisible, fast, and personal.",
            "We believe small businesses are the most creative force on Earth.",
            "We believe tools should adapt to humans, not the other way around.",
            "We believe technology is only meaningful when it saves you time for what actually matters: running your business, helping your customers, living your life.",
          ]}
        />

        <Section
          eyebrow="The mission"
          heading="The mission"
          paragraphs={[
            "To give every small team the same intelligence advantage the tech giants have — without the complexity, cost, or compromise.",
            "To make support smarter, not colder.",
            "To turn automation into something humane.",
          ]}
        />

        <Section
          eyebrow="The spark"
          heading="The spark"
          paragraphs={[
            "We built Orion because we’ve been on both sides of the chat window — the customer waiting, and the operator typing.",
            "It’s personal to us.",
            "Orion isn’t about replacing people. It’s about giving them a second brain — one that never forgets, never burns out, and always has your back.",
          ]}
        />

        {/* Footer CTA (lightweight, optional) */}
        <div className="container mx-auto px-6 mt-10">
          <div className="max-w-5xl rounded-2xl border border-border bg-card/60 p-6 md:p-8 flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ready to see Orion in action?</p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1">Run your support on autopilot.</h3>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-2 hover:border-primary hover:text-primary bg-transparent"
                asChild
              >
                <a href="/demo">View demo</a>
              </Button>
              <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href="/chat">Get access now</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({
  eyebrow,
  heading,
  paragraphs,
}: {
  eyebrow: string
  heading: string
  paragraphs: Array<React.ReactNode>
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[240px_1fr] items-start">
          <div className="md:sticky md:top-24">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">{eyebrow}</span>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">{heading}</h2>
            {/* decorative dot with subtle motion */}
            <div aria-hidden className="mt-4 h-2 w-2 rounded-full bg-primary/50 animate-float" />
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-sm">
            <div className="space-y-5 text-[15px] leading-relaxed text-pretty">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
