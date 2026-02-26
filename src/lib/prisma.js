import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let _prisma = globalForPrisma.prisma;

if (!_prisma) {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    try {
      // Only import pg & adapter at runtime
      const { Pool } = await import("pg");
      const { PrismaPg } = await import("@prisma/adapter-pg");

      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });

      const adapter = new PrismaPg(pool);
      _prisma = new PrismaClient({ log: ["error", "warn"], adapter });
    } catch (err) {
      console.error(
        "Prisma adapter init failed, falling back to default PrismaClient:",
        err
      );
      _prisma = new PrismaClient({ log: ["error", "warn"] });
    }
  } else {
    // No DATABASE_URL (likely build/CI). Use default PrismaClient
    _prisma = new PrismaClient({ log: ["error", "warn"], engine: "binary" });
  }

  // Only cache Prisma in dev, prevents multiple connections
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
}

export const prisma = _prisma;