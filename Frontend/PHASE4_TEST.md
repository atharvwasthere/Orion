# Phase 4 Testing Guide — Escalation Management

## Prerequisites

1. **Backend running**: `cd Backend && npm run dev` (port 3000)
2. **Frontend running**: `cd Frontend && npm run dev` (port 5173)
3. **Escalations created**: Have at least one session that triggered `shouldEscalate: true`

## Creating Test Escalations

If you don't have escalations yet, you can create them by:

1. Navigate to `/chat`
2. Send messages that trigger low confidence responses (if your backend has confidence thresholds)
3. Backend should automatically create an escalation when `shouldEscalate: true`

OR manually create via backend API:
```bash
POST /api/v1/companies/:companyId/escalations
{
  "sessionId": "session_id_here",
  "user": "test@example.com",
  "reason": "Low confidence",
  "status": "Open"
}
```

---

## Test Scenarios

### 1. Escalations List Page (`/dashboard/escalations`)

#### Initial Load
- [ ] Page loads without errors
- [ ] "Escalations" heading visible
- [ ] Loading spinner displays while fetching

#### With Data
- [ ] **Table displays** with columns:
  - [ ] Ticket ID
  - [ ] User
  - [ ] Reason
  - [ ] Assigned to (or "Unassigned" in italic)
  - [ ] Status badge with icon
  - [ ] Created timestamp
  - [ ] Actions (View, Resolve buttons)

#### Status Badges
- [ ] **Open** → Yellow badge with AlertTriangle icon
- [ ] **In Progress** → Orange badge with Clock icon
- [ ] **Resolved** → Green badge with CheckCircle2 icon

#### Empty State
- [ ] When no escalations: Shows CheckCircle2 icon
- [ ] Message: "No active escalations"
- [ ] Subtitle: "Your AI's on top of things! 🎉"

#### Error State
- [ ] If API fails: Red AlertTriangle icon
- [ ] Error message displayed
- [ ] "Retry" button visible and functional

#### Table Actions
- [ ] **View button** → Opens detail sheet from right
- [ ] **Resolve button** (only on Open/In Progress):
  - [ ] Shows confirmation dialog
  - [ ] Updates status to "Resolved"
  - [ ] Badge updates immediately after success
  - [ ] List refreshes to show updated data

---

### 2. Detail Sheet

#### Opening
- [ ] Clicking "View" opens sheet from right side
- [ ] Sheet header shows "Escalation [ID]"
- [ ] SessionId displayed below title
- [ ] Sheet overlay dims background

#### Status Card
- [ ] Displays current status with badge
- [ ] Shows user name
- [ ] Shows reason
- [ ] Shows created timestamp formatted correctly

#### Assignment Card
- [ ] **Assign to** dropdown visible
- [ ] Shows 3 mock agents: Alex P., Sarah M., Mike R.
- [ ] Current assignedTo pre-selected (if exists)
- [ ] "Assign" button:
  - [ ] Disabled when no agent selected
  - [ ] Disabled when same agent already assigned
  - [ ] Shows spinner while updating
  - [ ] Updates successfully via PATCH
  - [ ] Refreshes list after assignment

#### Summary Card
- [ ] **If summary exists**: Shows conversation summary text
- [ ] **If no summary**: Card not displayed (optional feature)
- [ ] Text is readable and formatted nicely

#### Actions Section
- [ ] **Mark In Progress button**:
  - [ ] Only visible when status = "Open"
  - [ ] Updates status to "In Progress"
  - [ ] Badge updates in sheet
  - [ ] List refreshes
  - [ ] Button disabled while updating

- [ ] **Resolve Escalation button**:
  - [ ] Visible for "Open" and "In Progress"
  - [ ] NOT visible for "Resolved"
  - [ ] Updates status to "Resolved"
  - [ ] Badge updates immediately
  - [ ] Button disabled while updating

- [ ] **View Full Conversation button**:
  - [ ] Links to `/dashboard/conversations/:sessionId`
  - [ ] Opens correct session detail page
  - [ ] Session detail loads without creating new session

#### Sheet Interactions
- [ ] Clicking outside sheet closes it
- [ ] X button in corner closes sheet
- [ ] Sheet scrollable if content overflows
- [ ] Updates persist after closing and reopening

---

### 3. Integration Tests

#### End-to-End Workflow
1. [ ] Navigate to `/dashboard/escalations`
2. [ ] Click "View" on an escalation
3. [ ] Assign to "Alex P." → verify update
4. [ ] Click "Mark In Progress" → verify status change
5. [ ] Close sheet → verify table shows updated status
6. [ ] Reopen same escalation → verify assignment persisted
7. [ ] Click "Resolve" → verify resolution
8. [ ] Verify "Resolve" button disappears from table row
9. [ ] Click "View Full Conversation" → lands on session detail
10. [ ] Navigate back to escalations → data still current

#### Quick Resolve from Table
1. [ ] Click "Resolve" button on table row (no opening sheet)
2. [ ] Confirm dialog appears
3. [ ] Click OK → status updates to "Resolved"
4. [ ] Badge changes to green
5. [ ] "Resolve" button disappears from that row

#### Multiple Escalations
- [ ] Table shows all escalations
- [ ] Each escalation can be viewed independently
- [ ] Updates to one don't affect others
- [ ] Status colors are correct for each row

---

### 4. Data Accuracy Tests

#### API Integration
- [ ] **GET /companies/:companyId/escalations** called on mount
- [ ] **PATCH /escalations/:id** called on status update
- [ ] **PATCH /escalations/:id** called on assignment
- [ ] **GET /sessions/:sessionId/summary** called when viewing escalation
- [ ] All responses handled correctly

#### State Management
- [ ] Refetch after status update
- [ ] Refetch after assignment
- [ ] Sheet state updates optimistically
- [ ] List updates after sheet actions
- [ ] No stale data displayed

#### Error Handling
- [ ] Network errors show alert with message
- [ ] Failed updates don't corrupt UI state
- [ ] Retry mechanism works after errors
- [ ] Loading states prevent double-clicks

---

### 5. UI/UX Tests

#### Responsive Design
- [ ] Sheet width adapts on mobile (90vw) vs desktop (540px)
- [ ] Table scrollable horizontally on mobile
- [ ] Buttons stack properly on small screens
- [ ] No layout breaks on narrow viewports

#### Loading States
- [ ] Spinner centered vertically and horizontally
- [ ] Button shows spinner icon while updating
- [ ] Table doesn't flicker during refetch
- [ ] Optimistic updates feel instant

#### Accessibility
- [ ] Status badges have icons for color-blind users
- [ ] Buttons have clear labels
- [ ] Sheet can be closed with keyboard (Escape)
- [ ] Focus management works in sheet

---

## Exit Criteria Checklist

✅ **1. /dashboard/escalations loads live data from backend**
- [ ] API call to `/companies/:companyId/escalations` works
- [ ] Table populates with real data
- [ ] No console errors

✅ **2. Status badges & color coding match real values**
- [ ] Open = Yellow with AlertTriangle
- [ ] In Progress = Orange with Clock
- [ ] Resolved = Green with CheckCircle2

✅ **3. Clicking "View" opens detail modal**
- [ ] Sheet slides in from right
- [ ] All cards display correctly
- [ ] Summary loads (if available)

✅ **4. "Resolve" and "In Progress" buttons update via PATCH and reflect instantly**
- [ ] Status updates via PATCH request
- [ ] UI updates immediately
- [ ] List refreshes to show changes
- [ ] No duplicate requests

✅ **5. Navigating to linked conversation shows the same session (no new one created)**
- [ ] "View Full Conversation" links to correct sessionId
- [ ] Session detail page loads without creating new session
- [ ] `localStorage.sessionId` unchanged

✅ **6. Empty/error/loading states implemented**
- [ ] Spinner during load
- [ ] Empty state for no escalations
- [ ] Error state with retry button

---

## Common Issues & Solutions

### No escalations showing
- **Check**: Backend has escalations in DB
- **Solution**: Create test escalations via chat or API

### PATCH requests failing
- **Check**: Backend `/escalations/:id` endpoint exists
- **Check**: Payload format matches backend schema
- **Solution**: Verify backend accepts `{ status, assignedTo }` fields

### Sheet not opening
- **Check**: shadcn Sheet component installed correctly
- **Check**: Browser console for errors
- **Solution**: Verify `@radix-ui/react-dialog` installed

### Assignment not persisting
- **Check**: `assignedTo` field in backend model
- **Check**: PATCH response includes updated data
- **Solution**: Add refetch after assignment

---

## Phase 4 Complete! 🎉

All exit criteria met? You now have a fully functional admin suite:

- ✅ Setup Wizard
- ✅ Preview Chat
- ✅ Dashboard Home
- ✅ Conversations List & Detail
- ✅ **Escalation Management** ← You are here!

**Next: Phase 5 (FAQ Library) or commit your work!**
