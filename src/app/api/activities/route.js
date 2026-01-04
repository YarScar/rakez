import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { errorResponse, successResponse, validateRequiredFields, handleApiError } from "@/lib/api-helpers";

export async function POST(req) {
  try {
    const userId = await getUserFromToken();
    
    // For testing: allow activities without auth, but log it
    if (!userId) {
      console.log('[Activities API] No auth - allowing for demo purposes');
    }

    const body = await req.json();
    const { type, points, duration } = body;

    const validationError = validateRequiredFields(body, ['type', 'points']);
    if (validationError) {
      console.error('[Activities API] Validation failed:', body);
      return validationError;
    }

    console.log(`[Activities API] ${userId ? `User ${userId}` : 'Anonymous'} completed ${type} activity with ${points} points`);

    // If no userId, just return success without saving to database
    if (!userId) {
      return successResponse({ 
        success: true, 
        pointsEarned: points,
        demo: true,
        message: 'Activity completed (demo mode - not saved)'
      });
    }

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

    return successResponse({ 
      success: true, 
      activitySession,
      pointsEarned: points 
    });

  } catch (error) {
    console.error("[Activities API] Full error:", error);
    return handleApiError(error, "Activities");
  }
}

export async function GET(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    // Get all activities for the user
    const activities = await prisma.activitySession.findMany({
      where: { userId: userId },
      orderBy: { completedAt: 'desc' },
      take: 50
    });

    return successResponse({ activities });

  } catch (error) {
    return handleApiError(error, "Activity fetch");
  }
}