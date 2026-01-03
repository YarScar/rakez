"use client";
import Link from "next/link";
import BackButton from "@/components/BackButton";

const demoActivities = [
  { name: "Note Match Challenge", type: "NOTE_MATCH", description: "Match musical notes with hand gestures" },
  { name: "Finger Music", type: "FINGER_MUSIC", description: "Tap gestures to play sounds" },
  { name: "Calming Flow", type: "CALMING_FLOW", description: "Breathing + slow hand motions" },
  { name: "Energy Boost", type: "ENERGY_BOOST", description: "Fast gestures to build energy" },
  { name: "Pattern Game", type: "GAME", description: "Match hand patterns to visuals" },
  { name: "Expressive Play", type: "EXPRESSIVE_PLAY", description: "Draw trails with motion" },
];

export default function ActivitiesPage() {
  return (
    <main className="container stack">
      <BackButton href="/dashboard" label="Back to Dashboard" />
      <h2>Activities</h2>
      <div className="card-grid">
        {demoActivities.map((a, i) => (
          <div key={i} className="card">
            <div className="title">{a.type}</div>
            <div className="value" style={{ marginBottom: 8 }}>{a.name}</div>
            <p>{a.description}</p>
            <div className="actions" style={{ marginTop: 12 }}>
              <Link href={`/activities/${a.type.toLowerCase()}`}>Start</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
