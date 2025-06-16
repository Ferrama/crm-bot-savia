import { PrismaService } from "../services/PrismaService/PrismaService";

// Initialize Prisma service
export const prismaService = new PrismaService();

// Initialize Prisma connection
export const initializePrisma = async () => {
  await prismaService.initialize();
};

// Graceful shutdown
export const shutdownPrisma = async () => {
  try {
    await prismaService.disconnect();
  } catch (error) {
    console.error("Error during Prisma shutdown:", error);
  }
};

// Export the Prisma client for direct use
export const prisma = prismaService.getClient();
