"use client";
import { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState({
    tasksCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
        setAchievements({
          tasksCompleted: data.completedCount || 0,
          currentStreak: data.streak || 0,
          totalPoints: data.points || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
      });

      if (res.ok) {
        setNewTaskTitle("");
        setNewTaskDescription("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          completed: !currentStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Show achievement notification if task was completed
        if (!currentStatus && data.pointsEarned) {
          showAchievement(data.pointsEarned);
        }
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const showAchievement = (points) => {
    // Simple notification - could be enhanced with a toast library
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 2rem;">🏆</span>
        <div>
          <div style="font-weight: 600;">Task Completed!</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">+${points} points earned</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getBadgeForCount = (count) => {
    if (count >= 50) return { emoji: "🏆", title: "Master", color: "#FFD700" };
    if (count >= 25) return { emoji: "⭐", title: "Expert", color: "#C0C0C0" };
    if (count >= 10) return { emoji: "🎯", title: "Achiever", color: "#CD7F32" };
    if (count >= 5) return { emoji: "🌟", title: "Rising Star", color: "#10b981" };
    return { emoji: "🌱", title: "Beginner", color: "#3b82f6" };
  };

  const currentBadge = getBadgeForCount(achievements.tasksCompleted);

  if (loading) {
    return (
      <main className="container stack">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        <h2>Tasks & Achievements</h2>
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      </main>
    );
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <main className="container stack" style={{ maxWidth: 900 }}>
      <BackButton href="/dashboard" label="Back to Dashboard" />

      {/* Header */}
      <section style={{ textAlign: "center", marginBottom: 32 }}>
        <h1>✅ Tasks & Achievements</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Complete tasks to earn points, maintain streaks, and unlock achievements
        </p>
      </section>

      {/* Stats & Achievements */}
      <section className="card" style={{ padding: 24, background: `linear-gradient(135deg, ${currentBadge.color}15, ${currentBadge.color}05)`, border: `2px solid ${currentBadge.color}30` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{currentBadge.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>{currentBadge.title}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Current Badge</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>{achievements.tasksCompleted}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Tasks Completed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)" }}>{achievements.currentStreak}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Day Streak 🔥</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>{achievements.totalPoints}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Total Points</div>
          </div>
        </div>

        {/* Badge Progress */}
        <div style={{ marginTop: 20, padding: 16, background: "var(--surface)", borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Next Badge Progress</span>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              {achievements.tasksCompleted >= 50 ? "Max Level!" : `${achievements.tasksCompleted} / ${achievements.tasksCompleted >= 25 ? 50 : achievements.tasksCompleted >= 10 ? 25 : achievements.tasksCompleted >= 5 ? 10 : 5}`}
            </span>
          </div>
          <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              width: achievements.tasksCompleted >= 50 ? "100%" : `${(achievements.tasksCompleted / (achievements.tasksCompleted >= 25 ? 50 : achievements.tasksCompleted >= 10 ? 25 : achievements.tasksCompleted >= 5 ? 10 : 5)) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, var(--primary), var(--accent))`,
              borderRadius: 999,
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>
      </section>

      {/* Create New Task */}
      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Create New Task</h2>
        <form onSubmit={createTask} className="stack">
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Task Title</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g., Complete assignment, Study for exam, Practice meditation"
              style={{ width: "100%", padding: "10px 14px", fontSize: "1rem" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Description (Optional)</label>
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              style={{ width: "100%", padding: "10px 14px", fontSize: "1rem" }}
            />
          </div>
          <button type="submit" className="button primary" style={{ width: "fit-content" }}>
            + Add Task
          </button>
        </form>
      </section>

      {/* Active Tasks */}
      <section>
        <h2 style={{ marginBottom: 16 }}>Active Tasks ({incompleteTasks.length})</h2>
        {incompleteTasks.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
            <p style={{ color: "var(--muted)" }}>No active tasks! Create one above to get started.</p>
          </div>
        ) : (
          <div className="stack">
            {incompleteTasks.map((task) => (
              <div key={task.id} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => toggleTask(task.id, task.completed)}
                  style={{ marginTop: 4, width: 20, height: 20, cursor: "pointer", accentColor: "var(--primary)" }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 4 }}>{task.title}</h3>
                  {task.description && (
                    <p style={{ fontSize: "0.9375rem", color: "var(--muted)", marginBottom: 8 }}>{task.description}</p>
                  )}
                  <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="button"
                  style={{ padding: "6px 12px", fontSize: "0.875rem", background: "transparent", color: "#ef4444", border: "1px solid #ef4444" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section>
          <h2 style={{ marginBottom: 16 }}>Completed Tasks ({completedTasks.length})</h2>
          <div className="stack">
            {completedTasks.map((task) => (
              <div key={task.id} className="card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start", opacity: 0.7 }}>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleTask(task.id, task.completed)}
                  style={{ marginTop: 4, width: 20, height: 20, cursor: "pointer", accentColor: "var(--accent)" }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 4, textDecoration: "line-through" }}>{task.title}</h3>
                  {task.description && (
                    <p style={{ fontSize: "0.9375rem", color: "var(--muted)", marginBottom: 8 }}>{task.description}</p>
                  )}
                  <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "recently"}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="button"
                  style={{ padding: "6px 12px", fontSize: "0.875rem", background: "transparent", color: "#ef4444", border: "1px solid #ef4444" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Link to Progress */}
      <section className="card" style={{ padding: 24, textAlign: "center", background: "var(--surface)" }}>
        <h3 style={{ marginBottom: 12 }}>Track Your Full Progress</h3>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          View detailed analytics, activity history, and achievement milestones
        </p>
        <Link href="/progress" className="button primary">
          View Progress Dashboard
        </Link>
      </section>
    </main>
  );
}
