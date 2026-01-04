export const runtime = "nodejs";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-helpers";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Allow any length, validate after
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400);
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = createToken({ sub: user.id, role: user.role });

    const res = successResponse({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
