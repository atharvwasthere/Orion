# Session Management Fix

## Problem Description

When clicking on a conversation from `/dashboard/conversations` to view details at `/dashboard/conversations/:id`, it appeared to create a "duplicate" session. This wasn't actually creating a new session in the database, but rather causing confusion because:

1. The conversation detail page was using session creation logic meant for the preview chat
2. Two different pages were managing the same `sessionId` in `localStorage` independently
3. The detail page would try to create a new session instead of reading the existing one

## Root Cause

The `useChat` hook was designed for the **interactive preview chat** (`/chat`) where:
- Users actively send messages
- A session must exist or be created
- The session is stored in `localStorage` for continuity

When reused in the **conversation detail page** (`/dashboard/conversations/:id`):
- The page should be **read-only** (agent view of past conversations)
- The `sessionId` comes from the **route parameter**, not `localStorage`
- No new session should ever be created

## Solution

### ✅ Fixed Implementation

**1. Conversation Detail Page (`/dashboard/conversations/:id`)**
- ✅ **Reads** sessionId from route parameter: `const { id: sessionId } = Route.useParams()`
- ✅ **Fetches** data directly with `apiFetch()` — no `useChat` hook
- ✅ **Never creates** a new session
- ✅ **Never writes** to `localStorage.sessionId`
- ✅ Displays read-only transcript, summary, and confidence timeline
- ✅ Shows clear note: "This is a read-only view. To continue the conversation, use the preview chat."

**2. Preview Chat Page (`/chat`)**
- ✅ Uses `useChat` hook as intended
- ✅ Creates or reuses session from `localStorage`
- ✅ Interactive composer for sending messages
- ✅ Live updates and optimistic UI

**3. Documentation Added**
- ✅ Added JSDoc to `useChat` hook warning about its purpose
- ✅ Makes it clear: only use `useChat` for interactive chat, not read-only views

## Usage Guidelines

### ✅ DO use `useChat` for:
- `/chat` — Interactive preview chat
- Any page where users actively send messages

### ❌ DON'T use `useChat` for:
- `/dashboard/conversations/:id` — Read-only conversation detail
- Any agent/admin view of past conversations
- Any page where you have a specific `sessionId` in the route

### How to fetch session data read-only:

```tsx
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Route } from '@/routes/your-route';

export default function ReadOnlySessionView() {
  const { id: sessionId } = Route.useParams();
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch messages - NO session creation
      const { data } = await apiFetch(`/sessions/${sessionId}/messages`);
      setMessages(data);
    };
    fetchData();
  }, [sessionId]);
  
  // Render read-only view
  return <div>...</div>;
}
```

## Testing the Fix

1. **Start both servers**
   ```bash
   cd Backend && npm run dev  # port 3000
   cd Frontend && npm run dev # port 5173
   ```

2. **Create a session via setup**
   - Navigate to `/dashboard/setup`
   - Upload FAQs
   - Create a mock user session

3. **Send messages in chat**
   - Open `/chat` in new tab
   - Send 2-3 messages
   - Note the `sessionId` in localStorage

4. **View from dashboard**
   - Navigate to `/dashboard`
   - See session in "Live Conversations"
   - Click "View All" → `/dashboard/conversations`
   - Click on the session row

5. **Verify read-only detail view**
   - ✅ URL shows correct sessionId: `/dashboard/conversations/[id]`
   - ✅ Same messages display as in `/chat`
   - ✅ No new session created
   - ✅ `localStorage.sessionId` unchanged
   - ✅ Confidence timeline shows bot message scores
   - ✅ Summary displays (if available)
   - ✅ Status badge shows correct state

6. **Navigate back to /chat**
   - ✅ Original session still active
   - ✅ Same messages visible
   - ✅ Can continue conversation

## Key Takeaways

- **Preview chat** (`/chat`) = Interactive, creates sessions
- **Detail view** (`/dashboard/conversations/:id`) = Read-only, never creates sessions
- **Route params** take precedence over `localStorage` for session identification
- **`useChat` hook** is specific to interactive chat, not a general-purpose session loader

## Related Files

- `src/hooks/useChat.ts` — Interactive chat hook (with documentation)
- `src/Pages/ChatPage.tsx` — Uses `useChat` for preview chat
- `src/Pages/DashboardConversations.tsx` — Read-only detail view (fixed)
- `src/Pages/ConversationsPage.tsx` — List view with links to detail
- `src/Pages/Dashboard.tsx` — Dashboard home with session list
