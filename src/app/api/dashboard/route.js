export const runtime = "nodejs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

    // Calculate points from both activities and tasks
    const activityPoints = sessions.reduce((acc, s) => acc + (s.points || 0), 0);
    const taskPoints = user?.points || 0;
    const totalPoints = activityPoints + taskPoints;
    
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
        activityPoints,
        taskPoints,
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
