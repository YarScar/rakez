export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        preference: {
          select: {
            careerStage: true,
            energyLevel: true,
            tone: true,
            movementComfort: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ users });
  } catch (e) {
    console.error("Users list error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
