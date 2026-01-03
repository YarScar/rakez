import Link from "next/link";

export default function FeaturesPage() {
  const activities = [
    {
      icon: "🎵",
      name: "Finger Music",
      description: "Tap rhythms and create melodies with gesture-based sound triggers. Perfect for creative expression.",
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
          <h1>Features</h1>
          <p className="subtitle">
            Everything you need to reset, refocus, and rebuild momentum through playful hand-based activities.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <h2>Hand-Based Activities</h2>
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

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <h2>🔐 Admin Role-Based Access</h2>
            <p style={{ marginTop: 16, maxWidth: 600, margin: "16px auto 0", color: "var(--muted)" }}>
              For educators, researchers, and organizations: Track user engagement, manage activities, 
              analyze performance metrics, and customize the experience for your users.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link className="button" href="/admin">View Admin Features</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>Why Choose Rakez?</h2>
          <div className="pill-row">
            <span className="pill">30-second activities</span>
            <span className="pill">AI-powered personalization</span>
            <span className="pill">No pressure approach</span>
            <span className="pill">Real-time feedback</span>
            <span className="pill">Progress tracking</span>
            <span className="pill">Fun rewards</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>Ready to Get Started?</h2>
          <p style={{ color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
            Join students and professionals who are using Rakez to manage stress, improve focus, and build healthier daily habits.
          </p>
          <div className="cta">
            <Link className="button primary" href="/signup">Create Account</Link>
            <Link className="button" href="/demo">Try Demo First</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
