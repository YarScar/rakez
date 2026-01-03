"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogs() {
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("7days");

  const mockLogs = [
    { id: 1, admin: "admin@rakez.app", action: "CREATE_ACTIVITY", details: "Created 'Finger Waves' activity", timestamp: "2026-01-02 14:23:15", status: "SUCCESS" },
    { id: 2, admin: "admin@rakez.app", action: "UPDATE_ACTIVITY", details: "Updated 'Calming Flow' difficulty to 2", timestamp: "2026-01-02 13:45:02", status: "SUCCESS" },
    { id: 3, admin: "admin@rakez.app", action: "TOGGLE_FEATURE", details: "Enabled 'Hand Tracking' feature flag", timestamp: "2026-01-02 11:30:45", status: "SUCCESS" },
    { id: 4, admin: "admin@rakez.app", action: "DELETE_USER", details: "Deleted user test@example.com", timestamp: "2026-01-01 16:22:33", status: "SUCCESS" },
    { id: 5, admin: "admin@rakez.app", action: "EXPORT_DATA", details: "Exported analytics CSV for Dec 2025", timestamp: "2026-01-01 10:15:20", status: "SUCCESS" },
    { id: 6, admin: "moderator@rakez.app", action: "UPDATE_SETTINGS", details: "Changed notification preferences", timestamp: "2025-12-31 18:05:12", status: "SUCCESS" },
    { id: 7, admin: "admin@rakez.app", action: "CREATE_ACTIVITY", details: "Attempted to create duplicate activity", timestamp: "2025-12-31 14:40:55", status: "FAILED" }
  ];

  const filteredLogs = mockLogs.filter(log => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    return true;
  });

  const handleExport = () => {
    alert("Exporting logs as CSV...");
  };

  return (
    <main className="container" style={{ maxWidth: 1200 }}>
      <section style={{ marginBottom: 32 }}>
        <h1>📝 Admin Logs</h1>
        <p style={{ color: "var(--muted)" }}>Audit trail of all administrative actions</p>
      </section>

      {/* Filters */}
      <section className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.875rem" }}>Action Type</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
              <option value="all">All Actions</option>
              <option value="CREATE_ACTIVITY">Create Activity</option>
              <option value="UPDATE_ACTIVITY">Update Activity</option>
              <option value="DELETE_ACTIVITY">Delete Activity</option>
              <option value="TOGGLE_FEATURE">Toggle Feature</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="EXPORT_DATA">Export Data</option>
              <option value="UPDATE_SETTINGS">Update Settings</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: "0.875rem" }}>Date Range</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button onClick={handleExport} className="button primary" style={{ marginLeft: "auto" }}>
            Export CSV
          </button>
        </div>
      </section>

      {/* Logs Table */}
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Details</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: "var(--muted)", fontSize: "0.875rem" }}>#{log.id}</td>
                  <td style={{ fontSize: "0.875rem" }}>{log.admin}</td>
                  <td>
                    <code style={{ 
                      fontSize: "0.75rem", 
                      padding: "2px 8px",
                      background: "var(--surface-elevated)",
                      borderRadius: 4,
                      fontFamily: "monospace"
                    }}>
                      {log.action}
                    </code>
                  </td>
                  <td style={{ fontSize: "0.875rem", maxWidth: 300 }}>{log.details}</td>
                  <td style={{ fontSize: "0.875rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {log.timestamp}
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      borderRadius: "999px",
                      background: log.status === "SUCCESS" ? "var(--accent)" : "#ef4444",
                      color: "white",
                      fontWeight: 600
                    }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
            No logs found matching your filters.
          </div>
        )}
      </section>

      <section className="actions" style={{ marginTop: 32 }}>
        <Link href="/admin" className="button">Back to Admin</Link>
      </section>
    </main>
  );
}
