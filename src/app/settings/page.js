"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const toneOptions = ["CALM", "ENERGETIC", "HUMOROUS", "SUPPORTIVE"];
const energyOptions = ["LOW", "MEDIUM", "HIGH"];
const movementOptions = ["LOW", "MEDIUM", "HIGH"];
const careerOptions = ["STUDENT", "EARLY_CAREER", "MID_CAREER", "SENIOR"];

export default function SettingsPage() {
  const router = useRouter();
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
          setEmail(json.user?.email || "");
        }
      } catch {}
    })();
    // fetch existing preferences to prefill the form
    (async () => {
      try {
        const res = await fetch("/api/survey");
        if (!res.ok) return;
        const json = await res.json();
        if (json.preference) {
          const p = json.preference;
          setPref({
            tone: p.tone || "CALM",
            energyLevel: p.energyLevel || "MEDIUM",
            movementComfort: p.movementComfort || "MEDIUM",
            careerStage: p.careerStage || "STUDENT",
            biggestStruggle: p.biggestStruggle || "",
          });
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const savePrefs = async () => {
    setStatus("Saving...");
    try {
      // First, update profile (name/email)
      const profileRes = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const profileJson = await profileRes.json().catch(() => ({}));
      if (!profileRes.ok) {
        setStatus(profileJson.error || "Failed to save profile");
        return;
      }

      // Then save preferences
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(json.error || "Failed to save preferences");
        return;
      }
      setStatus("Saved preferences");
    } catch (e) {
      setStatus(e.message || "Save failed");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/demo");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setStatus("Logout failed");
    }
  };

  return (
    <main className="container stack" style={{ maxWidth: 800 }}>
      <BackButton href="/dashboard" label="Back to Dashboard" />
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
          <button className="primary" onClick={savePrefs} disabled={status === "Saving..."}>Save Preferences</button>
          <span>{status}</span>
        </div>
      </section>

      <section className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3>Account</h3>
        <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 16 }}>
          Sign out of your account
        </p>
        <button className="button logout-btn" onClick={handleLogout} style={{ width: 'fit-content' }}>
          Logout
        </button>
      </section>
    </main>
  );
}
