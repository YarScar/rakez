"use client";
import { useEffect, useState } from "react";

const toneOptions = ["CALM", "ENERGETIC", "HUMOROUS", "SUPPORTIVE"];
const energyOptions = ["LOW", "MEDIUM", "HIGH"];
const movementOptions = ["LOW", "MEDIUM", "HIGH"];
const careerOptions = ["STUDENT", "EARLY_CAREER", "MID_CAREER", "SENIOR"];

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pref, setPref] = useState({
    tone: "CALM",
    energyLevel: "MEDIUM",
    movementComfort: "MEDIUM",
    careerStage: "STUDENT",
    biggestStruggle: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Optionally fetch user profile to prefill
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (res.ok) {
          setName(json.user?.name || "");
        }
      } catch {}
    })();
  }, []);

  const savePrefs = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref),
      });
      if (!res.ok) throw new Error("Failed to save preferences");
      setStatus("Saved preferences");
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <main className="container stack" style={{ maxWidth: 800 }}>
      <h2>Settings</h2>
      <section className="card">
        <h3>Profile</h3>
        <div className="stack" style={{ marginTop: 12 }}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </section>
      <section className="card">
        <h3>Preferences</h3>
        <div className="stack" style={{ marginTop: 12 }}>
          <label>Career Stage</label>
          <select value={pref.careerStage} onChange={(e) => setPref({ ...pref, careerStage: e.target.value })}>
            {careerOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>

          <label>Energy Level</label>
          <select value={pref.energyLevel} onChange={(e) => setPref({ ...pref, energyLevel: e.target.value })}>
            {energyOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>

          <label>Preferred Tone</label>
          <select value={pref.tone} onChange={(e) => setPref({ ...pref, tone: e.target.value })}>
            {toneOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>

          <label>Movement Comfort</label>
          <select value={pref.movementComfort} onChange={(e) => setPref({ ...pref, movementComfort: e.target.value })}>
            {movementOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>

          <label>Biggest Struggle</label>
          <textarea rows={3} value={pref.biggestStruggle} onChange={(e) => setPref({ ...pref, biggestStruggle: e.target.value })} />
        </div>
        <div className="actions" style={{ marginTop: 12 }}>
          <button className="primary" onClick={savePrefs}>Save Preferences</button>
          <span>{status}</span>
        </div>
      </section>
    </main>
  );
}
