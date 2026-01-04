export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SurveySchema = z.object({
  careerStage: z.enum(["STUDENT", "EARLY_CAREER", "MID_CAREER", "SENIOR"]),
  energyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  biggestStruggle: z.string(),
  tone: z.enum(["CALM", "ENERGETIC", "HUMOROUS", "SUPPORTIVE"]),
  movementComfort: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export async function POST(req) {
  try {
    const token = req.cookies.get("auth")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const parsed = SurveySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    const pref = await prisma.preference.upsert({
      where: { userId: payload.sub },
      update: { ...data },
      create: { userId: payload.sub, ...data },
    });

    return NextResponse.json({ preference: pref });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("auth")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const pref = await prisma.preference.findUnique({ where: { userId: payload.sub } });
    return NextResponse.json({ preference: pref });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
