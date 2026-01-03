import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Always provide pg adapter to satisfy Prisma 'client' engine
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["error", "warn"],
  adapter,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
