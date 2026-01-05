"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ActivityCompletePage() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState(null);
  
  const activityName = searchParams.get("activity") || "Activity";
  const points = searchParams.get("points") || "50";
  const duration = searchParams.get("duration") || "30";

  useEffect(() => {
    // Confetti or celebration animation could go here
    const timer = setTimeout(() => {
      setStats({
        streak: 5,
        totalPoints: 450,
        achievement: "First Week Complete! 🎉"
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const funFacts = [
    "Your hands have more nerve endings than almost any other part of your body! 🖐️",
    "Hand gestures can actually change the way you think and solve problems. 🧠",
    "Moving your hands while stressed can activate calming neural pathways. 🌊",
    "Creative hand activities can boost dopamine production naturally. ⚡",
    "Regular hand exercises improve both mental and physical dexterity. 🎯"
  ];

  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    // Choose a random fact on the client only to avoid SSR hydration mismatches
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setRandomFact(fact);
  }, []);

  return (
    <main className="container" style={{ maxWidth: 700, padding: "40px 24px", textAlign: "center" }}>
      {/* Celebration Header */}
      <div style={{ 
        fontSize: "4rem", 
        marginBottom: 16,
        animation: "bounce 0.6s ease-in-out"
      }}>
        ✓
      </div>
      
      <h1 style={{ marginBottom: 12 }}>Activity Complete! 🎉</h1>
      <p style={{ color: "var(--muted)", fontSize: "1.125rem" }}>
        Great work on <strong>{activityName}</strong>!
      </p>

      {/* Stats Summary */}
      <section style={{ marginTop: 40 }}>
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="title">Points Earned</div>
            <div className="value" style={{ color: "var(--primary)", fontSize: "2rem" }}>+{points}</div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="title">Duration</div>
            <div className="value" style={{ color: "var(--accent)", fontSize: "2rem" }}>{duration}s</div>
          </div>
          {stats && (
            <div className="card" style={{ textAlign: "center" }}>
              <div className="title">Current Streak</div>
              <div className="value" style={{ color: "var(--primary)", fontSize: "2rem" }}>🔥 {stats.streak}</div>
            </div>
          )}
        </div>
      </section>

      {/* Achievement Unlock */}
      {stats?.achievement && (
        <section style={{ marginTop: 32 }}>
          <div className="card" style={{ 
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            color: "white",
            padding: 24,
            border: "none",
            boxShadow: "var(--glow-primary)"
          }}>
            <h3 style={{ margin: 0, color: "white" }}>🏆 Achievement Unlocked!</h3>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.9)" }}>{stats.achievement}</p>
          </div>
        </section>
      )}

      {/* Fun Fact / Reward */}
      <section style={{ marginTop: 32 }}>
        <div className="quote-card" style={{ textAlign: "left" }}>
          <h3 style={{ marginBottom: 12 }}>💡 Did You Know?</h3>
          <p>{randomFact}</p>
        </div>
      </section>

      

      {/* Progress Comparison */}
      {stats && (
        <section style={{ marginTop: 32 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Your Progress</h3>
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Total Points</span>
                  <span style={{ fontWeight: 600 }}>{stats.totalPoints}</span>
                </div>
                <div className="progress">
                  <div className="bar" style={{ width: `${(stats.totalPoints / 1000) * 100}%` }} />
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                {1000 - stats.totalPoints} points until next level!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Next Actions */}
      <section style={{ marginTop: 40 }}>
        <div className="actions" style={{ justifyContent: "center" }}>
          <Link className="button primary" href="/activities">
            Next Activity
          </Link>
          <Link className="button" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
}
