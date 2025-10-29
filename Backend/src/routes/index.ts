import { Router } from "express";
import companies from "./v1/companies.js";
import faqs from "./v1/faqs.js";
import sessions from "./v1/sessions.js";
import messages from "./v1/messages.js";
import summary from "./v1/summary.js";
import health from "./v1/health.js";

export const router = Router();

router.use("/companies", companies);
router.use("/companies/:companyId/faqs", faqs);
router.use("/companies/:companyId/sessions", sessions);
router.use("/sessions/:sessionId/messages", messages);
router.use("/sessions/:sessionId/summary", summary);
router.use("/health", health);
