"use client";
import Link from "next/link";
import BackButton from "@/components/BackButton";

const demoActivities = [
  { name: "Note Match Challenge", type: "note_match", description: "Match musical notes with hand gestures" },
  { name: "Birthday Cake Candles", type: "cake_candles", description: "Pinch to place candles on a cake" },
  { name: "Calming Flow", type: "calming_flow", description: "Breathing + slow hand motions" },
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
              <Link href={`/activities/${a.type}`}>Start</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
