import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="stack">
          <h1>🖐️ Rakez</h1>
          <p className="subtitle">
            A hand-based wellness app designed for <strong>overwhelmed students and young professionals</strong> who 
            need quick mental resets, while keeping you on task.
          </p>
          <div className="cta">
            <Link className="button primary" href="/demo">Try the App</Link>
            <Link className="button" href="/about">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Quick Pitch */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <h2>How Rakez Helps You</h2>
            <p style={{ maxWidth: 600, margin: "16px auto", color: "var(--muted)", fontSize: "1.125rem" }}>
              When you're stuck, stressed, or unfocused, Rakez uses <strong>interactive hand activities</strong> to 
              reset your brain in just 30 seconds. No meditation skills required. No long breaks needed. 
              Just playful movement that makes stress relief feel effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation to All Pages */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>Explore the Project</h2>
          <div className="feature-grid">
            <Link href="/about" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>📋</div>
              <h3>About</h3>
              <p>Understand the problem we're solving and why it matters</p>
            </Link>

            <Link href="/why" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>💡</div>
              <h3>Why Rakez?</h3>
              <p>Our solution plan, features, and challenges</p>
            </Link>

            <Link href="/features" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚡</div>
              <h3>Features</h3>
              <p>Working tools and why they're different</p>
            </Link>

            <Link href="/dashboard" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🎯</div>
              <h3>Product</h3>
              <p>Try the core app experience</p>
            </Link>

            <Link href="/rubric" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>📊</div>
              <h3>Rubric Evidence</h3>
              <p>CCC criteria and project evidence</p>
            </Link>

            <Link href="/reflection" className="card feature-card" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
              <h3>Reflection</h3>
              <p>What worked, what didn't, next steps</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section">
        <div className="container pill-row">
          <span className="pill">30-second activities</span>
          <span className="pill">Hand tracking tech</span>
          <span className="pill">No pressure approach</span>
          <span className="pill">Built for students</span>
        </div>
      </section>

      <footer style={{ marginTop: 60, textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
        <p>© {new Date().getFullYear()} Rakez · <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy</Link> · <Link href="/contact" style={{ color: "var(--primary)" }}>Contact</Link></p>
        <p style={{ marginTop: 8 }}>Built for LaunchPad Philly · CCC Project 2026</p>
      </footer>
    </main>
  );
}
