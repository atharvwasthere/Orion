import { LadderStep } from "@/Components/demo/ladder-step";
import { ExpandableChat } from "@/Components/demo/chat";
import { DemoNav } from "@/Components/demo/demo-nav";
import { motion } from "framer-motion";
import notebook from "@/Components/logo/notebook.svg";
import escalate from "@/Components/logo/escalate.svg";
import brain from "@/Components/logo/brain.svg";
import generate from "@/Components/logo/generate.svg";


const steps = [
  {
    icon: notebook,
    title: "Ingest Knowledge",
    description: "Your FAQs and docs become structured knowledge stored in Orion's database.",
  },
  {
    icon: brain,
    title: "Understand Context",
    description: "Each user message updates Orion's memory — so it recalls details naturally.",
  },
  {
    icon: generate,
    title: "Generate Responses",
    description: "Gemini processes context and data to craft brand-aligned answers.",
  },
  {
    icon: escalate,
    title: "Escalate When Needed",
    description: "If confidence drops, Orion flags the issue and escalates it automatically.",
  },
];


export default function DemoPage() {
  return (
    <>
      <DemoNav />

      <div className="relative min-h-screen bg-gradient-to-b from-[#FFF8F1] to-white dark:from-[#1A0F00] dark:to-[#2D1A00]">
        {/* Page container */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          {/* 2-col grid on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_420px] gap-8 lg:gap-12">

            {/* LEFT: ladder flow */}
            <section aria-labelledby="how-orion-works">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h1
                  id="how-orion-works"
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
                >
                  How Orion Works
                </h1>
                <p className="mt-3 text-lg sm:text-xl leading-relaxed text-muted-foreground">
                  A simple sequence that turns your data into real conversations.
                </p>
              </motion.header>

              {/* Ladder with spine */}
              <div className="relative">
                {/* vertical spine */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
                />
                <ol className="space-y-6 sm:space-y-8">
                  {steps.map((step, index) => (
                    <li key={index} className="pl-10 sm:pl-14">
                      <LadderStep index={index} {...step} />
                    </li>
                  ))}
                </ol>
              </div>

              {/* Closing message */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className="mt-10 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-6 sm:p-8"
              >
                <p className="text-base sm:text-lg font-medium italic text-foreground">
                  “Orion closes the loop — storing insights to continuously refine its responses.”
                </p>
              </motion.div>
            </section>

            {/* RIGHT: sticky chat (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <ExpandableChat />
              </div>
            </aside>

          </div>
        </div>

        {/* Mobile floating chat trigger (only on <lg) */}
        <div className="lg:hidden fixed right-4 bottom-6 z-40">
          <ExpandableChat />
        </div>
      </div>
    </>
  );
}
