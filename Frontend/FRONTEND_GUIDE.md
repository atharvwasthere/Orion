# Orion Frontend Guide

A focused guide for the Orion frontend: setup, environment, fonts, structured chat, and API wiring.

---

## 1) Install & Run

```bash
# From Frontend/
npm install
npm run dev
# Build & Preview
npm run build && npm run preview
```

---

## 2) Environment

Set the backend API base URL:

```bash
# Frontend/.env.local
VITE_API_BASE=http://localhost:5000/api/v1
```

Used by `src/lib/api.ts`:
```ts
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';
```

---

## 3) Fonts & Theme

Global font integration via jsDelivr (already configured):

- Body: `Satoshi` → `className="font-sans"`
- Display: `CabinetGrotesk` → `className="font-display"`

Files:
- `src/index.css` → `@font-face` declarations + CSS variables
- `tailwind.config.ts` → `fontFamily.sans`, `fontFamily.display`

Verify fonts in browser Network tab (TTF requests served by jsDelivr).

---

## 4) Structured Chat (Phase 9)

When backend flag `USE_STRUCTURED_OUTPUT=true` is set, messages returned from `/sessions/:id/messages` include `meta`:

```ts
export type Message = {
  id: string;
  sender: 'user' | 'bot' | 'orion' | 'system';
  text: string;
  createdAt: string;
  confidence?: number;
  retrievalScore?: number;
  meta?: {
    type?: string;
    title?: string;
    sections?: { label: string; content: string }[];
    contextUsed?: string[];
    confidence?: number;
    tone?: string;
    shouldEscalate?: boolean;
  };
};
```

Renderer:
- `src/Components/Frontend_ChatMessage_Component.tsx`
- Automatically renders title, sections, confidence badge, tone, and escalation state
- Gracefully degrades to simple bubble if `meta` is missing

Usage in Chat Page:
```tsx
import { ChatMessage } from '@/Components/Frontend_ChatMessage_Component';
...
{messages.map((m) => <ChatMessage key={m.id} message={m} />)}
```

---

## 5) Multi-Tenant Company Context

- Active company persisted in `localStorage` (`companyId`, `companyName`)
- Helpers: `src/lib/companyContext.ts` (get/set/switch company)
- API calls use `apiFetch()` with `VITE_API_BASE`

---

## 6) Key Files

- `src/Pages/ChatPage.tsx` – Production chat UX with insights rail
- `src/hooks/useChat.ts` – Manages session + message flow
- `src/lib/api.ts` – Fetch wrapper
- `src/Components/Frontend_ChatMessage_Component.tsx` – Structured message UI

---

## 7) Troubleshooting

- Messages not structured? Ensure backend `.env` → `USE_STRUCTURED_OUTPUT=true`.
- API errors? Set `VITE_API_BASE` to your backend URL.
- Fonts not applying? Verify `@font-face` appears before Tailwind imports in `index.css`.

---

## 8) Useful Scripts

- `npm run dev` – Vite dev server
- `npm run build` – Type-check + build
- `npm run preview` – Serve prod build
- `npm run lint` – ESLint

---

## 9) Related Docs

- `CHATPAGE_STRUCTURED_UPDATE.md` – Detailed wiring for structured chat
- `FONT_AND_CHAT_SETUP.md` – Fonts + Tailwind setup
- Backend docs – see `Backend/` for API & architecture