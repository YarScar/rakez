/*
 Seed a test user via Prisma
 Usage: node scripts/seed-user.js
*/
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const email = process.env.SEED_EMAIL || 'seed@example.com';
  const name = process.env.SEED_NAME || 'Seed User';
  const pass = process.env.SEED_PASSWORD || 'password123';
  const password = await bcrypt.hash(pass, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', existing);
  } else {
    const user = await prisma.user.create({ data: { name, email, password } });
    console.log('Created user:', user);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
