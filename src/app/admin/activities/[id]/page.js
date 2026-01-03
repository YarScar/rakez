"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActivityEditor({ params }) {
  const router = useRouter();
  const isNew = !params?.id || params.id === "new";
  
  const [form, setForm] = useState({
    name: "",
    type: "FINGER_MUSIC",
    description: "",
    difficulty: 3,
    duration: 30,
    gestureRequirements: "",
    status: "ACTIVE"
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Activity saved successfully!");
      router.push("/admin/activities");
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this activity?")) {
      router.push("/admin/activities");
    }
  };

  return (
    <main className="container" style={{ maxWidth: 900 }}>
      <section style={{ marginBottom: 32 }}>
        <h1>{isNew ? "➕ Create New Activity" : "✏️ Edit Activity"}</h1>
        <p style={{ color: "var(--muted)" }}>Configure activity settings and requirements</p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Main Form */}
        <section className="card">
          <form style={{ display: "grid", gap: 16 }}>
            <div>
              <label>Activity Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Finger Music"
                required
              />
            </div>

            <div>
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="FINGER_MUSIC">Finger Music</option>
                <option value="CALMING_FLOW">Calming Flow</option>
                <option value="ENERGY_BOOST">Energy Boost</option>
                <option value="GAME">Cognitive Game</option>
                <option value="EXPRESSIVE_PLAY">Expressive Play</option>
              </select>
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the activity purpose and instructions..."
                rows={4}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label>Difficulty (1-5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: parseInt(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)" }}>
                  <span>Easy</span>
                  <span style={{ fontWeight: 600, color: "var(--primary)" }}>{form.difficulty}</span>
                  <span>Hard</span>
                </div>
              </div>

              <div>
                <label>Default Duration (seconds)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                  min="10"
                  max="300"
                />
              </div>
            </div>

            <div>
              <label>Gesture Requirements</label>
              <textarea
                value={form.gestureRequirements}
                onChange={(e) => setForm({ ...form, gestureRequirements: e.target.value })}
                placeholder="e.g., Index finger tap, Pinch gesture, Open hand..."
                rows={3}
              />
            </div>

            <div>
              <label>Status</label>
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={form.status === "ACTIVE"}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  />
                  Active
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={form.status === "INACTIVE"}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  />
                  Inactive
                </label>
              </div>
            </div>
          </form>
        </section>

        {/* Preview Panel */}
        <aside>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Live Preview</h3>
            <div style={{ 
              padding: 20, 
              border: "2px dashed var(--border)", 
              borderRadius: 12,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>
                {form.type === "FINGER_MUSIC" ? "🎵" :
                 form.type === "CALMING_FLOW" ? "🌊" :
                 form.type === "ENERGY_BOOST" ? "⚡" :
                 form.type === "GAME" ? "🧩" : "🎨"}
              </div>
              <h4>{form.name || "Activity Name"}</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                {form.description || "Activity description will appear here..."}
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: 2, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} style={{ 
                    color: i <= form.difficulty ? "var(--primary)" : "var(--border)"
                  }}>
                    ★
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 12 }}>
                {form.duration}s · {form.status}
              </p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h4 style={{ marginBottom: 12, fontSize: "0.875rem" }}>Tips</h4>
            <ul style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--muted)", marginLeft: 20 }}>
              <li>Keep names concise and memorable</li>
              <li>Set difficulty based on gesture complexity</li>
              <li>Test gestures before activating</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Action Buttons */}
      <section className="actions" style={{ marginTop: 32 }}>
        <button onClick={handleSave} className="button primary" disabled={saving}>
          {saving ? "Saving..." : "Save Activity"}
        </button>
        <Link href="/admin/activities" className="button">
          Cancel
        </Link>
        {!isNew && (
          <button onClick={handleDelete} className="button" style={{ marginLeft: "auto", color: "red" }}>
            Delete Activity
          </button>
        )}
      </section>
    </main>
  );
}
