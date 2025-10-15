# Escalations Architecture

## Backend Implementation

The Orion backend **does not have a separate `escalations` table**. Instead, escalations are managed through **session status**.

### How It Works

1. **Session Status Field**: Each session has a `status` field that can be:
   - `active` — Normal conversation
   - `escalated` — Requires human intervention
   - `closed` — Conversation ended

2. **Escalation Trigger**: When a session should be escalated (low confidence, out-of-scope, etc.):
   - Session status → `"escalated"`
   - `escalationReason` field set (e.g., `"low_confidence"`, `"out_of_scope"`)
   - Optional `assignedTo` field for agent assignment

3. **API Endpoints**:
   ```
   GET /companies/:companyId/sessions?status=escalated  # Fetch escalations
   PATCH /sessions/:sessionId                            # Update escalation
   ```

### Frontend Adaptation

The frontend `useEscalations` hook:
- **Fetches**: Escalated sessions via `GET /sessions?status=escalated`
- **Maps**: Session data to "Escalation" format for UI consistency
- **Updates**: Uses `PATCH /sessions/:sessionId` to change status/assignment

### Status Mapping

| Escalation Status | Session Status | Description |
|-------------------|----------------|-------------|
| `Open`           | `escalated`    | Newly escalated, awaiting assignment |
| `In Progress`    | `active`       | Agent working on it |
| `Resolved`       | `closed`       | Issue resolved, conversation ended |

### Escalation ID Format

Since there's no separate escalation table, the frontend generates display IDs:
```typescript
id: `ESC-${session.id.slice(-6)}`  // e.g., "ESC-9pm81o"
```

This is **display-only**. Internally, we always use the `sessionId` for API calls.

---

## Code Structure

### Hook: `src/hooks/useEscalations.ts`

```typescript
// Fetches escalated sessions
const { data } = await apiFetch<Session[]>(
  `/companies/${companyId}/sessions?status=escalated`
);

// Converts to escalation format
const escalationsList = (data || []).map(sessionToEscalation);
```

### Update Function

```typescript
export async function updateEscalation(sessionId: string, payload) {
  // Map escalation status → session status
  let sessionStatus;
  if (payload.status === 'Resolved') sessionStatus = 'closed';
  if (payload.status === 'In Progress') sessionStatus = 'active';
  if (payload.status === 'Open') sessionStatus = 'escalated';

  // Update session
  return apiFetch(`/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: sessionStatus, ...payload })
  });
}
```

---

## Why This Design?

### ✅ Advantages

1. **Simplicity**: No separate table, fewer joins
2. **Consistency**: Session lifecycle in one place
3. **Less duplication**: Escalation data is session data
4. **Easier queries**: Filter by status field

### ⚠️ Trade-offs

1. **No escalation history**: Can't track multiple escalations per session
2. **Limited metadata**: Can't store escalation-specific notes easily
3. **Status overload**: Session status field serves multiple purposes

---

## Testing

### Create Test Escalations

**Method 1: Via Chat**
1. Go to `/chat`
2. Send messages that trigger low confidence
3. Backend automatically escalates when confidence drops

**Method 2: Via API**
```bash
PATCH /sessions/:sessionId
{
  "status": "escalated",
  "escalationReason": "Low confidence"
}
```

### Verify It Works

1. Navigate to `/dashboard/escalations`
2. Should see session listed as "Open" escalation
3. Click "View" → detail sheet opens
4. Assign agent → updates session
5. Mark "In Progress" → session status becomes "active"
6. Resolve → session status becomes "closed"

---

## Future Enhancements

If you need more complex escalation tracking, consider:

1. **Separate Escalations Table**:
   - Track multiple escalations per session
   - Store escalation-specific metadata
   - Maintain escalation history

2. **Escalation Events**:
   - Log escalation creation/updates
   - Track response times
   - Measure resolution metrics

3. **Assignment Queue**:
   - Auto-assign based on agent availability
   - Round-robin or skill-based routing
   - Escalation priority levels

For now, the session-based approach keeps things simple and functional! ✅
