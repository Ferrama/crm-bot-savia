import { logger } from "../utils/logger";
import { initializePrisma, shutdownPrisma } from "./prisma";

export const setupPrisma = async () => {
  try {
    await initializePrisma();
    logger.info("Prisma database connection established");
  } catch (error) {
    logger.error(`Failed to initialize Prisma: ${error.message}`);
    throw error;
  }
};

export const teardownPrisma = async () => {
  try {
    await shutdownPrisma();
    logger.info("Prisma database connection closed");
  } catch (error) {
    logger.error(`Error during Prisma teardown: ${error.message}`);
  }
};
