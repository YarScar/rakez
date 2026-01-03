import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Get user from token
async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth");
    if (!token) return null;

    const decoded = jwt.verify(token.value, JWT_SECRET);
    return decoded.sub;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

// GET - Fetch all tasks for the user
export async function GET() {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [
        { completed: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Calculate stats
    const completedCount = tasks.filter((t) => t.completed).length;
    const points = completedCount * 10; // 10 points per completed task

    // Calculate streak (simplified - could be enhanced with date-based logic)
    const recentCompletions = tasks.filter((t) => 
      t.completed && t.completedAt && 
      new Date(t.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const streak = Math.min(recentCompletions, 7); // Max 7-day streak shown

    return NextResponse.json({
      tasks,
      completedCount,
      points,
      streak,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST - Create a new task
export async function POST(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || "",
        completed: false,
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PATCH - Update task (toggle completion)
export async function PATCH(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, completed } = body;

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Calculate points earned (10 points per task)
    const pointsEarned = completed ? 10 : 0;

    return NextResponse.json({ task, pointsEarned });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE - Delete a task
export async function DELETE(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
