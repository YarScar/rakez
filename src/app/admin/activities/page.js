"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminActivities() {
  const [activities, setActivities] = useState([
    { id: 1, name: "Finger Music", type: "FINGER_MUSIC", status: "ACTIVE", difficulty: 2, completions: 342 },
    { id: 2, name: "Calming Flow", type: "CALMING_FLOW", status: "ACTIVE", difficulty: 1, completions: 298 },
    { id: 3, name: "Energy Boost", type: "ENERGY_BOOST", status: "ACTIVE", difficulty: 3, completions: 256 },
    { id: 4, name: "Cognitive Games", type: "GAME", status: "ACTIVE", difficulty: 4, completions: 189 },
    { id: 5, name: "Expressive Play", type: "EXPRESSIVE_PLAY", status: "ACTIVE", difficulty: 2, completions: 162 }
  ]);

  const toggleStatus = (id) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, status: a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : a
    ));
  };

  return (
    <main className="container" style={{ maxWidth: 1200 }}>
      <section style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>⚙️ Activity Management</h1>
          <p style={{ color: "var(--muted)" }}>Configure and manage hand activities</p>
        </div>
        <Link href="/admin/activities/new" className="button primary">
          + Add New Activity
        </Link>
      </section>

      {/* Activity Table */}
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Difficulty</th>
                <th>Completions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td style={{ fontWeight: 600 }}>{activity.name}</td>
                  <td style={{ fontSize: "0.875rem", color: "var(--muted)" }}>{activity.type}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(activity.id)}
                      style={{
                        padding: "4px 12px",
                        fontSize: "0.75rem",
                        borderRadius: "999px",
                        border: "none",
                        background: activity.status === "ACTIVE" ? "var(--accent)" : "var(--muted)",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      {activity.status}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{ 
                          color: i <= activity.difficulty ? "var(--primary)" : "var(--border)",
                          fontSize: "1.2rem"
                        }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{activity.completions}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/admin/activities/${activity.id}`} className="button" style={{ padding: "6px 12px", fontSize: "0.875rem" }}>
                        Edit
                      </Link>
                      <button 
                        style={{ padding: "6px 12px", fontSize: "0.875rem", color: "var(--muted)" }}
                        onClick={() => confirm("Delete this activity?") && setActivities(activities.filter(a => a.id !== activity.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="card" style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Feature Flags</h3>
        <div className="feature-grid">
          {[
            "Hand Tracking",
            "AI Recommendations",
            "Achievements System",
            "Social Sharing",
            "Daily Streaks",
            "Notifications"
          ].map((feature, i) => (
            <div key={i} style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: 12
            }}>
              <span style={{ fontWeight: 600 }}>{feature}</span>
              <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </section>

      <section className="actions" style={{ marginTop: 32 }}>
        <Link href="/admin" className="button">Back to Admin</Link>
      </section>
    </main>
  );
}
