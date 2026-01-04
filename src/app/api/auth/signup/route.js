export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(1), // Changed to min 1, will validate conditionally below
});

// LaunchPad staff emails that get LP_STAFF role
const LP_STAFF_EMAILS = [
  'rob@launchpadphilly.org',
  'sanaa@launchpadphilly.org',
  'taheera@launchpadphilly.org'
];

export async function POST(req) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Missing JWT_SECRET in environment" }, { status: 500 });
    }

    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    
    // Check password length - allow any length for LP staff, require 8+ for regular users
    const isLPStaff = LP_STAFF_EMAILS.includes(email.toLowerCase());
    if (!isLPStaff && password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Assign LP_STAFF role to LaunchPad staff emails
    const role = isLPStaff ? 'LP_STAFF' : 'USER';

    const hash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: { name, email, password: hash, role },
        select: { id: true, name: true, email: true, role: true },
      });
    } catch (err) {
      // Prisma unique constraint or connection issues
      if (err?.code === "P2002") {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      console.error("Signup prisma error:", err);
      const details = process.env.NODE_ENV !== "production" ? { code: err?.code, message: err?.message } : undefined;
      return NextResponse.json({ error: "Database error", ...(details ? { details } : {}) }, { status: 500 });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({ user });
    res.cookies.set("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error("Signup server error:", e);
    const details = process.env.NODE_ENV !== "production" ? { message: e?.message, stack: e?.stack } : undefined;
    return NextResponse.json({ error: "Server error", ...(details ? { details } : {}) }, { status: 500 });
  }
}
