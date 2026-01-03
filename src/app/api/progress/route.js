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

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 401 });
    }

    // Fetch all user data in parallel with error handling
    let user, sessions, tasks, achievements;
    
    try {
      [user, sessions, tasks, achievements] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true, createdAt: true, points: true, tasksCompleted: true },
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
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json({ error: "Database error", details: dbError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate statistics with safe defaults
    // User.points now contains all points (from both tasks and activities)
    const totalPoints = user.points || 0;

    const completedSessions = (sessions || []).filter(s => s.completedAt).length;
    const completedTasks = user.tasksCompleted || 0;

    // Calculate weekly activity data with error handling
    let weeklyData = [];
    try {
      const now = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      weeklyData = last7Days.map(date => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        const sessionsCount = (sessions || []).filter(s => {
          try {
            const sessionDate = new Date(s.startedAt);
            return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
          } catch {
            return false;
          }
        }).length;

        const tasksCount = (tasks || []).filter(t => {
          try {
            if (!t.completedAt) return false;
            const taskDate = new Date(t.completedAt);
            return taskDate >= dayStart && taskDate <= dayEnd;
          } catch {
            return false;
          }
        }).length;

        return {
          date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
          activities: sessionsCount,
          tasks: tasksCount,
          total: sessionsCount + tasksCount,
        };
      });
    } catch (error) {
      console.error("Error calculating weekly data:", error);
      weeklyData = Array(7).fill({ date: "", activities: 0, tasks: 0, total: 0 });
    }

    // Calculate monthly activity data with error handling
    let monthlyData = [];
    try {
      monthlyData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date;
      }).reduce((acc, date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        const count = (sessions || []).filter(s => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
        }).length;

        const taskCount = (tasks || []).filter(t => {
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
    } catch (error) {
      console.error("Error calculating monthly data:", error);
      monthlyData = [];
    }

    // Calculate streak (consecutive days with activity) with error handling
    let currentStreak = 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dayStart = new Date(checkDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const hasActivity = (sessions || []).some(s => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= dayStart && sessionDate <= dayEnd && s.completedAt;
        }) || (tasks || []).some(t => {
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
    } catch (error) {
      console.error("Error calculating streak:", error);
      currentStreak = 0;
    }

    // Activity type breakdown with error handling
    let activityTypeBreakdown = {};
    try {
      activityTypeBreakdown = (sessions || []).reduce((acc, session) => {
        if (!session.completedAt) return acc;
        const type = session.activity?.type || "UNKNOWN";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error calculating activity breakdown:", error);
      activityTypeBreakdown = {};
    }

    return NextResponse.json({
      user,
      stats: {
        totalPoints: totalPoints,
        streak: currentStreak,
        completedSessions,
        completedTasks,
        totalAchievements: (achievements || []).length,
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
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      error: "Failed to fetch progress",
      details: error.message 
    }, { status: 500 });
  }
}
