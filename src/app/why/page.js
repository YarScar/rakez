import Link from "next/link";

export default function WhyPage() {
  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>💡 Why Rakez? Our Solution</h1>
          <p className="subtitle" style={{ fontSize: "1rem", background: "var(--surface)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
            <strong>CCC.1.2 Evidence:</strong> This page demonstrates solution planning through feature design, 
            challenge identification, and project roadmap documentation.
          </p>
        </div>
      </section>

      {/* Solution Idea */}
      <section className="section">
        <div className="container stack">
          <h2>Our Solution: Interactive Hand Activities</h2>
          <div className="card" style={{ padding: 32 }}>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.8, marginBottom: 20 }}>
              <strong>Rakez</strong> is a web-based app that uses <strong>hand tracking technology</strong> to deliver 
              30-second interactive activities that reset your mental state instantly. Instead of passive meditation 
              or time-consuming exercise, you engage your hands in playful movements that activate your brain's 
              sensorimotor cortex—creating an immediate mind-body connection that reduces stress and improves focus.
            </p>
            <div style={{ background: "var(--surface-elevated)", padding: 20, borderRadius: 12, marginTop: 16 }}>
              <strong>Why This Works:</strong> Your hands have more nerve endings than almost any other body part. 
              Moving them intentionally creates instant neural feedback, shifting you out of stress mode faster than 
              traditional methods—and it requires zero training or discipline.
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="section">
        <div className="container stack">
          <h2>🎯 What the App Will Do (Features)</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <div className="title">🎂 Birthday Cake Candles</div>
              <p><strong>Interactive:</strong> Pinch to grab and place candles on a cake. Quick, tactile, and rewarding.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Brief tactile interaction to reset attention</p>
            </div>

            <div className="card feature-card">
              <div className="title">🌊 Calming Flow</div>
              <p><strong>Guided:</strong> Slow breathing paired with gentle hand motions. Visual breathing animation to follow.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Reduces stress and heart rate</p>
            </div>

            <div className="card feature-card">
              <div className="title">⚡ Energy Boost</div>
              <p><strong>Gamified:</strong> Fast-paced gesture challenges. Speed meter and burst effects for instant dopamine.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Increases alertness and motivation</p>
            </div>

            <div className="card feature-card">
              <div className="title">🧩 Cognitive Games</div>
              <p><strong>Pattern-based:</strong> Match hand patterns to visual cues. Memory and focus training through gestures.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Sharpens concentration</p>
            </div>

            <div className="card feature-card">
              <div className="title">🎨 Expressive Play</div>
              <p><strong>Free-form:</strong> Draw abstract trails with hand motion. No rules, just creative movement.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Self-expression and flow state</p>
            </div>

            <div className="card feature-card">
              <div className="title">🤖 AI Personalization</div>
              <p><strong>Smart suggestions:</strong> Activities recommended based on your energy level, time of day, and preferences.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Right activity at right time</p>
            </div>

            <div className="card feature-card">
              <div className="title">📊 Progress Tracking</div>
              <p><strong>Visual feedback:</strong> Streaks, points, achievements. See your improvement over time without pressure.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Motivation without judgment</p>
            </div>

            <div className="card feature-card">
              <div className="title">⚙️ Admin Dashboard</div>
              <p><strong>For educators:</strong> Track student engagement, manage activities, view analytics for research.</p>
              <p style={{ fontSize: "0.875rem", marginTop: 8, color: "var(--muted)" }}><strong>Purpose:</strong> Institutional adoption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & How We'll Handle Them */}
      <section className="section">
        <div className="container stack">
          <h2>🚧 Challenges We Expect (And How We'll Handle Them)</h2>
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: "grid", gap: 24 }}>
              <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: 12 }}>Challenge 1: Hand Tracking Accuracy</h3>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>
                  <strong>Problem:</strong> Webcam-based hand tracking can be unreliable in poor lighting or with fast movements.
                </p>
                <p style={{ color: "var(--accent)" }}>
                  <strong>Solution:</strong> Use MediaPipe Hands (Google's proven library), add lighting instructions, 
                  design activities that work with basic gestures (open/close hand, pointing) rather than complex poses.
                </p>
              </div>

              <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: 12 }}>Challenge 2: User Adoption</h3>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>
                  <strong>Problem:</strong> Students might feel awkward waving hands at a webcam or think it's "too weird."
                </p>
                <p style={{ color: "var(--accent)" }}>
                  <strong>Solution:</strong> Frame activities as games, not therapy. Add humor and playful feedback. 
                  Make it optional and fun, not prescriptive. Show immediate benefits (score, points) so they feel rewarded.
                </p>
              </div>

              <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: 12 }}>Challenge 3: Privacy Concerns</h3>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>
                  <strong>Problem:</strong> Users might worry about webcam access and data recording.
                </p>
                <p style={{ color: "var(--accent)" }}>
                  <strong>Solution:</strong> Process all hand tracking locally (no video sent to servers). 
                  Clear privacy notice. Manual camera permissions. Only store activity stats, never images.
                </p>
              </div>

              <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: 12 }}>Challenge 4: Maintaining Engagement</h3>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>
                  <strong>Problem:</strong> Users might try it once then forget about it.
                </p>
                <p style={{ color: "var(--accent)" }}>
                  <strong>Solution:</strong> Add gamification (streaks, achievements), personalized AI recommendations, 
                  and progress visualization. Keep sessions under 60 seconds so there's no commitment barrier.
                </p>
              </div>

              <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: 12 }}>Challenge 5: Technical Complexity</h3>
                <p style={{ color: "var(--muted)", marginBottom: 8 }}>
                  <strong>Problem:</strong> Integrating hand tracking, database, auth, and admin features in limited time.
                </p>
                <p style={{ color: "var(--accent)" }}>
                  <strong>Solution:</strong> Use proven tech stack (Next.js, Prisma, Neon DB, MediaPipe). 
                  Build MVP with 2-3 activities first, then expand. Focus on core user flow before admin features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Plan Summary */}
      <section className="section">
        <div className="container stack">
          <h2>📅 Project Plan Summary</h2>
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ marginBottom: 20 }}>Development Sprints</h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, padding: 16, background: "var(--surface)", borderRadius: 12 }}>
                <div style={{ fontWeight: 700, color: "var(--primary)", minWidth: 100 }}>Sprint 1</div>
                <div>
                  <strong>Foundation (Week 1-2)</strong>
                  <ul style={{ marginTop: 8, lineHeight: 1.8, color: "var(--muted)" }}>
                    <li>Set up Next.js project, database, authentication</li>
                    <li>Build basic pages (Home, About, Why)</li>
                    <li>Create user signup/login flow</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, padding: 16, background: "var(--surface)", borderRadius: 12 }}>
                <div style={{ fontWeight: 700, color: "var(--primary)", minWidth: 100 }}>Sprint 2</div>
                <div>
                  <strong>Core Features (Week 3-4)</strong>
                  <ul style={{ marginTop: 8, lineHeight: 1.8, color: "var(--muted)" }}>
                    <li>Integrate MediaPipe hand tracking</li>
                    <li>Build 2-3 hand activities (Birthday Cake Candles, Calming Flow)</li>
                    <li>Implement activity completion and scoring</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, padding: 16, background: "var(--surface)", borderRadius: 12 }}>
                <div style={{ fontWeight: 700, color: "var(--primary)", minWidth: 100 }}>Sprint 3</div>
                <div>
                  <strong>Personalization & Tracking (Week 5-6)</strong>
                  <ul style={{ marginTop: 8, lineHeight: 1.8, color: "var(--muted)" }}>
                    <li>Add personalization survey and preferences</li>
                    <li>Build dashboard with stats and progress charts</li>
                    <li>Implement streaks and achievements system</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, padding: 16, background: "var(--surface)", borderRadius: 12 }}>
                <div style={{ fontWeight: 700, color: "var(--primary)", minWidth: 100 }}>Sprint 4</div>
                <div>
                  <strong>Admin & Polish (Week 7-8)</strong>
                  <ul style={{ marginTop: 8, lineHeight: 1.8, color: "var(--muted)" }}>
                    <li>Build admin dashboard for analytics</li>
                    <li>Add activity management and logs</li>
                    <li>Polish UI, fix bugs, add documentation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 20, background: "var(--surface-elevated)", borderRadius: 12 }}>
              <strong>📋 Full Project Plan:</strong> See detailed tasks, wireframes, and technical specs in the 
              <Link href="https://github.com/yourusername/rakez/blob/main/README.md" style={{ color: "var(--primary)", marginLeft: 8 }}>
                project README on GitHub →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>Ready to See It in Action?</h2>
          <div className="cta">
            <Link className="button primary" href="/features">Explore Features →</Link>
            <Link className="button" href="/dashboard">Try the App</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
