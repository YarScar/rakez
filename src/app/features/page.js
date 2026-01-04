import Link from "next/link";

export default function FeaturesPage() {
  // CCC.1.3: Why would I buy your solution over others? How does AI help solve my problem?
  
  const activities = [
    {
      icon: "🎂",
      name: "Birthday Cake Candles",
      description: "Pinch to place candles on a cake — quick, playful, and rewarding hand interaction.",
      color: "--primary"
    },
    {
      icon: "🌊",
      name: "Calming Flow",
      description: "Slow, guided breathing paired with gentle hand movements to reduce stress and anxiety.",
      color: "--accent"
    },
    {
      icon: "⚡",
      name: "Energy Boost",
      description: "Fast-paced gestures and gamified challenges to increase alertness and motivation.",
      color: "--primary"
    },
    {
      icon: "🧩",
      name: "Cognitive Games",
      description: "Pattern matching and memory exercises using hand gestures to sharpen mental focus.",
      color: "--accent"
    },
    {
      icon: "🎨",
      name: "Expressive Play",
      description: "Free-form drawing and abstract visualization through hand motion trails.",
      color: "--primary"
    },
    {
      icon: "🤖",
      name: "AI Guidance",
      description: "Personalized activity suggestions based on your energy, preferences, and progress.",
      color: "--accent"
    },
    {
      icon: "📝",
      name: "Task Tracking",
      description: "Integrate micro-tasks with hand activities to build momentum and reduce procrastination.",
      color: "--primary"
    },
    {
      icon: "🏆",
      name: "Achievements",
      description: "Earn badges, maintain streaks, and celebrate progress with fun rewards and encouragement.",
      color: "--accent"
    }
  ];

  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>Features & Core Product (CCC.1.3)</h1>
          <p className="subtitle">
            Why choose Rakez over existing solutions? How AI solves the stress management problem differently.
          </p>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--accent)" }}>
          <h2 style={{ color: "var(--accent)", marginBottom: 20 }}>🏆 Why Buy Rakez Over Competitors?</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12, color: "var(--primary)" }}>vs. Calm / Headspace</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Their Approach:</strong> Guided meditation requiring 5-20 minutes of uninterrupted focus
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Rakez Advantage:</strong> 30-second activities requiring no audio, no privacy, no time commitment. 
                Works in busy classrooms, libraries, or crowded dorms. Hand activities activate sensorimotor cortex 
                for faster nervous system reset than passive listening.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12, color: "var(--primary)" }}>vs. Forest / Focus Apps</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Their Approach:</strong> Block distractions and gamify staying focused for long periods
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Rakez Advantage:</strong> When you're <em>already</em> too stressed to focus, blocking apps 
                doesn't help. Rakez gives you a quick nervous system reset <em>before</em> you try to focus. Think 
                of it as the warm-up before the workout.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12, color: "var(--primary)" }}>vs. Generic Fidget Tools</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Their Approach:</strong> Physical fidget spinners, stress balls, or desk toys
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Rakez Advantage:</strong> No physical object needed—works anywhere with just your hands and 
                a device. Plus, Rakez tracks progress and uses AI to suggest the most effective activity for your 
                current state. Fidgets don't adapt to you; Rakez does.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12, color: "var(--primary)" }}>vs. Therapist-Led Interventions</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Their Approach:</strong> Professional therapy sessions (expensive, requires scheduling)
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Rakez Advantage:</strong> Free, instant access 24/7. Not a replacement for therapy, but a 
                complementary tool for daily stress management. Therapists can recommend Rakez to clients between sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Helps */}
      <section className="section">
        <div className="card" style={{ padding: 32, background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", border: "none" }}>
          <h2 style={{ color: "white", marginBottom: 20 }}>🤖 How AI Actually Solves the Problem</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 12, color: "white" }}>1. Personalization That Learns</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Generic apps give everyone the same exercises. Rakez's AI analyzes your completion patterns, time-of-day 
                preferences, and what activities you actually finish. Over time, it recommends the 2-3 activities that 
                work best for <strong>you specifically</strong>.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 12, color: "white" }}>2. Adaptive Difficulty</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                If you're too stressed, complex activities fail. Rakez AI detects when you abandon exercises and 
                automatically suggests simpler gestures. When you're doing well, it introduces new challenges. You're 
                never bored, never frustrated.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 12, color: "white" }}>3. Context-Aware Suggestions</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Studying late at night? AI suggests calming activities. Morning before an exam? Energy-boosting activities. 
                Between Zoom classes? Quick cognitive resets. The AI considers your schedule and emotional state.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 12, color: "white" }}>4. Privacy-First AI</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Hand tracking happens entirely in your browser using MediaPipe (no video uploaded). AI recommendations 
                run on aggregated usage data, not invasive monitoring. You get smart personalization without surveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section">
        <div className="container stack">
          <h2>🎯 Core Product Features</h2>
          <div className="feature-grid">
            {activities.map((activity, i) => (
              <div key={i} className="card feature-card">
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{activity.icon}</div>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Summary */}
      <section className="section">
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>💡 The Rakez Difference</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚡</div>
              <h3 style={{ marginBottom: 8 }}>Instant Relief</h3>
              <p style={{ color: "var(--muted)" }}>30 seconds to reset—not 20 minutes</p>
            </div>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🧠</div>
              <h3 style={{ marginBottom: 8 }}>Science-Backed</h3>
              <p style={{ color: "var(--muted)" }}>Activates sensorimotor cortex for real physiological change</p>
            </div>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🎯</div>
              <h3 style={{ marginBottom: 8 }}>AI-Personalized</h3>
              <p style={{ color: "var(--muted)" }}>Learns what works for you specifically</p>
            </div>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔓</div>
              <h3 style={{ marginBottom: 8 }}>Zero Barriers</h3>
              <p style={{ color: "var(--muted)" }}>No audio, no privacy needed, no equipment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <h2>🔐 For Institutions & Researchers</h2>
            <p style={{ marginTop: 16, maxWidth: 700, margin: "16px auto 0", color: "var(--muted)" }}>
              Rakez isn't just for individual students. Schools, universities, and mental health researchers 
              can deploy Rakez with full admin dashboards for user management, activity analytics, and outcome tracking.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link className="button" href="/admin">Explore Admin Features</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>Ready to Try the Smarter Way to Reset?</h2>
          <p style={{ color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
            Join students using AI-powered hand activities to manage stress in seconds, not minutes.
          </p>
          <div className="cta">
            <Link className="button primary" href="/dashboard">Try the Product</Link>
            <Link className="button" href="/rubric">View Evidence</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
