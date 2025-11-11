# Orion Frontend

React + TypeScript + Tailwind + shadcn/ui + TanStack Router frontend for the Orion AI assistant platform.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   Copy `.env.local` and set your API base URL:
   ```bash
   VITE_API_BASE=http://localhost:3000/api/v1
   ```
   
   Optionally hardcode a company ID:
   ```bash
   VITE_COMPANY_ID=your-company-id
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

## Phase 1 — Setup Wizard (`/dashboard/setup`)

Complete 3-step onboarding flow:

### Step 1: Upload FAQs
- Upload a JSON file with FAQ data
- Expected format: `[{ question: string, answer: string, tags?: string[] }]`
- Validates and previews FAQs in a table
- Imports FAQs via `POST /api/v1/companies/:companyId/faqs`
- Shows progress and error handling

### Step 2: Pick Mock User
- Select a mock user from dropdown (5 pre-defined users)
- Automatically creates a session via `POST /api/v1/companies/:companyId/sessions`
- Stores `sessionId` in `localStorage`

### Step 3: Open Preview Chat
- Opens `/chat` in a new browser tab
- Requires Step 2 to be complete (sessionId must exist)

## Phase 2 — Preview Chat (`/chat`)

Full-featured chat interface with live backend integration:

### Features

**Message Thread**
- Loads existing messages via `GET /sessions/:sessionId/messages`
- Sends new messages via `POST /sessions/:sessionId/messages`
- Displays user and bot bubbles with timestamps
- Shows confidence and retrieval scores on bot messages
- Optimistic UI updates for smooth UX
- Auto-scrolls to latest message

**Right Rail (Insights Panel)**
- **Summary**: Auto-generated conversation summary from `GET /sessions/:sessionId/summary`
- **Signals**: Real-time confidence, retrieval score, and session confidence meters
- **Knowledge Used**: Top 3 FAQs from company knowledge base

**Session Management**
- Rehydrates from `localStorage` on page load
- Creates default session if none exists
- Displays session ID and status in header

**Escalation Handling**
- Shows escalation banner when `shouldEscalate` flag is true
- Disables composer input when session is escalated
- Updates status badge in header

**Error Handling**
- Network errors surface as non-blocking banners
- Failed messages are removed from optimistic UI
- Loading states with spinner indicators

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for file-based routing
- **Tailwind CSS** for styling
- **shadcn/ui** for component primitives
- **Lucide React** for icons

## Architecture

### API Helpers
- `src/lib/api.ts` — Generic fetch wrapper with error handling
- `src/lib/ensureCompanyId.ts` — Company discovery/creation and session management

### Hooks
- `src/hooks/useChat.ts` — Chat state machine (messages, summary, signals, escalation)

### Routes
- `/dashboard/setup` — Setup wizard
- `/chat` — Preview chat interface

## localStorage Keys

- `companyId` — Cached company ID
- `sessionId` — Current chat session ID (used only by `/chat`)

## Session Management

**Important**: The `useChat` hook automatically creates sessions and is designed **only** for the interactive preview chat (`/chat`). 

- **Preview Chat** (`/chat`) → Uses `useChat` hook, manages `localStorage.sessionId`
- **Conversation Detail** (`/dashboard/conversations/:id`) → Read-only view, fetches data directly via `apiFetch()`, never creates sessions

See `SESSION_FIX.md` for detailed explanation of session lifecycle management.

## Phase 3 — Dashboard Home & Conversations

### Dashboard Home (`/dashboard`)

Mission Control overview with three key cards:

**System Summary Card**
- Online status indicator with pulsing green dot
- Model name (configurable via `VITE_MODEL_NAME`)
- Confidence threshold (configurable via `VITE_CONFIDENCE_THRESHOLD`)
- Context window size (configurable via `VITE_CONTEXT_WINDOW`)
- Uptime progress bar

**Live Conversations Card**
- Last 3 sessions from `GET /companies/:companyId/sessions?limit=3`
- Shows user, last updated time, confidence score, and status badge
- Confidence indicators with color coding (green ≥0.85, amber <0.85)
- Trend icons for confidence visualization
- "View All" button navigates to `/dashboard/conversations`
- Loading spinner and empty states

**Knowledge Base Summary Card**
- Total FAQ count from `GET /companies/:companyId/faqs`
- Shows recently added FAQs (last 24 hours)
- "Add FAQ" button links to `/dashboard/faqs`

### Conversations List (`/dashboard/conversations`)

Browse all sessions with filtering:

**Tabs**
- All / Active / Escalated / Closed
- Client-side filtering from full session list
- Shows count for current filter

**Session List (Left Pane)**
- Avatar with user initials
- User name and session ID
- Status badge (green/amber/gray)
- Message count and last updated time
- Confidence bar indicator (optional, if available)
- Loads up to 50 sessions via `GET /companies/:companyId/sessions?limit=50`

**Detail Pane (Right)**
- Placeholder instructing to select a session
- Will be implemented in Phase 4

**Features**
- Loading spinner while fetching
- Empty states for no data scenarios
- Error handling with red banner
- Smooth hover transitions
- Responsive grid layout

## Next Steps (Phase 4+)

- FAQ Library management (`/dashboard/faqs`)
- Session detail view with transcript
- Settings page for client configuration
- Analytics dashboard
