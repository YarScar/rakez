import Link from "next/link";

export default function WhyPage() {
  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>Why Rakez?</h1>
          <p className="subtitle">
            Hand-based interactions activate your sensorimotor cortex, creating a direct mind-body connection 
            that reduces stress and improves focus—without requiring meditation or long breaks.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <h2>The Science Behind It</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <div className="title">🖐️ Sensorimotor Activation</div>
              <p>Hand movements engage large areas of your brain, helping you shift mental states quickly and naturally.</p>
            </div>
            <div className="card feature-card">
              <div className="title">⚡ Instant Reset</div>
              <p>30-second activities provide immediate relief without the time commitment of traditional wellness practices.</p>
            </div>
            <div className="card feature-card">
              <div className="title">🎮 Playful Engagement</div>
              <p>Gamification and rewards make stress relief feel fun, not like another task on your to-do list.</p>
            </div>
            <div className="card feature-card">
              <div className="title">🤖 AI Personalization</div>
              <p>Activities adapt to your preferences, energy levels, and goals—no one-size-fits-all approach.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>How It Works</h2>
          <div className="feature-grid">
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>1️⃣</div>
              <h3>Choose Activity</h3>
              <p style={{ marginTop: 8 }}>Select from personalized hand-based exercises matched to your current needs</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>2️⃣</div>
              <h3>Move Your Hands</h3>
              <p style={{ marginTop: 8 }}>Follow simple gestures tracked by your webcam—no special equipment needed</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>3️⃣</div>
              <h3>Get Instant Feedback</h3>
              <p style={{ marginTop: 8 }}>See real-time responses, earn points, and feel the mental shift immediately</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>4️⃣</div>
              <h3>Track Progress</h3>
              <p style={{ marginTop: 8 }}>Build streaks, unlock achievements, and watch your focus improve over time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="quote-card">
            <p className="quote">
              <span className="mark">"</span>
              We believe that small actions matter. When you're overwhelmed, stressed, or stuck, the solution 
              isn't to push harder—it's to reset gently. Hands help your brain. Movement, play, and creativity 
              aren't distractions from productivity—they're essential to it.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>Ready to Experience It?</h2>
          <div className="cta">
            <Link className="button primary" href="/features">Explore Features</Link>
            <Link className="button" href="/signup">Get Started</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
