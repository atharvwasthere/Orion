# Phase 3 Testing Guide

## Prerequisites

1. **Backend running**: `cd Backend && npm run dev` (port 3000)
2. **Frontend running**: `cd Frontend && npm run dev` (port 5173)
3. **Phase 1 & 2 completed**: At least one session with FAQs uploaded

## Test Scenarios

### 1. Dashboard Home (`/dashboard`)

#### System Summary Card
- [x] Green pulsing "Online" indicator visible
- [x] Model name displays (default: "Gemini 2.5 Flash" or from `VITE_MODEL_NAME`)
- [x] Confidence threshold shows (default: "0.82" or from `VITE_CONFIDENCE_THRESHOLD`)
- [x] Context window displays (default: "8 messages" or from `VITE_CONTEXT_WINDOW`)
- [x] Uptime progress bar shows 99.9% with green fill

#### Live Conversations Card
- [x] **With sessions**: Shows last 3 sessions in table
  - [x] User name is clickable (links to `/dashboard/conversations/$id`)
  - [x] "Last Updated" shows relative time ("2 min ago", "1 hr ago", etc.)
  - [x] Confidence displays with color (green ≥0.85, amber <0.85) and trend icon
  - [x] Status badge shows correct color (green=active, amber=escalated, gray=closed)
- [x] **Without sessions**: Shows empty state message
  - [x] "No active conversations yet."
  - [x] "Start a chat to see sessions here."
- [x] **Loading**: Shows spinner while fetching
- [x] "View all" button navigates to `/dashboard/conversations`

#### Knowledge Base Summary Card
- [x] **With FAQs**: Shows total count "X FAQs loaded"
- [ ] **Recent FAQs**: Shows "Y added today" if any FAQs created in last 24 hours
- [ ] **Loading**: Shows spinner with "Loading FAQs..." text
- [ ] "Add FAQ" button links to `/dashboard/faqs`

#### Navigation
- [x] "Go to preview chat" button links to `/chat`
- [x] All cards render without console errors

---

### 2. Conversations List (`/dashboard/conversations`)

#### Header
- [ ] Title "Conversations" displays
- [ ] "Open preview chat" button links to `/chat`

#### Tabs
- [ ] Four tabs visible: All / Active / Escalated / Closed
- [ ] Default tab is "All"
- [ ] Clicking tabs filters sessions correctly
- [ ] Tab underline animation works

#### Session List (Left Pane)

**With Data:**
- [ ] Sessions load in list format
- [ ] Each session shows:
  - [ ] Avatar with user initials (2 letters, uppercase)
  - [ ] User name (truncated if long)
  - [ ] Session ID (small gray text)
  - [ ] Status badge (correct color and label)
  - [ ] Message count or "No messages"
  - [ ] Relative time ("just now", "5 min ago", etc.)
  - [ ] Confidence bar (if confidence > 0) with color coding
- [ ] Hover effect on list items (light background)
- [ ] List items are clickable (link to detail page)

**Empty States:**
- [ ] **All tab**: "No conversations found" + "Start a chat to see sessions here."
- [ ] **Filtered tab**: "No conversations found" + "No [status] sessions."

**Loading:**
- [ ] Spinner displays while fetching
- [ ] Spinner is centered vertically

**Error:**
- [ ] Red banner with error message if API fails

#### Detail Pane (Right)
- [ ] Placeholder message: "Select a conversation to view"
- [ ] Instruction text visible
- [ ] Card is centered and styled

#### Filtering Tests
1. [ ] **All tab**: Shows all sessions regardless of status
2. [ ] **Active tab**: Shows only status="active" sessions
3. [ ] **Escalated tab**: Shows only status="escalated" sessions
4. [ ] **Closed tab**: Shows only status="closed" sessions
5. [ ] Tab switches update list immediately (no refetch)

#### Responsive Design
- [ ] On large screens: 2-column layout (list + detail)
- [ ] On mobile: Single column, detail pane hidden initially

---

### 3. Integration Tests

#### End-to-End Flow
1. [ ] Complete Phase 1 setup (upload FAQs, create session)
2. [ ] Navigate to `/chat` and send 2-3 messages
3. [ ] Navigate to `/dashboard`
4. [ ] Verify session appears in "Live Conversations"
5. [ ] Click "View all" → lands on `/dashboard/conversations`
6. [ ] Verify session appears in conversations list
7. [ ] Filter by "Active" tab → session still visible
8. [ ] Click session row → navigates to detail page (placeholder)

#### Data Accuracy
- [ ] Session confidence matches last bot message confidence
- [ ] Status badge reflects actual session status from backend
- [ ] Relative times update correctly
- [ ] FAQ count matches actual uploaded FAQs

#### Performance
- [ ] Dashboard loads within 2 seconds
- [ ] No unnecessary API refetches on tab switch
- [ ] Smooth transitions and animations
- [ ] No console errors or warnings

---

## Exit Criteria Checklist

✅ **1. See an overview on /dashboard with live data from backend**
- [ ] System Summary shows config values
- [ ] Live Conversations fetches and displays real sessions
- [ ] Knowledge Base Summary shows real FAQ count

✅ **2. Browse sessions on /dashboard/conversations with correct statuses**
- [ ] Sessions load from API
- [ ] All status badges display correctly
- [ ] Filtering by tab works

✅ **3. Click "View All" on home card to open conversations page**
- [ ] Button navigates to `/dashboard/conversations`
- [ ] Sessions list loads properly

---

## Common Issues & Solutions

### "No active conversations yet" on Dashboard
- **Solution**: Create a session via `/dashboard/setup` or send a message in `/chat`

### FAQ count shows 0
- **Solution**: Upload FAQs via `/dashboard/setup` Step 1

### Confidence shows "N/A"
- **Solution**: Send at least one message in chat to generate confidence score

### Sessions not loading
- **Check**: Backend is running on port 3000
- **Check**: `VITE_API_BASE` is set correctly in `.env.local`
- **Check**: Browser console for network errors

### Styling issues
- **Check**: Tailwind CSS is configured correctly
- **Check**: shadcn/ui components are installed
- **Try**: Clear browser cache and rebuild

---

## Phase 3 Complete! 🎉

All exit criteria met? Proceed to Phase 4 (FAQ Library & Settings) when ready.
