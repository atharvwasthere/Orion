import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as apiRouter } from "./routes/index.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
}
