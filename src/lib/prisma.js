import { PrismaClient } from "@prisma/client";

// Lazily initialize PrismaClient. Some CI/build environments (including
// Vercel builds) may run without runtime env vars available; creating a
// DB pool or adapter at module evaluation can cause the build to fail.
// We try to create a pg Pool+PrismaPg adapter only when `DATABASE_URL`
// is present; otherwise fall back to a plain PrismaClient so builds
// and prerenders don't crash.
const globalForPrisma = globalThis;

let _prisma = globalForPrisma.prisma;
if (!_prisma) {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      // create pg Pool + adapter only when DATABASE_URL is present
      const { Pool } = await import("pg");
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });
      const adapter = new PrismaPg(pool);
      _prisma = new PrismaClient({ log: ["error", "warn"], adapter });
    } catch (err) {
      // If adapter initialization fails at build-time, fallback to default
      // PrismaClient so the build can continue. The runtime will fail if
      // DB calls execute without a valid connection; ensure envs are set
      // in Vercel production before deploying.
      // eslint-disable-next-line no-console
      console.error("Prisma adapter init failed, falling back to default PrismaClient:", err);
      _prisma = new PrismaClient({ log: ["error", "warn"] });
    }
  } else {
    // No DATABASE_URL available (likely build/CI). Use plain PrismaClient
    // to avoid throwing during module evaluation.
    _prisma = new PrismaClient({ log: ["error", "warn"] });
  }

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
}

export const prisma = _prisma;
