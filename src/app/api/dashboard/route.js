export const runtime = "nodejs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const token = req.cookies.get("auth")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { sub } = jwt.verify(token, process.env.JWT_SECRET);

    const [user, sessions] = await Promise.all([
      prisma.user.findUnique({ where: { id: sub }, select: { id: true, name: true } }),
      prisma.activitySession.findMany({ where: { userId: sub } }),
    ]);

    const points = sessions.reduce((acc, s) => acc + (s.points || 0), 0);
    const streak = 0; // TODO: implement streak calc
    const energyLevel = sessions.at(-1)?.energyLevel || null;

    return NextResponse.json({ user, stats: { points, streak, energyLevel, totalActivities: sessions.length } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
