import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../utils/dbConnect.ts";
import { userModel } from "../models/user-model.ts";
import { logger } from "../utils/loggers.ts";

async function runMigration(): Promise<void> {
  try {
    await dbConnect();
    logger.info("Starting migration: add default rating to existing users...");

    // Update all existing users where 'rating' is not set or null
    const result = await userModel.updateMany(
      { rating: { $exists: false } },
      { $set: { rating: 0 } },
    );

    logger.info(
      `Migration completed successfully. Matched ${result.matchedCount} user document(s), modified ${result.modifiedCount}.`,
    );
  } catch (error) {
    logger.error(
      `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    logger.info("MongoDB connection closed.");
  }
}

void runMigration();
