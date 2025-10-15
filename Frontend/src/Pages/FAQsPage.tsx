import { useState } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"

export default function FAQsPage() {
  const [faqs] = useState([
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "Go to account → reset password.",
      tags: "account, login",
      updated: "Oct 12",
    },
    {
      id: 2,
      question: "What is your refund policy?",
      answer: "Full refunds within 30 days of purchase.",
      tags: "billing, refund",
      updated: "Oct 10",
    },
    {
      id: 3,
      question: "How do I track my order?",
      answer: "Check your email for tracking link or visit Orders page.",
      tags: "shipping, orders",
      updated: "Oct 8",
    },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">FAQ Library</h1>
          <p className="text-muted-foreground">Manage your knowledge base</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Bulk Upload</Button>
          <Button className="bg-primary hover:bg-primary/90">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border border-border/80 rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <Input placeholder="Search FAQs..." className="w-full pl-9 pr-3 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Table */}
      <Card className="border border-border/80 rounded-2xl">
        <CardContent className="p-0">
          <div className="divide-y divide-border/70">
            {faqs.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="font-semibold mb-1">No FAQs yet</h3>
                <p className="text-sm text-muted-foreground">Add one or bulk import CSV/JSON to get started.</p>
              </div>
            ) : (
              faqs.map((faq) => {
                const tags = faq.tags.split(",").map((t) => t.trim())
                return (
                  <div key={faq.id} className="p-5 sm:p-6 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-medium text-base sm:text-lg truncate">{faq.question}</h3>
                          <span className="shrink-0 text-xs text-muted-foreground">Updated {faq.updated}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted/60">
                          <svg
                            className="w-4 h-4 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 21h3l12.5-12.5a2.121 2.121 0 0 0-3-3L3 15v6z" />
                          </svg>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
