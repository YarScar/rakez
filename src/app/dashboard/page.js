"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            // User not authenticated, redirect to home
            router.push("/");
            return;
          }
          throw new Error(json.error || "Failed to load");
        }
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [router]);

  if (error) return <main style={{ padding: 24 }}><p>{error}</p></main>;
  if (!data) return <main style={{ padding: 24 }}><p>Loading…</p></main>;

  const { user, stats } = data;

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
    border: "none",
  };

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <style>{`
        .button-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
          border: 2px solid transparent;
        }
        
        .button-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4);
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
      
      <h2>Hey {user?.name}! 👋</h2>
      <section style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <Card title="Current streak" value={`${stats.streak} days`} />
        <Card title="Total Points" value={stats.points} />
        <Card title="Tasks Completed" value={stats.totalTasks || 0} />
        <Card title="Activities Completed" value={stats.totalActivities || 0} />
      </section>
      <section style={{ marginTop: 24 }}>
        <h3>Daily Activities</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <Link href="/tasks" className="button-link">
            📋 My Tasks
          </Link>
          <Link href="/activities" className="button-link">
            🎯 Activities
          </Link>
          <Link href="/progress" className="button-link">
            📊 Progress
          </Link>
          <Link href="/settings" className="button-link">
            ⚙️ Settings
          </Link>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, minWidth: 160 }}>
      <div style={{ color: "#666", fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{String(value)}</div>
    </div>
  );
}
