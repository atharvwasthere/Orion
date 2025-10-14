import { Router } from "express";
import companies from "./v1/companies.ts";
import faqs from "./v1/faqs.ts";
import sessions from "./v1/sessions.ts";
import messages from "./v1/messages.ts";
import summary from "./v1/summary.ts";
import health from "./v1/health.ts";

export const router = Router();

router.use("/companies", companies);
router.use("/companies/:companyId/faqs", faqs);
router.use("/companies/:companyId/sessions", sessions);
router.use("/sessions/:sessionId/messages", messages);
router.use("/sessions/:sessionId/summary", summary);
router.use("/health", health);
