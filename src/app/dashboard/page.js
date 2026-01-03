"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <main style={{ padding: 24 }}><p>{error}</p></main>;
  if (!data) return <main style={{ padding: 24 }}><p>Loading…</p></main>;

  const { user, stats } = data;

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <h2>Hey {user?.name}! 👋</h2>
      <section style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <Card title="Current streak" value={stats.streak} />
        <Card title="Points this week" value={stats.points} />
        <Card title="Energy level" value={stats.energyLevel ?? "-"} />
      </section>
      <section style={{ marginTop: 24 }}>
        <h3>Daily Activities</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/activities">Go to Activities</Link>
          <Link href="/progress">View Progress</Link>
          <Link href="/settings">Settings</Link>
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
