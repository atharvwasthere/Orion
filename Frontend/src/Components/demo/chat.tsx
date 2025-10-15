import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle } from "lucide-react"   // 👈 added Lucide icon
import { Button } from "@/Components/ui/button"

const sampleMessages = [
  { role: "user" as const, text: "How long does a refund take?" },
  { role: "assistant" as const, text: "Refunds are usually processed within 3–5 business days once approved." },
  { role: "user" as const, text: "Can I change my delivery address?" },
]

export function ExpandableChat() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-8 top-1/2 z-50 -translate-y-1/2">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed preview
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative w-[400px]"
          >
            {/* Preview card */}
            <div className="mb-4 rounded-2xl bg-white/70 p-4 shadow-xl shadow-primary/20 backdrop-blur-md dark:bg-zinc-900/50">
              <div className="space-y-3">
                {sampleMessages.slice(0, 2).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
            >
              <MessageCircle className="h-7 w-7" />   {/* 👈 replaced emoji with icon */}
            </motion.button>
          </motion.div>
        ) : (
          // Expanded chat
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex h-[80vh] w-[450px] flex-col rounded-2xl bg-card shadow-2xl shadow-primary/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl">
                  🪐
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Orion Assistant</h3>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
                  👋 Hi! I'm Orion, your AI support assistant. How can I help you today?
                </div>
              </div>
              {sampleMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
                  You can change it before your order ships. Go to Account → Orders → Edit Address.
                </div>
              </div>
            </div>

            {/* Input (disabled) */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  disabled
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm opacity-50"
                />
                <Button disabled className="rounded-xl px-6">
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
