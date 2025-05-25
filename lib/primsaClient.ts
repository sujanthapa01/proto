import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
// This code initializes a Prisma Client instance and ensures that it is reused in development mode to prevent exhausting database connections.
// In production, a new instance is created for each request.
// The `globalForPrisma` variable is used to store the Prisma Client instance globally, allowing it to be reused across different modules in the application.
// This is particularly useful in Next.js applications where the server may restart frequently during development, leading to multiple Prisma Client instances being created.           