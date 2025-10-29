import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger, errorLogger } from "./middleware/logger.js";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  
  // Phase 4: Request logging middleware
  app.use(requestLogger);

  app.use("/api/v1", apiRouter);
  
  // Phase 4: Error logging middleware
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}
