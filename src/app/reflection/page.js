import Link from "next/link";

export default function ReflectionPage() {
  return (
    <main className="container" style={{ maxWidth: 900 }}>
      <section className="hero">
        <div className="stack">
          <h1>🔍 Project Reflection</h1>
          <p className="subtitle">
            Looking back at the development process: successes, challenges, pivots, and future vision
          </p>
        </div>
      </section>

      {/* What Went Well */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--accent)" }}>
          <h2 style={{ color: "var(--accent)", marginBottom: 20 }}>✅ What Went Well</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>1. Tech Stack Selection</h3>
              <p style={{ lineHeight: 1.8 }}>
                Choosing <strong>Next.js, Prisma, and Neon PostgreSQL</strong> was the right call. The combination provided:
              </p>
              <ul style={{ marginTop: 8, lineHeight: 1.8, color: "var(--muted)" }}>
                <li>Fast development with built-in routing and API routes</li>
                <li>Type-safe database queries with Prisma ORM</li>
                <li>Free, serverless PostgreSQL with Neon (no setup hassle)</li>
                <li>Easy deployment to Vercel</li>
              </ul>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>2. User Flow Design</h3>
              <p style={{ lineHeight: 1.8 }}>
                The <strong>signup → survey → dashboard → activity → completion</strong> flow worked smoothly. 
                Users understand the app immediately without confusion. The personalization survey gives users 
                control while collecting data for AI recommendations.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>3. Database Schema Planning</h3>
              <p style={{ lineHeight: 1.8 }}>
                Taking time upfront to design the Prisma schema saved hours later. Having clear relationships 
                between User → Preference → ActivitySession → Task made adding features easier. The admin 
                queries worked on first try because the data structure was solid.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>4. MVP-First Approach</h3>
              <p style={{ lineHeight: 1.8 }}>
                Focusing on core features first (auth, survey, dashboard, one activity) before expanding prevented 
                scope creep. This approach let me test the concept early and iterate based on what actually worked.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>5. Admin Dashboard Value</h3>
              <p style={{ lineHeight: 1.8 }}>
                Building role-based admin access proved valuable for demonstrating real-world viability. Educators 
                and researchers need analytics—this makes Rakez institutional-ready, not just a personal tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Didn't Go Well */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid #ef4444" }}>
          <h2 style={{ color: "#dc2626", marginBottom: 20 }}>❌ What Didn't Go Well</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>1. MediaPipe Integration Complexity</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Problem:</strong> Getting MediaPipe Hands to work reliably in the browser took longer than expected. 
                Lighting conditions, hand positioning, and gesture recognition accuracy were inconsistent.
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--muted)" }}>
                <strong>Lesson:</strong> Should have built a simpler gesture prototype first (just detecting hand open/close) 
                before attempting complex finger tracking. Also underestimated how much calibration users would need.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>2. Time Management on UI Polish</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Problem:</strong> Spent too much time perfecting CSS animations and visual effects early on. 
                This delayed core functionality implementation.
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--muted)" }}>
                <strong>Lesson:</strong> Should have used basic styled components initially and polished later. 
                "Make it work, then make it pretty" would have been smarter.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>3. AI Recommendations Not Fully Implemented</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Problem:</strong> While the survey collects personalization data, the AI suggestion engine 
                is more rule-based than truly intelligent. It doesn't learn from user behavior over time.
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--muted)" }}>
                <strong>Lesson:</strong> Needed more research on simple ML models (like recommendation systems) 
                that could run efficiently. Current version is a placeholder for future AI integration.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>4. Testing on Different Devices</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 12 }}>
                <strong>Problem:</strong> Developed primarily on desktop. Mobile testing revealed webcam access 
                and gesture recognition work poorly on phones due to camera positioning and processing power.
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--muted)" }}>
                <strong>Lesson:</strong> Should have tested cross-device much earlier. Would have pivoted to 
                desktop-first design or built mobile-specific activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Changed & Why */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--primary)" }}>
          <h2 style={{ color: "var(--primary)", marginBottom: 20 }}>🔄 What Changed During Development</h2>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>Change 1: Simplified Hand Gestures</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Original Plan:</strong> Complex finger patterns for each activity (pinch, spread, finger counting, etc.)
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Changed To:</strong> Basic gestures (hand open/close, pointing, simple taps)
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Why:</strong> Complex gestures were unreliable and frustrated users. Simple gestures still 
                activate the brain's sensorimotor cortex while being accessible to everyone.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>Change 2: Activity Duration</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Original Plan:</strong> 2-minute activities
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Changed To:</strong> 30-60 second activities with option to extend
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Why:</strong> User testing showed people abandon activities over 60 seconds. Making them 
                ultra-short removes commitment anxiety and makes the app feel "quick and easy."
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>Change 3: Removed Social Features</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Original Plan:</strong> Share progress with friends, compete on leaderboards
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Changed To:</strong> Private, individual experience only
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Why:</strong> Stress relief should feel pressure-free. Social comparison would undermine 
                the "no judgment" philosophy. Also reduces privacy concerns and development complexity.
              </p>
            </div>

            <div style={{ padding: 20, background: "var(--surface)", borderRadius: 12 }}>
              <h3 style={{ marginBottom: 12 }}>Change 4: Added Admin Dashboard</h3>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Original Plan:</strong> Student-only app
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 8 }}>
                <strong>Changed To:</strong> Full admin panel with analytics and management tools
              </p>
              <p style={{ lineHeight: 1.8, color: "var(--accent)" }}>
                <strong>Why:</strong> Realized that schools/universities would need oversight tools to adopt this 
                at scale. Admin features make Rakez viable for institutional partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="section">
        <div className="card" style={{ padding: 32, background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", border: "none" }}>
          <h2 style={{ margin: 0, color: "white", marginBottom: 20 }}>🚀 What I'd Build Next (If I Had More Time)</h2>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>1. True AI Learning Engine</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Implement TensorFlow.js to analyze activity completion patterns, time of day preferences, and 
                effectiveness metrics. Dynamically suggest activities based on what actually helps each user most.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>2. More Activity Types</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Add 5-10 more activities: Breathing games, hand shadow puppets, rhythm challenges, mindful tracing, 
                gesture storytelling. Give users more variety and replayability.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>3. Mobile App Version</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Build React Native app optimized for phone cameras. Add voice-guided activities for eyes-free use. 
                Make it work offline with local hand tracking.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>4. Integration with Study Apps</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Partner with Notion, Google Calendar, or Pomodoro apps. Automatically suggest Rakez breaks 
                between study sessions. "You've been studying for 90 minutes—take a 30-second hand activity."
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>5. Research Partnership</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Work with university psychology/neuroscience departments to measure actual stress reduction. 
                Publish findings to validate the approach and attract institutional funding.
              </p>
            </div>

            <div style={{ padding: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }}>
              <h3 style={{ marginBottom: 8, color: "white" }}>6. Accessibility Features</h3>
              <p style={{ lineHeight: 1.8, opacity: 0.95 }}>
                Add voice commands, screen reader support, and alternative input methods for users with motor 
                limitations. Make wellness truly accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Thoughts */}
      <section className="section">
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 16 }}>💭 Final Reflection</h2>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.8, marginBottom: 16 }}>
            This project taught me that <strong>building a solution is as much about understanding constraints as it 
            is about creativity</strong>. I had to constantly balance what I <em>wanted</em> to build with what was 
            <em>actually feasible</em> in the time available with my current skills.
          </p>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.8, marginBottom: 16 }}>
            The biggest lesson: <strong>users don't care about complex features—they care about whether it solves 
            their problem quickly and easily</strong>. Simplifying the gestures and shortening activity duration made 
            Rakez more effective, not less.
          </p>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            I'm proud of what I built, excited about what I learned, and motivated to keep improving it. This is 
            just the beginning for Rakez.
          </p>
        </div>
      </section>

      <footer style={{ marginTop: 40, textAlign: "center" }}>
        <div className="actions" style={{ justifyContent: "center" }}>
          <Link href="/rubric" className="button">View Rubric Evidence</Link>
          <Link href="/" className="button primary">Back to Home</Link>
        </div>
      </footer>
    </main>
  );
}
