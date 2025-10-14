# Orion Backend API Reference (v1)

## Base URL
- Local: `http://localhost:3000/api/v1`

## Versioning
- All routes are prefixed with `/api/v1`

## Authentication
- None (development mode). Add auth later if required.

## General Response Format
- Success
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Error
  ```json
  {
    "success": false,
    "error": {
      "message": "Human-readable error message"
    }
  }
  ```

---

## Health

### GET /health
- Returns service status and uptime.
- 200 OK
  ```json
  {
    "status": "OK",
    "message": "Orion backend is running",
    "timestamp": "2025-10-14T18:56:56.149Z",
    "uptime": 123.45
  }
  ```

---

## Companies

### GET /companies
- List all companies.
- 200 OK
  ```json
  {
    "success": true,
    "data": [
      { "id": "cuid", "name": "Acme", "createdAt": "...", "updatedAt": "..." }
    ]
  }
  ```

### GET /companies/:id
- Get a specific company with counts.
- 200 OK
  ```json
  {
    "success": true,
    "data": {
      "id": "cuid",
      "name": "Acme",
      "createdAt": "...",
      "updatedAt": "...",
      "_count": { "faqs": 3, "sessions": 12 }
    }
  }
  ```
- 404 Not Found

### POST /companies
- Create a company.
- Body
  ```json
  { "name": "Acme" }
  ```
- 201 Created
  ```json
  {
    "success": true,
    "data": { "id": "cuid", "name": "Acme", "createdAt": "...", "updatedAt": "..." }
  }
  ```
- 400 Bad Request (missing name)

### PUT /companies/:id
- Update company name.
- Body
  ```json
  { "name": "New Name" }
  ```
- 200 OK (updated company)
- 400 Bad Request (missing name)
- 404 Not Found

### DELETE /companies/:id
- Delete a company.
- 200 OK
  ```json
  {
    "success": true,
    "message": "Company deleted successfully"
  }
  ```
- 404 Not Found

---

## FAQs (Company-scoped Knowledge)

### GET /companies/:companyId/faqs
- List FAQs for a company.
- 200 OK
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cuid",
        "companyId": "cuid",
        "question": "How do I reset my password?",
        "answer": "Click Forgot Password...",
        "tags": ["account", "password"],
        "createdAt": "...",
        "updatedAt": "...",
        "embedding": []
      }
    ]
  }
  ```
- 404 Not Found (company)

### GET /companies/:companyId/faqs/:faqId
- 200 OK single FAQ
- 404 Not Found

### POST /companies/:companyId/faqs
- Create an FAQ.
- Body
  ```json
  {
    "question": "How do I reset my password?",
    "answer": "Click Forgot Password...",
    "tags": ["account", "password"],
    "embedding": [0.1, 0.2]
  }
  ```
- 201 Created (FAQ)
- 400 Bad Request (missing question/answer)
- 404 Not Found (company)

### PUT /companies/:companyId/faqs/:faqId
- Update an FAQ (partial).
- 200 OK (updated FAQ)
- 404 Not Found

### DELETE /companies/:companyId/faqs/:faqId
- 200 OK
  ```json
  { "success": true, "message": "FAQ deleted successfully" }
  ```
- 404 Not Found

---

## Sessions

### GET /companies/:companyId/sessions
- Query params (optional): `status=active|escalated|closed`, `user=<string>`
- 200 OK
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cuid",
        "user": "user@example.com",
        "status": "active",
        "escalationReason": null,
        "sessionConfidence": 1.0,
        "badTurns": 0,
        "goodTurns": 0,
        "oosStreak": 0,
        "createdAt": "...",
        "updatedAt": "...",
        "companyId": "cuid",
        "summary": null,
        "_count": { "messages": 5 }
      }
    ]
  }
  ```
- 404 Not Found (company)

### GET /companies/:companyId/sessions/:sessionId
- Returns session with messages (ascending).
- 200 OK
  ```json
  {
    "success": true,
    "data": {
      "id": "cuid",
      "user": "user@example.com",
      "status": "active",
      "escalationReason": null,
      "sessionConfidence": 0.92,
      "badTurns": 1,
      "goodTurns": 2,
      "oosStreak": 0,
      "createdAt": "...",
      "updatedAt": "...",
      "companyId": "cuid",
      "summary": "Optional summary...",
      "messages": [
        {
          "id": "cuid",
          "sessionId": "cuid",
          "sender": "user|orion|system",
          "text": "message content",
          "confidence": 0.9,
          "createdAt": "..."
        }
      ]
    }
  }
  ```
- 404 Not Found

### POST /companies/:companyId/sessions
- Create a session.
- Body
  ```json
  { "user": "user@example.com" }
  ```
- 201 Created (session object)
- 400 Bad Request (missing user)
- 404 Not Found (company)

### PATCH /companies/:companyId/sessions/:sessionId
- Update `status` and/or `escalationReason` and/or `summary`.
- Body (examples)
  ```json
  { "status": "escalated", "escalationReason": "low_confidence" }
  ```
  ```json
  { "status": "active" }
  ```
  ```json
  { "summary": "Short session summary text..." }
  ```
- 200 OK (updated session)
- 400 Bad Request (invalid status, missing escalationReason when escalating)
- 404 Not Found

### PUT /companies/:companyId/sessions/:sessionId
- Full update (same validations as PATCH).
- 200 OK (updated session)
- 400 / 404 as above

### DELETE /companies/:companyId/sessions/:sessionId
- Delete session and cascade messages.
- 200 OK
  ```json
  { "success": true, "message": "Session deleted successfully" }
  ```
- 404 Not Found

---

## Session Summaries

There are two ways to work with summaries:

### 1) Summary Resource Router Mounted at `/sessions/:sessionId/summary`

#### GET /sessions/:sessionId/summary
- Returns existing summary only (does not generate).
- 200 OK
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "cuid",
      "summary": "Short summary text...",
      "sessionStatus": "active",
      "messageCount": 12,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
- 404 Not Found (session)
- 404 Not Found (no summary available)

#### POST /sessions/:sessionId/summary
- Create or update summary (manual).
- Body
  ```json
  { "summary": "Short summary text..." }
  ```
- 201 Created (if created) or 200 OK (if updated)
- 400 Bad Request (missing summary)
- 404 Not Found (session)

#### DELETE /sessions/:sessionId/summary
- Removes existing summary from session.
- 200 OK
  ```json
  { "success": true, "message": "Summary deleted successfully" }
  ```
- 404 Not Found (session or no summary to delete)

#### POST /sessions/:sessionId/summary/generate
- “Mock” generator provided; creates a placeholder summary from messages.
- Body (optional)
  ```json
  { "llmProvider": "mock" }
  ```
- 200 OK (summary generated)
- 400 Bad Request (no messages to summarize)
- 404 Not Found (session)

### 2) Inline Generation via `GET /companies/:companyId/sessions/:sessionId/summary`
- Triggers generation using the LLM summarizer utility and updates `session.summary`.
- 200 OK
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "cuid",
      "summary": "Generated by LLM...",
      "updatedAt": "..."
    }
  }
  ```
- 404 Not Found (session)

### Auto-Summary (Phase 4)
- After every N conversation messages (user + orion), an async job auto-generates a summary and stores it on the session.
- Controlled by env `SUMMARY_INTERVAL` (default 8).
- FE can fetch latest summary via `GET /sessions/:sessionId/summary`.

---

## Messages (LLM Orchestration)

### GET /sessions/:sessionId/messages
- Optional query: `sender=user|orion|system`
- Lists messages (ascending).
- 200 OK
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cuid",
        "sessionId": "cuid",
        "sender": "user|orion|system",
        "text": "message text",
        "confidence": 0.9,
        "createdAt": "..."
      }
    ]
  }
  ```
- 404 Not Found (session)

### GET /sessions/:sessionId/messages/:messageId
- 200 OK (message object)
- 404 Not Found

### POST /sessions/:sessionId/messages
- Create a message from `user|orion|system`.
- Body
  ```json
  {
    "sender": "user",
    "text": "I need help with my account"
  }
  ```
- Behavior when `sender = user`:
  - Persists user message
  - Builds context (last 6 messages + top 5 FAQs)
  - Calls LLM (Gemini or Mock) to generate reply and confidence
  - Persists orion message with confidence
  - Computes `retrievalScore`
  - Updates rolling `sessionConfidence` (EWMA)
  - Determines `shouldEscalate` and `escalationReason`, potentially inserts system message
  - Auto-triggers summary after N messages (async)
- 201 Created
  ```json
  {
    "success": true,
    "data": {
      "userMessageId": "cuid",
      "userMessage": {
        "id": "cuid", "sessionId": "cuid",
        "sender": "user", "text": "I need help with my account",
        "confidence": null, "createdAt": "..."
      },
      "shouldEscalate": false,
      "botMessageId": "cuid",
      "botMessage": {
        "id": "cuid", "sessionId": "cuid",
        "sender": "orion", "text": "LLM reply...",
        "confidence": 0.9, "createdAt": "..."
      },
      "reply": "LLM reply...",
      "confidence": 0.9,
      "sessionConfidence": 0.91,
      "retrievalScore": 0.74,
      "escalationReason": null
    }
  }
  ```
- 400 Bad Request (validation)
- 404 Not Found (session)

### PUT /sessions/:sessionId/messages/:messageId
- Update message `text` and/or `confidence`.
- 200 OK (updated message)
- 404 Not Found

### DELETE /sessions/:sessionId/messages/:messageId
- Delete a message.
- 200 OK
  ```json
  { "success": true, "message": "Message deleted successfully" }
  ```
- 404 Not Found

---

## Provider Switching and Confidence/Escalation (for FE expectations)
- LLM Provider: env `LLM_PROVIDER=gemini|mock`
- Per-message confidence in responses is `confidence`
- Rolling session meter: `sessionConfidence` (0..1)
- Retrieval proxy: `retrievalScore` (0..1)
- Escalation:
  - `shouldEscalate`: boolean
  - `escalationReason`: `"low_confidence" | "out_of_scope" | null`

---

## Environment Variables (Backend)
- `DATABASE_URL`               Postgres connection string
- `PORT`                       Server port (default 3000)
- `NODE_ENV`                   development|production
- `LLM_PROVIDER`               gemini|mock
- `GEMINI_API_KEY`             API key when using Gemini provider
- `CONF_THRESHOLD`             default 0.4 (per-message low-confidence trigger)
- `CONF_LAMBDA`                default 0.6 (EWMA smoothing)
- `OOS_THRESHOLD`              default 0.25 (retrieval score threshold)
- `OOS_STREAK`                 default 2 (consecutive low retrieval to trip OOS)
- `NEG_FEEDBACK_PENALTY`       default 0.30
- `REASK_PENALTY`              default 0.15
- `LOW_CONF_LINEAR_START`      default 0.50
- `HALLUCINATION_PENALTY`      default 0.20
- `HELPFUL_BOOST`              default 0.10
- `GROUNDED_BOOST`             default 0.05
- `MAX_TURN_BOOST`             default 0.10
- `SUMMARY_INTERVAL`           default 8 (auto-summary every N messages)

---

## Domain Models (For FE)

### Company
```json
{
  "id": "string",
  "name": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "_count?": { "faqs": number, "sessions": number }
}
```

### FAQ
```json
{
  "id": "string",
  "companyId": "string",
  "question": "string",
  "answer": "string",
  "tags": ["string"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "embedding": [number]
}
```

### Session
```json
{
  "id": "string",
  "user": "string",
  "status": "active|escalated|closed",
  "escalationReason": "low_confidence|out_of_scope|policy|tool_error|null",
  "sessionConfidence": number,
  "badTurns": number,
  "goodTurns": number,
  "oosStreak": number,
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "companyId": "string",
  "summary": "string|null",
  "messages?": [Message]
}
```

### Message
```json
{
  "id": "string",
  "sessionId": "string",
  "sender": "user|orion|system",
  "text": "string",
  "confidence": number|null,
  "createdAt": "ISODate"
}
```

---

## Frontend Implementation Tips
- For chat:
  - Call `POST /sessions/:sessionId/messages` with `{ sender: 'user', text }`
  - Render `reply`, `confidence`, `sessionConfidence`, `retrievalScore`, and escalation badges
- For sessions list:
  - `GET /companies/:companyId/sessions` with optional `status`/`user` filters
- For knowledge:
  - Use `GET/POST/PUT/DELETE` on `/companies/:companyId/faqs`
- For summaries:
  - Show summary badge; fetch with `GET /sessions/:sessionId/summary`
  - Optional manual create/update via `POST /sessions/:sessionId/summary`
  - Auto-summary is generated in the background every `SUMMARY_INTERVAL` turns

---

## Example cURL

Create company
```bash
curl -X POST http://localhost:3000/api/v1/companies \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme"}'
```

Create session
```bash
curl -X POST http://localhost:3000/api/v1/companies/{companyId}/sessions \
  -H "Content-Type: application/json" \
  -d '{"user":"user@example.com"}'
```

Send user message (LLM reply returned)
```bash
curl -X POST http://localhost:3000/api/v1/sessions/{sessionId}/messages \
  -H "Content-Type: application/json" \
  -d '{"sender":"user","text":"How do I reset my password?"}'
```

Fetch summary
```bash
curl http://localhost:3000/api/v1/sessions/{sessionId}/summary
```
