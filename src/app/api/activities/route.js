import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.sub;
    console.log('[Activities API] Decoded user ID:', userId);

    const { type, points, duration } = await req.json();

    if (!type || points === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[Activities API] User ${userId} completed ${type} activity with ${points} points`);

    // Find or create the activity type in the database
    let activity = await prisma.activity.findFirst({
      where: { type: type }
    });

    if (!activity) {
      // Create a default activity record if it doesn't exist
      activity = await prisma.activity.create({
        data: {
          name: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: type,
          description: `${type} activity`,
          difficulty: 'EASY',
          durationMin: Math.floor(duration / 60) || 3,
          status: 'ACTIVE'
        }
      });
      console.log(`[Activities API] Created new activity record:`, activity);
    }

    // Create activity session record
    const activitySession = await prisma.activitySession.create({
      data: {
        userId: userId,
        activityId: activity.id,
        points: points,
        durationSec: duration || 0,
        completedAt: new Date()
      }
    });

    console.log(`[Activities API] Created session:`, activitySession);

    // Update user's total points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points
        }
      },
      select: { points: true, tasksCompleted: true }
    });

    console.log(`[Activities API] Updated user. New total points: ${updatedUser.points}, Tasks completed: ${updatedUser.tasksCompleted}`);

    return NextResponse.json({ 
      success: true, 
      activitySession,
      pointsEarned: points 
    });

  } catch (error) {
    console.error("[Activities API] Full error:", error);
    console.error("[Activities API] Error message:", error.message);
    console.error("[Activities API] Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.sub;

    // Get all activities for the user
    const activities = await prisma.activitySession.findMany({
      where: { userId: userId },
      orderBy: { completedAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ activities });

  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
