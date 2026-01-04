/**
 * Seed LaunchPad staff users for role-based authentication
 * Run with: node scripts/seed-lp-staff.js
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Setup Prisma with adapter (same as in src/lib/prisma.js)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  log: ["error", "warn"],
  adapter,
});

const LP_STAFF = [
  {
    name: 'Rob',
    email: 'rob@launchpadphilly.org',
    password: 'lpuser1',
    role: 'LP_STAFF'
  },
  {
    name: 'Sanaa',
    email: 'sanaa@launchpadphilly.org',
    password: 'lpuser2',
    role: 'LP_STAFF'
  },
  {
    name: 'Taheera',
    email: 'taheera@launchpadphilly.org',
    password: 'lpuser3',
    role: 'LP_STAFF'
  }
];

async function main() {
  console.log('🌱 Seeding LaunchPad staff users...');

  const hashes = {
    'lpuser1': '$2b$10$7gvtiP92MfCbiWMxWEO8KeaPrHpRpKWR1Uk97mZCJN/rGFoDQ00nW',
    'lpuser2': '$2b$10$zA/JvkykJ4ILww5P9pG2yuAXBof56PFXp5JZ.xuR2LkkeImPX.wnG',
    'lpuser3': '$2b$10$QayzdP5AhkFhpe22sWKMqertfiFq8qW3SIipVbbu1yv/ed1876INe'
  };

  for (const staff of LP_STAFF) {
    try {
      // Try to find existing user
      const existingUser = await prisma.user.findFirst({
        where: { email: staff.email }
      });

      if (existingUser) {
        console.log(`✓ User ${staff.email} already exists, updating role...`);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: staff.role }
        });
      } else {
        // Hash password
        const hashedPassword = hashes[staff.password];

        // Create user
        const user = await prisma.user.create({
          data: {
            name: staff.name,
            email: staff.email,
            password: hashedPassword,
            role: staff.role
          }
        });

        console.log(`✓ Created ${staff.email} with role ${staff.role}`);
      }
    } catch (error) {
      console.error(`✗ Error seeding ${staff.email}:`, error);
    }
  }

  console.log('✅ LaunchPad staff seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
