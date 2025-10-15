import { useState, useEffect } from "react"
import { Send, Signal, BookOpen, AlertTriangle, PieChart, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Progress } from "@/Components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import { OrionLogo } from "@/Components/logo/orion-logo"
import { useChat } from "@/hooks/useChat"
import { apiFetch } from "@/lib/api"

type Faq = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  createdAt: string;
};

const company = { name: "Acme Inc." };
const quickChips = ["Check order status", "Request refund", "Speak to human"];

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [faqs, setFaqs] = useState<Faq[]>([])
  
  const {
    sessionId,
    companyId,
    messages,
    summary,
    signals,
    escalated,
    escalationReason,
    loading,
    sending,
    error,
    sendMessage,
    scrollRef,
  } = useChat()

  // Load FAQs for knowledge panel
  useEffect(() => {
    const loadFaqs = async () => {
      if (!companyId) return
      const { data } = await apiFetch<Faq[]>(`/companies/${companyId}/faqs`)
      if (data && Array.isArray(data)) {
        setFaqs(data.slice(0, 3)) // Top 3 FAQs
      }
    }
    loadFaqs()
  }, [companyId])

  const handleSend = async () => {
    if (!message.trim() || sending || escalated) return
    await sendMessage(message)
    setMessage('')
  }

  const handleQuickChip = (text: string) => {
    setMessage((prev) => (prev ? `${prev} ${text}` : text))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const InsightsPanel = () => (
    <div className="flex flex-col gap-6">
      {/* Summary Card */}
      <Card className="border-[#F3E3D7] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#2B2B2B]">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {summary ? (
            <>
              <p className="text-sm leading-relaxed text-[#6B6B6B]">{summary.summary}</p>
              <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>Last updated: {formatTime(summary.updatedAt)}</span>
                <Badge variant="outline" className="border-[#F3E3D7] text-[#6B6B6B]">
                  auto
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#6B6B6B] italic">No summary yet. Start chatting to generate one.</p>
          )}
        </CardContent>
      </Card>

      {/* Signals Card */}
      <Card className="border-[#F3E3D7] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#2B2B2B]">
            <Signal className="h-4 w-4 text-[#FF7A1A]" />
            Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Confidence</span>
                <span className="font-medium text-[#2B2B2B]">{signals.confidence.toFixed(2)}</span>
              </div>
              <Progress value={signals.confidence * 100} className="h-1.5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Retrieval</span>
                <span className="font-medium text-[#2B2B2B]">{signals.retrievalScore.toFixed(2)}</span>
              </div>
              <Progress value={signals.retrievalScore * 100} className="h-1.5" />
            </div>
          </div>
          <div className="text-xs text-[#6B6B6B]">
            Session Confidence: <span className="font-medium text-[#2B2B2B]">{signals.sessionConfidence.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Card */}
      <Card className="border-[#F3E3D7] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#2B2B2B]">
            <BookOpen className="h-4 w-4 text-[#FF7A1A]" />
            Knowledge Used
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <div key={faq.id} className="space-y-1.5 rounded-lg border border-[#F3E3D7] bg-[#FFF7F0] p-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-[#2B2B2B]">{faq.question}</h4>
                </div>
                <p className="text-xs leading-relaxed text-[#6B6B6B]">{faq.answer.slice(0, 100)}{faq.answer.length > 100 ? '...' : ''}</p>
                {faq.tags && faq.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {faq.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-[#F3E3D7] text-[#6B6B6B]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6B6B6B] italic">No FAQs available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFF7F0]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-[#F3E3D7] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex mx-4 h-8 w-8 items-center justify-center rounded-lg ">
              <OrionLogo className="absolute text-balck" />
            </div>
            {/* <span className="font-semibold text-[#2B2B2B]">{company.logoText}</span> */}
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-[#2B2B2B]">Preview Chat</h1>
            <p className="text-xs text-[#6B6B6B]">Try your AI assistant in a safe sandbox.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 lg:flex">
              <Badge className={escalated ? "bg-[#FFB020] text-white" : "bg-[#24A148] text-white hover:bg-[#24A148]/90"}>
                {escalated ? 'Escalated' : 'Active'}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B6B6B]">Session Confidence</span>
                <div className="flex items-center gap-1.5">
                  <Progress value={signals.sessionConfidence * 100} className="h-1.5 w-16" />
                  <span className="text-xs font-medium text-[#2B2B2B]">{signals.sessionConfidence.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Sheet open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <PieChart className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] max-w-md overflow-y-auto bg-[#FFF7F0] sm:w-[400px]">
                <div className="mt-6">
                  <InsightsPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chat Panel */}
          <div className="flex min-h-[70vh] flex-col rounded-2xl border border-[#F3E3D7] bg-white shadow-sm">
            {/* Session Strip */}
            <div className="border-b border-[#F3E3D7] px-6 py-3">
              <p className="text-sm text-[#6B6B6B]">
                {company.name} • {sessionId || 'Loading...'} • {localStorage.getItem('sessionId') ? 'User Session' : 'Guest'}
              </p>
            </div>

            {/* Message Timeline */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FF7A1A]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[#6B6B6B]">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={msg.sender === "user" ? "bg-[#FF7A1A] text-white" : "bg-[#F3E3D7]"}>
                          {msg.sender === "user" ? "U" : "O"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex max-w-[70%] flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            msg.sender === "user" ? "bg-[#FF7A1A] text-white" : "bg-[#FFF7F0] text-[#2B2B2B]"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#6B6B6B]">{formatTime(msg.createdAt)}</span>
                          {msg.sender === "bot" && msg.confidence !== undefined && (
                            <>
                              <Badge variant="outline" className="h-5 border-[#F3E3D7] text-xs text-[#6B6B6B]">
                                C: {msg.confidence.toFixed(2)}
                              </Badge>
                              <Badge variant="outline" className="h-5 border-[#F3E3D7] text-xs text-[#6B6B6B]">
                                R: {msg.retrievalScore?.toFixed(2) || 'N/A'}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Escalation Banner */}
            {escalated && escalationReason && (
              <div className="border-t border-[#FFB020] bg-[#FFF9E6] px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-[#FFB020]">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Session escalated: {escalationReason}</span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="border-t border-red-300 bg-red-50 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Error: {error}</span>
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-[#F3E3D7] p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  {quickChips.map((chip) => (
                    <Button
                      key={chip}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickChip(chip)}
                      className="h-7 text-xs text-[#6B6B6B] hover:bg-[#FFF7F0] hover:text-[#FF7A1A]"
                    >
                      {chip}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={escalated ? "Chat is escalated" : "Type a message…"}
                    disabled={sending || escalated || loading}
                    className="min-h-[80px] resize-none border-[#F3E3D7] bg-[#FFF7F0] text-[#2B2B2B] placeholder:text-[#6B6B6B] focus-visible:ring-[#FF7A1A] disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={sending || escalated || loading || !message.trim()}
                    className="h-[80px] w-12 shrink-0 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Panel (Desktop) */}
          <div className="hidden lg:block">
            <InsightsPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
