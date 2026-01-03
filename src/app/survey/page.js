"use client";
import { useState } from "react";

const steps = [
  { key: "careerStage", label: "Career stage", options: ["STUDENT", "EARLY_CAREER", "MID_CAREER", "SENIOR"] },
  { key: "energyLevel", label: "Energy level", options: ["LOW", "MEDIUM", "HIGH"] },
  { key: "biggestStruggle", label: "Biggest struggle" },
  { key: "tone", label: "Preferred tone", options: ["CALM", "ENERGETIC", "HUMOROUS", "SUPPORTIVE"] },
  { key: "movementComfort", label: "Movement comfort", options: ["LOW", "MEDIUM", "HIGH"] },
  { key: "confirm", label: "Confirm" },
];

export default function SurveyPage() {
  const [idx, setIdx] = useState(0);
  const [form, setForm] = useState({
    careerStage: "STUDENT",
    energyLevel: "MEDIUM",
    biggestStruggle: "",
    tone: "CALM",
    movementComfort: "MEDIUM",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const current = steps[idx];

  const next = () => setIdx((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  const submit = async () => {
    setError("");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSubmitted(true);
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 24 }}>
      <h2>Personalization Survey</h2>
      <div style={{ height: 6, background: "#eee", margin: "16px 0" }}>
        <div style={{ width: `${((idx + 1) / steps.length) * 100}%`, height: "100%", background: "#09f" }} />
      </div>
      <section>
        <h3>{current.label}</h3>
        {current.options ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setForm({ ...form, [current.key]: opt })}
                style={{
                  padding: "8px 12px",
                  border: form[current.key] === opt ? "2px solid #09f" : "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : current.key === "biggestStruggle" ? (
          <textarea
            value={form.biggestStruggle}
            onChange={(e) => setForm({ ...form, biggestStruggle: e.target.value })}
            rows={4}
            style={{ width: "100%" }}
          />
        ) : (
          <p>Review your choices and confirm.</p>
        )}
      </section>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={prev} disabled={idx === 0}>Back</button>
        {idx < steps.length - 1 ? (
          <button onClick={next}>Next</button>
        ) : (
          <button onClick={submit}>Save</button>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {submitted && <p>Saved! Redirecting…</p>}
    </main>
  );
}
