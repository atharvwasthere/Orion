// ChatMessage.tsx
// Phase 9: Structured Intelligence Frontend Component
// Place this in your frontend's components directory


interface MessageSection {
  label: string;
  content: string;
}

interface MessageMeta {
  type?: string;
  title?: string;
  sections?: MessageSection[];
  contextUsed?: string[];
  confidence?: number;
  tone?: string;
  shouldEscalate?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'orion' | 'bot' | 'system';
  text: string;
  confidence?: number;
  meta?: MessageMeta;
  createdAt: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // User message - simple right-aligned bubble
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl max-w-[80%] shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  // System message - centered subtle notice
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-muted/50 text-muted-foreground px-4 py-2 rounded-lg text-sm max-w-[70%] text-center">
          {message.text}
        </div>
      </div>
    );
  }

  // Orion/Bot message - structured left-aligned card
  const meta = message.meta || {};

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-muted/30 px-4 py-3 rounded-2xl border max-w-[80%] shadow-sm space-y-3">
        {/* Title (if structured response) */}
        {meta.title && (
          <h4 className="font-semibold text-primary text-base">
            {meta.title}
          </h4>
        )}

        {/* Main response summary */}
        <p className="text-foreground leading-relaxed">{message.text}</p>

        {/* Structured sections (Answer, Details, Next Steps, etc.) */}
        {meta.sections && meta.sections.length > 0 && (
          <div className="space-y-2 border-t border-border pt-3 mt-3">
            {meta.sections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {section.label}
                </div>
                <div className="text-sm text-foreground">{section.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer: Confidence + Escalation indicators */}
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground border-t border-border pt-2">
          <div className="flex gap-3">
            {/* Confidence badge */}
            {(meta.confidence !== undefined || message.confidence !== undefined) && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Confidence:</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    (meta.confidence ?? message.confidence ?? 0) >= 0.8
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : (meta.confidence ?? message.confidence ?? 0) >= 0.5
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {((meta.confidence ?? message.confidence ?? 0) * 100).toFixed(0)}%
                </span>
              </span>
            )}

            {/* Tone badge */}
            {meta.tone && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Tone:</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {meta.tone}
                </span>
              </span>
            )}
          </div>

          {/* Escalation flag */}
          {meta.shouldEscalate && (
            <span className="text-destructive font-semibold flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Escalation Suggested
            </span>
          )}
        </div>

        {/* Debug: Context used (only show if available and in dev mode) */}
        {import.meta.env.DEV && meta.contextUsed && meta.contextUsed.length > 0 && (
          <details className="text-xs text-muted-foreground mt-2">
            <summary className="cursor-pointer font-medium">Context Used ({meta.contextUsed.length})</summary>
            <ul className="mt-1 pl-4 list-disc">
              {meta.contextUsed.map((ctx, idx) => (
                <li key={idx}>{ctx}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}

// Optional: Type guard helper
export function hasStructuredMeta(message: Message): boolean {
  return !!(message.meta && (message.meta.title || message.meta.sections?.length));
}
