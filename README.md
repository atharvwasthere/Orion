<div align="center">

# ORION

Multi‑tenant, structured AI support assistant.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io)
[![License](https://img.shields.io/badge/License-MIT-black)](#)

<br/>

A production‑ready, context‑aware assistant that responds in structured JSON—rendered into clean, trustworthy UI.

</div>

---

## ✨ Highlights

- Hybrid context retrieval (Company Profile + Semantic FAQ Top‑K)
- Structured responses (summary, sections, confidence, escalation)
- Adaptive session confidence with EMA smoothing
- Multi‑tenant company context (localStorage + API scoping)
- Fast, modern stack (React 19, Vite 7, Tailwind v4, Prisma)

---

## 🧱 Monorepo Layout

```
Orion/
├── Backend/                     # Express + Prisma API
│   ├── prisma/                  # Schema + migrations
│   ├── src/                     # Routes, services, LLM, confidence
│   ├── HYBRID_CONTEXT_API.md    # Backend API & hybrid context docs
│   ├── PHASE_9_STRUCTURED_INTELLIGENCE.md
│   └── IMPLEMENTATION_COMPLETE.md
└── Frontend/                    # React + Vite app
    ├── src/
    │   ├── Pages/ChatPage.tsx
    │   ├── Components/Frontend_ChatMessage_Component.tsx
    │   └── hooks/useChat.ts
    ├── README.md                # Frontend readme
    └── FRONTEND_GUIDE.md        # Focused guide (this project)
```

---

## 🚀 Quickstart

```bash
# 1) Backend
cd Backend
npm install
npx prisma migrate dev
npm run dev

# 2) Frontend (in a new terminal)
cd ../Frontend
npm install
# point to backend if needed
echo "VITE_API_BASE=http://localhost:5000/api/v1" > .env.local
npm run dev
```

Open the chat at: http://localhost:5173/chat

---

## 🧠 How It Works

```
User → [Hybrid Context]
      - Embed query (Gemini)
      - Fetch companyProfile
      - Rank Top‑K FAQs by cosine similarity
   → [LLM Structured JSON]
      - title, summary, sections[], confidence, tone, shouldEscalate
   → [Confidence Engine]
      - EMA smoothing, signals, escalation
   → [Store]
      - Message.text + meta (JSON)
   → [Frontend]
      - Structured renderer → beautiful, consistent UI
```

---

## ⚙️ Configuration

Backend `.env` (excerpt):

```env
# Phase 9
USE_STRUCTURED_OUTPUT=true

# Phase 7 thresholds
CONF_THRESHOLD_STRONG=0.8
CONF_THRESHOLD_WEAK=0.5
CONF_THRESHOLD_ESCALATE=0.3
CONF_SMOOTHING_FACTOR=0.2
```

Frontend `.env.local`:

```env
VITE_API_BASE=http://localhost:5000/api/v1
```

---

## 🧩 Key Features

- Structured LLM outputs with strict JSON shape
- `meta` stored on Message for analytics + UI rendering
- Company profile auto‑generated from FAQs
- Auto‑embedding of FAQs on create/update
- Confidence logging for observability

---

## 📚 Documentation

- Backend
  - `Backend/HYBRID_CONTEXT_API.md`
  - `Backend/PHASE_9_STRUCTURED_INTELLIGENCE.md`
  - `Backend/IMPLEMENTATION_COMPLETE.md`
- Frontend
  - `Frontend/README.md`
  - `Frontend/FRONTEND_GUIDE.md`

---

## 🛠️ Tech Stack

- Backend: Node, Express, Prisma (PostgreSQL), Gemini API (@google/genai)
- Frontend: React 19, Vite 7, Tailwind v4, Radix UI, TanStack Router

---

## 🧪 Testing

Backend:
```bash
cd Backend
npm test
```

Frontend:
- Manual: `npm run dev` and exercise `/chat` and dashboard routes

---

## 🤝 Contributing

- Fork → Feature branch → PR
- Include screenshots/GIFs for UI changes
- Add docs for new configuration or endpoints

---

## 📄 License

MIT © Orion
