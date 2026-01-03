"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Fetch admin metrics
    (async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok) {
          setMetrics({
            activeUsers: data.users?.length || 0,
            activitiesCompleted: 1247,
            engagementRate: 87
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <main className="container" style={{ maxWidth: 1200 }}>
      <BackButton href="/dashboard" label="Back to Dashboard" />
      <section style={{ marginBottom: 32 }}>
        <h1>🛡️ Admin Overview</h1>
        <p style={{ color: "var(--muted)" }}>Monitor user engagement and app performance</p>
      </section>

      {/* Key Metrics */}
      <section className="card-grid" style={{ marginBottom: 32 }}>
        <div className="card">
          <div className="title">Active Users</div>
          <div className="value">{metrics?.activeUsers || "-"}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            Total registered users
          </p>
        </div>
        <div className="card">
          <div className="title">Activities Completed</div>
          <div className="value">{metrics?.activitiesCompleted || "-"}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            All-time completions
          </p>
        </div>
        <div className="card">
          <div className="title">Engagement Rate</div>
          <div className="value">{metrics?.engagementRate || "-"}%</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            Weekly active users
          </p>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="feature-grid" style={{ marginBottom: 32 }}>
        <Link href="/admin/users" className="card feature-card" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>👥</div>
          <h3>User Management</h3>
          <p>View all users, preferences, and activity history</p>
        </Link>

        <Link href="/admin/analytics" className="card feature-card" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📊</div>
          <h3>Analytics Dashboard</h3>
          <p>Detailed metrics, charts, and engagement data</p>
        </Link>

        <Link href="/admin/activities" className="card feature-card" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚙️</div>
          <h3>Activity Management</h3>
          <p>Create, edit, and configure hand activities</p>
        </Link>

        <Link href="/admin/logs" className="card feature-card" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📝</div>
          <h3>Admin Logs</h3>
          <p>Audit trail of all admin actions and changes</p>
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="card">
        <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
        <div className="actions">
          <Link href="/admin/activities/new" className="button primary">Add New Activity</Link>
          <Link href="/admin/analytics" className="button">View Full Analytics</Link>
          <Link href="/dashboard" className="button">View as User</Link>
        </div>
      </section>
    </main>
  );
}
