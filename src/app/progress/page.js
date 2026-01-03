"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import BackButton from "@/components/BackButton";

export default function ProgressPage() {
  const weeklyCanvasRef = useRef(null);
  const monthlyCanvasRef = useRef(null);
  const typeCanvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) return;

    // Weekly Chart
    const weeklyCtx = weeklyCanvasRef.current?.getContext("2d");
    if (weeklyCtx) {
      const weeklyChart = new Chart(weeklyCtx, {
        type: "bar",
        data: {
          labels: data.weeklyData.map(d => d.date),
          datasets: [
            {
              label: "Activities",
              data: data.weeklyData.map(d => d.activities),
              backgroundColor: "rgba(59, 130, 246, 0.7)",
            },
            {
              label: "Tasks",
              data: data.weeklyData.map(d => d.tasks),
              backgroundColor: "rgba(16, 185, 129, 0.7)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: true },
            title: { display: true, text: "Last 7 Days Activity" }
          },
          scales: { 
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
            x: { stacked: true },
            y: { stacked: true }
          },
        },
      });
      return () => weeklyChart.destroy();
    }
  }, [data]);

  useEffect(() => {
    if (!data || !data.monthlyData.length) return;

    // Monthly Chart
    const monthlyCtx = monthlyCanvasRef.current?.getContext("2d");
    if (monthlyCtx) {
      const monthlyChart = new Chart(monthlyCtx, {
        type: "line",
        data: {
          labels: data.monthlyData.map(d => d.date),
          datasets: [
            {
              label: "Total Activities",
              data: data.monthlyData.map(d => d.count),
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: true },
            title: { display: true, text: "30-Day Trend" }
          },
          scales: { y: { beginAtZero: true } },
        },
      });
      return () => monthlyChart.destroy();
    }
  }, [data]);

  useEffect(() => {
    if (!data || !Object.keys(data.activityTypeBreakdown).length) return;

    // Activity Type Breakdown
    const typeCtx = typeCanvasRef.current?.getContext("2d");
    if (typeCtx) {
      const typeChart = new Chart(typeCtx, {
        type: "doughnut",
        data: {
          labels: Object.keys(data.activityTypeBreakdown).map(k => k.replace(/_/g, ' ')),
          datasets: [
            {
              data: Object.values(data.activityTypeBreakdown),
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(251, 191, 36, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(139, 92, 246, 0.8)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: true, position: 'bottom' },
            title: { display: true, text: "Activity Types" }
          },
        },
      });
      return () => typeChart.destroy();
    }
  }, [data]);

  if (loading) {
    return (
      <main className="container stack">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        <h2>Your Progress</h2>
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="container stack">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        <h2>Your Progress</h2>
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p>Failed to load progress data</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container stack">
      <BackButton href="/dashboard" label="Back to Dashboard" />
      
      <section style={{ textAlign: "center", marginBottom: 32 }}>
        <h1>📊 Your Progress</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Track your activities, tasks, and achievements over time
        </p>
      </section>

      {/* Stats Overview */}
      <section className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>{data.stats.totalPoints}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Total Points</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)" }}>{data.stats.streak}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Day Streak 🔥</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>{data.stats.completedSessions}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Activities Done</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)" }}>{data.stats.completedTasks}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4 }}>Tasks Completed</div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 24 }}>
        <div className="card" style={{ padding: 20, height: 360 }}>
          <canvas ref={weeklyCanvasRef} />
        </div>
        <div className="card" style={{ padding: 20, height: 360 }}>
          <canvas ref={monthlyCanvasRef} />
        </div>
      </div>

      {/* Activity Type Breakdown */}
      {Object.keys(data.activityTypeBreakdown).length > 0 && (
        <div className="card" style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
          <canvas ref={typeCanvasRef} style={{ maxHeight: 300 }} />
        </div>
      )}

      {/* Recent Activity */}
      {data.recentSessions.length > 0 && (
        <section>
          <h2 style={{ marginBottom: 16 }}>Recent Activities</h2>
          <div className="stack">
            {data.recentSessions.map((session) => (
              <div key={session.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{session.activity?.name || "Activity"}</h3>
                    <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                      {new Date(session.startedAt).toLocaleString()}
                      {session.completedAt && " • Completed"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--primary)" }}>
                      +{session.points} pts
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                      {session.durationSec}s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Member Since */}
      <section className="card" style={{ padding: 24, textAlign: "center", background: "var(--surface)" }}>
        <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: 8 }}>
          Member Since
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          {new Date(data.stats.memberSince).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </section>
    </main>
  );
}
