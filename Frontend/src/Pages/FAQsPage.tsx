import { useState } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"


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
      <Card className="border-2">
        <CardContent className="p-4">
          <Input placeholder="Search FAQs..." className="w-full" />
        </CardContent>
      </Card>

      {/* FAQ Table */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Question</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Answer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tags</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last updated</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{faq.question}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{faq.answer}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-muted px-2 py-1 rounded">{faq.tags}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{faq.updated}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
