export const runtime = "nodejs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("auth")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { sub } = jwt.verify(token, process.env.JWT_SECRET);

    const [user, sessions, tasks] = await Promise.all([
      prisma.user.findUnique({ 
        where: { id: sub }, 
        select: { id: true, name: true, points: true, tasksCompleted: true } 
      }),
      prisma.activitySession.findMany({ 
        where: { userId: sub },
        orderBy: { startedAt: "desc" }
      }),
      prisma.task.findMany({ 
        where: { userId: sub },
        orderBy: { createdAt: "desc" }
      }),
    ]);

    // User.points now contains all points (tasks + activities)
    const totalPoints = user?.points || 0;
    
    // Calculate streak (consecutive days with activity)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivity = sessions.some(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
      }) || tasks.some(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });

      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    const energyLevel = sessions.at(0)?.energyLevel || null;
    const totalActivities = sessions.filter(s => s.completedAt).length;
    const totalTasks = user?.tasksCompleted || 0;

    return NextResponse.json({ 
      user, 
      stats: { 
        points: totalPoints,
        streak, 
        energyLevel, 
        totalActivities,
        totalTasks
      } 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, email } = body;

    const data = {};
    if (typeof name === "string") data.name = name;
    if (typeof email === "string") data.email = email;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Attempt update; handle unique email constraint error
    try {
      const updated = await prisma.user.update({ where: { id: userId }, data, select: { id: true, name: true, email: true } });
      return NextResponse.json({ user: updated });
    } catch (e) {
      if (e.code === "P2002") {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      throw e;
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
