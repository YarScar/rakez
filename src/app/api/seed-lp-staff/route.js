import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

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

export async function POST() {
  try {
    const results = [];

    for (const staff of LP_STAFF) {
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: { email: staff.email }
      });

      if (existingUser) {
        // Update role
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: staff.role }
        });
        results.push({ email: staff.email, status: 'updated' });
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(staff.password, 10);
        await prisma.user.create({
          data: {
            name: staff.name,
            email: staff.email,
            password: hashedPassword,
            role: staff.role
          }
        });
        results.push({ email: staff.email, status: 'created' });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'LP staff users seeded successfully',
      results 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Failed to seed users',
      details: error.message 
    }, { status: 500 });
  }
}
