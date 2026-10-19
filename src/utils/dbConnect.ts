import mongoose from "mongoose";
import { logger } from "./loggers.ts";

export function getMongoUrl(): string {
  // 1. Если явно задан MONGO_URL (например, внутри Docker Compose на сервере) — используем его
  if (process.env.MONGO_URL) {
    return process.env.MONGO_URL;
  }

  // 2. Переключение по флагу MONGO_ENV: "remote" или "local"
  const mongoEnv = process.env.MONGO_ENV?.toLowerCase() || "local";

  if (mongoEnv === "remote") {
    if (!process.env.MONGO_REMOTE_URL) {
      throw new Error(
        "MONGO_REMOTE_URL is not defined in environment variables",
      );
    }
    return process.env.MONGO_REMOTE_URL;
  }

  // По умолчанию local
  if (!process.env.MONGO_LOCAL_URL) {
    throw new Error("MONGO_LOCAL_URL is not defined in environment variables");
  }
  return process.env.MONGO_LOCAL_URL;
}

export default async function dbConnect() {
  const mongoUrl = getMongoUrl();
  const envType = process.env.MONGO_URL
    ? "custom (MONGO_URL)"
    : process.env.MONGO_ENV || "local";

  await mongoose.connect(mongoUrl);
  logger.info(`MongoDB connected successfully [mode: ${envType}]`);
}
