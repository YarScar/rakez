"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminAnalytics() {
  const [dateFilter, setDateFilter] = useState("7days");
  const [activityFilter, setActivityFilter] = useState("all");

  const mockData = {
    sessions: 1247,
    avgDuration: 42,
    popularActivities: [
      { name: "Finger Music", completions: 342, percentage: 87 },
      { name: "Calming Flow", completions: 298, percentage: 76 },
      { name: "Energy Boost", completions: 256, percentage: 65 },
      { name: "Cognitive Games", completions: 189, percentage: 48 },
      { name: "Expressive Play", completions: 162, percentage: 41 }
    ],
    weeklyActivity: [
      { day: "Mon", count: 45 },
      { day: "Tue", count: 52 },
      { day: "Wed", count: 38 },
      { day: "Thu", count: 61 },
      { day: "Fri", count: 48 },
      { day: "Sat", count: 35 },
      { day: "Sun", count: 29 }
    ]
  };

  return (
    <main className="container" style={{ maxWidth: 1200 }}>
      <section style={{ marginBottom: 32 }}>
        <h1>📊 Analytics Dashboard</h1>
        <p style={{ color: "var(--muted)" }}>Detailed engagement metrics and performance insights</p>
      </section>

      {/* Filters */}
      <section className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.875rem" }}>Date Range</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.875rem" }}>Activity Type</label>
            <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
              <option value="all">All Activities</option>
              <option value="FINGER_MUSIC">Finger Music</option>
              <option value="CALMING_FLOW">Calming Flow</option>
              <option value="ENERGY_BOOST">Energy Boost</option>
              <option value="GAME">Cognitive Games</option>
              <option value="EXPRESSIVE_PLAY">Expressive Play</option>
            </select>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="card-grid" style={{ marginBottom: 32 }}>
        <div className="card">
          <div className="title">Total Sessions</div>
          <div className="value">{mockData.sessions}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            +12% from previous period
          </p>
        </div>
        <div className="card">
          <div className="title">Avg Duration</div>
          <div className="value">{mockData.avgDuration}s</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            Per activity session
          </p>
        </div>
        <div className="card">
          <div className="title">Completion Rate</div>
          <div className="value">94%</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            Users who finish activities
          </p>
        </div>
      </section>

      {/* Popular Activities */}
      <section className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 20 }}>Popular Activities</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mockData.popularActivities.map((activity, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{activity.name}</span>
                <span style={{ color: "var(--muted)" }}>{activity.completions} completions</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: `${activity.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Activity Chart */}
      <section className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 20 }}>Weekly Activity Trend</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
          {mockData.weeklyActivity.map((item, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ 
                width: "100%",
                height: `${(item.count / 70) * 100}%`,
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                borderRadius: "4px 4px 0 0",
                minHeight: 20
              }} />
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="actions">
        <button className="button primary">Export CSV</button>
        <Link href="/admin" className="button">Back to Admin</Link>
      </section>
    </main>
  );
}
