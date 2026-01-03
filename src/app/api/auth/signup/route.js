export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: { name, email, password: hash },
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
