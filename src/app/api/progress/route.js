import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const userId = decoded.sub;

    // Fetch all user data in parallel
    const [user, sessions, tasks, achievements] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.activitySession.findMany({
        where: { userId },
        orderBy: { startedAt: "asc" },
        include: { activity: true },
      }),
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.achievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate statistics
    const totalPoints = sessions.reduce((acc, s) => acc + (s.points || 0), 0);
    const totalTaskPoints = tasks.filter(t => t.completed).length * 10;
    const combinedPoints = totalPoints + totalTaskPoints;

    const completedSessions = sessions.filter(s => s.completedAt).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    // Calculate weekly activity data
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const weeklyData = last7Days.map(date => {
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const sessionsCount = sessions.filter(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
      }).length;

      const tasksCount = tasks.filter(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      }).length;

      return {
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        activities: sessionsCount,
        tasks: tasksCount,
        total: sessionsCount + tasksCount,
      };
    });

    // Calculate monthly activity data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    const monthlyData = last30Days.reduce((acc, date) => {
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = sessions.filter(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
      }).length;

      const taskCount = tasks.filter(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      }).length;

      if (count > 0 || taskCount > 0) {
        acc.push({
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: count + taskCount,
        });
      }
      return acc;
    }, []);

    // Calculate streak (consecutive days with activity)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayStart = new Date(checkDate.setHours(0, 0, 0, 0));
      const dayEnd = new Date(checkDate.setHours(23, 59, 59, 999));

      const hasActivity = sessions.some(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
      }) || tasks.some(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });

      if (hasActivity) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Activity type breakdown
    const activityTypeBreakdown = sessions.reduce((acc, session) => {
      if (!session.completedAt) return acc;
      const type = session.activity?.type || "UNKNOWN";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      user,
      stats: {
        totalPoints: combinedPoints,
        activityPoints: totalPoints,
        taskPoints: totalTaskPoints,
        streak: currentStreak,
        completedSessions,
        completedTasks,
        totalAchievements: achievements.length,
        memberSince: user.createdAt,
      },
      weeklyData,
      monthlyData,
      activityTypeBreakdown,
      recentSessions: sessions.slice(-10).reverse(),
      achievements: achievements.slice(0, 5),
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
