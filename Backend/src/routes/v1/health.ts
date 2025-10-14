import { Router} from "express";
import type { Request, Response } from "express";

const router = Router();

// Health check endpoint
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Orion backend is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;