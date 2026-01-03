import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>The Challenge</h1>
          <p className="subtitle">
            Students and young professionals face unprecedented levels of stress, burnout, and screen fatigue. 
            The pressure to perform academically while managing personal wellness has never been greater.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <h2>Real-World Impact</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <h3>📊 70% of students</h3>
              <p>report feeling overwhelmed by academic pressure and daily responsibilities</p>
            </div>
            <div className="card feature-card">
              <h3>🧠 Screen fatigue</h3>
              <p>Spending 8+ hours daily on screens leads to mental exhaustion and decreased focus</p>
            </div>
            <div className="card feature-card">
              <h3>⏰ Limited time</h3>
              <p>Traditional wellness activities feel like another task on an already full schedule</p>
            </div>
            <div className="card feature-card">
              <h3>💭 Stress management</h3>
              <p>Current solutions often feel formal, clinical, or disconnected from daily life</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="quote-card">
            <p className="quote">
              <span className="mark">"</span>
              I love learning, but sometimes I feel so overwhelmed that I can't even start. 
              I need something quick to help me reset without feeling like I'm adding another responsibility.
            </p>
            <p style={{ marginTop: 16, color: "var(--muted)", textAlign: "right" }}>
              — University Student, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>There's a Better Way</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "var(--muted)" }}>
            What if stress relief was playful, not prescriptive? What if you could reset your mind in 30 seconds, 
            not 30 minutes? What if your hands could help your brain?
          </p>
          <div className="cta">
            <Link className="button primary" href="/why">See the Solution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
