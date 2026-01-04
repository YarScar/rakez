import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole, Roles } from "@/lib/rbac";

export default async function RubricPage() {
  // Check if user has LP_STAFF or ADMIN role
  const user = await requireRole([Roles.LP_STAFF, Roles.ADMIN]);
  
  if (!user) {
    redirect("/login?message=This page is restricted to LaunchPad staff only");
  }

  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>📊 Rubric Evidence</h1>
          <p className="subtitle" style={{ fontSize: "1rem", background: "var(--surface)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
            <strong>For LaunchPad Instructors:</strong> Clear documentation of CCC criteria (CCC.1.1, CCC.1.2, CCC.1.3) 
            with direct links to evidence locations in the project.
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
            👤 Logged in as: <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      </section>

      {/* Instructor Access */}
      <section className="section">
        <div className="card" style={{ padding: 32, background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", border: "none" }}>
          <h2 style={{ margin: 0, color: "white", marginBottom: 16 }}>👥 For LaunchPad Staff</h2>
          <div style={{ display: "grid", gap: 8, fontSize: "1.125rem" }}>
            <p style={{ margin: 0 }}>rob@launchpadphilly.org → <strong>lpuser1</strong></p>
            <p style={{ margin: 0 }}>sanaa@launchpadphilly.org → <strong>lpuser2</strong></p>
            <p style={{ margin: 0 }}>taheera@launchpadphilly.org → <strong>lpuser3</strong></p>
          </div>
        </div>
      </section>

      {/* CCC.1.1 Evidence */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--primary)" }}>
          <h2 style={{ color: "var(--primary)", marginBottom: 16 }}>CCC.1.1: Problem Understanding</h2>
          <p style={{ fontSize: "1.125rem", marginBottom: 24, lineHeight: 1.8 }}>
            <strong>Criteria:</strong> Demonstrate deep understanding of the problem through research, real-world examples, 
            constraint analysis, and evaluation of existing solutions.
          </p>

          <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>📍 Where to See This Evidence:</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>1️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/about" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    About Page (Primary Evidence)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Complete problem analysis with real-life scenarios, constraints, and existing solution evaluation
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>2️⃣</span>
                <div style={{ flex: 1 }}>
                  <a href="https://github.com/yourusername/rakez/blob/main/README.md#overview" target="_blank" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    README - Overview Section
                    <span>↗</span>
                  </a>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Technical problem statement and user research findings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--surface-elevated)", padding: 20, borderRadius: 12 }}>
            <h4 style={{ marginBottom: 12 }}>✅ Evidence Includes:</h4>
            <ul style={{ lineHeight: 2 }}>
              <li>Problem definition in my own words</li>
              <li>4 real-life scenarios showing how problem affects students</li>
              <li>Personal example from my experience last semester</li>
              <li>5 specific constraints (time, resources, skills, tech, adoption)</li>
              <li>Analysis of what happens if problem isn't solved</li>
              <li>Evaluation of Calm app (what worked vs. what didn't)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CCC.1.2 Evidence */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--accent)" }}>
          <h2 style={{ color: "var(--accent)", marginBottom: 16 }}>CCC.1.2: Solution Planning</h2>
          <p style={{ fontSize: "1.125rem", marginBottom: 24, lineHeight: 1.8 }}>
            <strong>Criteria:</strong> Present a clear solution plan with features, challenges, mitigation strategies, 
            and project timeline documentation.
          </p>

          <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>📍 Where to See This Evidence:</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>1️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/why" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    Why Rakez Page (Primary Evidence)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Complete solution explanation, 8 features, 5 challenges with solutions, sprint plan
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>2️⃣</span>
                <div style={{ flex: 1 }}>
                  <a href="https://github.com/yourusername/rakez/blob/main/README.md#phases--wireframe-flow" target="_blank" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    README - Wireframe Flow
                    <span>↗</span>
                  </a>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Detailed page-by-page wireframes and user flows
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>3️⃣</span>
                <div style={{ flex: 1 }}>
                  <a href="https://github.com/yourusername/rakez/blob/main/README.md#tech-stack" target="_blank" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    README - Tech Stack & Architecture
                    <span>↗</span>
                  </a>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Technical implementation plan and database schema
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--surface-elevated)", padding: 20, borderRadius: 12 }}>
            <h4 style={{ marginBottom: 12 }}>✅ Evidence Includes:</h4>
            <ul style={{ lineHeight: 2 }}>
              <li>Clear solution description (hand tracking for instant mental reset)</li>
              <li>8 specific features with purpose explanations</li>
              <li>5 major challenges identified with concrete mitigation plans</li>
              <li>4-sprint project timeline with task breakdowns</li>
              <li>Link to full GitHub README with technical documentation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CCC.1.3 Evidence */}
      <section className="section">
        <div className="card" style={{ padding: 32, border: "2px solid var(--primary)" }}>
          <h2 style={{ color: "var(--primary)", marginBottom: 16 }}>CCC.1.3: Working Product</h2>
          <p style={{ fontSize: "1.125rem", marginBottom: 24, lineHeight: 1.8 }}>
            <strong>Criteria:</strong> Demonstrate functional core features with user input/interaction and visible results/output.
          </p>

          <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16 }}>📍 Where to See This Evidence:</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>1️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/features" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    Features Page (Feature Overview)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Why choose this solution, how AI helps, competitive advantages
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>2️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/dashboard" className="button primary" style={{ width: "100%", justifyContent: "space-between" }}>
                    Product/Dashboard (LIVE APP)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    <strong>Core working product:</strong> Login, survey, dashboard, activities, progress tracking
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>3️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/activities/finger_music" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    Hand Activity Pages (Interactive Tools)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Webcam-based hand tracking with real-time feedback and scoring
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>4️⃣</span>
                <div style={{ flex: 1 }}>
                  <Link href="/admin" className="button" style={{ width: "100%", justifyContent: "space-between" }}>
                    Admin Dashboard (Advanced Feature)
                    <span>→</span>
                  </Link>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 8 }}>
                    Analytics, user management, activity editor, audit logs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--surface-elevated)", padding: 20, borderRadius: 12 }}>
            <h4 style={{ marginBottom: 12 }}>✅ Evidence Includes:</h4>
            <ul style={{ lineHeight: 2 }}>
              <li><strong>User Input:</strong> Signup form, survey, hand gestures via webcam</li>
              <li><strong>Output/Results:</strong> Dashboard stats, activity scores, progress charts, achievements</li>
              <li><strong>Working Features:</strong> Authentication, database storage, hand tracking, gamification</li>
              <li><strong>Why Buy This:</strong> Instant (30s), playful (not formal), no training needed</li>
              <li><strong>AI Integration:</strong> Personalized activity suggestions based on energy + preferences</li>
              <li><strong>Admin Tools:</strong> Full CRUD, analytics, logs for institutional use</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Links Summary */}
      <section className="section">
        <div className="card" style={{ padding: 32, background: "var(--surface-elevated)" }}>
          <h2 style={{ marginBottom: 20 }}>🔗 Quick Links for Instructors</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Link href="/about" className="button">CCC.1.1 Evidence</Link>
            <Link href="/why" className="button">CCC.1.2 Evidence</Link>
            <Link href="/features" className="button">CCC.1.3 Overview</Link>
            <Link href="/dashboard" className="button primary">Live Product</Link>
            <a href="https://github.com/yourusername/rakez" target="_blank" className="button">GitHub Repo</a>
            <Link href="/reflection" className="button">Reflection Page</Link>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: 40, textAlign: "center" }}>
        <Link href="/" className="button">Back to Home</Link>
      </footer>
    </main>
  );
}
