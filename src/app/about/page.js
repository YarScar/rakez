import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>📋 About: The Problem</h1>
          <p className="subtitle" style={{ fontSize: "1rem", background: "var(--surface)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
            <strong>CCC.1.1 Evidence:</strong> This page demonstrates problem understanding through real-world scenarios, 
            constraints analysis, and existing solution evaluation.
          </p>
        </div>
      </section>

      {/* Problem Overview */}
      <section className="section">
        <div className="container stack">
          <h2>What is the Problem?</h2>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            Students and young professionals are <strong>mentally exhausted</strong> from constant academic pressure, 
            screen fatigue, and information overload. Traditional stress-relief methods require dedicated time and effort, 
            making them feel like another obligation rather than a solution. When you're stuck on a problem or feeling 
            overwhelmed, you need an <strong>instant mental reset</strong>—but meditation takes practice, exercise requires 
            motivation, and breaks feel unproductive.
          </p>
        </div>
      </section>

      {/* Real-Life Examples */}
      <section className="section">
        <div className="container">
          <h2>How This Shows Up in Real Life</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <h3>🎓 During Study Sessions</h3>
              <p>
                You've been studying for 2 hours and hit a mental wall. You can't focus anymore, but you feel 
                guilty taking a break because "you're not done yet." Traditional breaks feel wasteful, and you 
                end up scrolling social media for 20 minutes instead.
              </p>
            </div>
            <div className="card feature-card">
              <h3>💻 Between Zoom Classes</h3>
              <p>
                Back-to-back online classes leave you drained. You have 5 minutes between meetings, not enough 
                time for anything meaningful. You stare at your screen, already tired before the next class even starts.
              </p>
            </div>
            <div className="card feature-card">
              <h3>📱 Late Night Anxiety</h3>
              <p>
                It's 11 PM and you're stressed about tomorrow's deadlines. Your mind is racing, but you can't 
                bring yourself to "meditate properly." You just need something quick to calm down so you can sleep.
              </p>
            </div>
            <div className="card feature-card">
              <h3>⚡ Morning Procrastination</h3>
              <p>
                You know you need to start that assignment, but you feel stuck and overwhelmed. Instead of starting, 
                you waste time feeling anxious about not starting. The cycle continues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Example */}
      <section className="section">
        <div className="container">
          <div className="quote-card">
            <h3 style={{ marginBottom: 16 }}>💭 Personal Example</h3>
            <p className="quote" style={{ fontStyle: "normal" }}>
              Last semester, I had 3 major projects due in one week. I spent hours staring at my laptop, paralyzed 
              by stress and unable to start. My roommate suggested I "take a walk" or "do some yoga," but I didn't 
              have 30 minutes to spare—and honestly, formal wellness activities felt like <em>another thing to fail at</em>.
              <br/><br/>
              I needed something that took 30 seconds, not 30 minutes. Something playful that didn't require me to 
              "do it right." That's when I realized: <strong>stress relief shouldn't feel like work</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Why It's Difficult to Solve */}
      <section className="section">
        <div className="container stack">
          <h2>Why This Problem is Hard to Solve</h2>
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ marginBottom: 20 }}>⚙️ Constraints & Challenges</h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ padding: 16, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <strong>⏰ Time Constraint:</strong> Students don't have time for 20-minute meditation sessions or gym trips. 
                Solutions must work in under 60 seconds to fit into real schedules.
              </div>
              <div style={{ padding: 16, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <strong>💰 Resource Constraint:</strong> Can't require expensive equipment, gym memberships, or therapy sessions. 
                Must be accessible with just a laptop webcam.
              </div>
              <div style={{ padding: 16, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <strong>🧠 Skill Barrier:</strong> Traditional mindfulness requires practice and discipline. Most students 
                give up because they "can't meditate properly." Need something that works immediately without training.
              </div>
              <div style={{ padding: 16, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <strong>🔧 Technical Challenge:</strong> Hand tracking needs to be accurate, fast, and work with standard 
                webcams. Complex gesture recognition can be unreliable or require expensive hardware.
              </div>
              <div style={{ padding: 16, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <strong>🎯 Adoption Barrier:</strong> Students are skeptical of "wellness apps" that feel cheesy or 
                prescriptive. The solution must feel fun and optional, not like another requirement.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens If Not Solved */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 32, background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))", borderColor: "#ef4444" }}>
            <h2 style={{ marginBottom: 16, color: "#dc2626" }}>⚠️ What Happens If This Problem Isn't Solved?</h2>
            <ul style={{ lineHeight: 2, fontSize: "1.125rem" }}>
              <li><strong>Burnout becomes normalized:</strong> Students accept chronic stress as "just part of school"</li>
              <li><strong>Mental health declines:</strong> Anxiety and depression rates continue rising among young people</li>
              <li><strong>Productivity suffers:</strong> Constant overwhelm leads to procrastination and poor academic performance</li>
              <li><strong>Wellness tools fail:</strong> Students avoid mental health resources because they feel inaccessible or judgmental</li>
              <li><strong>The cycle repeats:</strong> Stress → guilt about not managing it → more stress → more avoidance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Existing Solutions Analysis */}
      <section className="section">
        <div className="container stack">
          <h2>One Existing Solution: Calm App</h2>
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h3 style={{ color: "var(--accent)", marginBottom: 12 }}>✅ What Worked</h3>
                <ul style={{ lineHeight: 2 }}>
                  <li>Beautiful, calming interface</li>
                  <li>Proven meditation techniques</li>
                  <li>Guided breathing exercises</li>
                  <li>Progress tracking and streaks</li>
                  <li>Large library of content</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#ef4444", marginBottom: 12 }}>❌ What Didn't Work</h3>
                <ul style={{ lineHeight: 2 }}>
                  <li>Requires 10-20 minute sessions</li>
                  <li>Needs quiet, private space</li>
                  <li>Feels formal and serious</li>
                  <li>$70/year subscription cost</li>
                  <li>Passive listening, not interactive</li>
                  <li>Doesn't engage the body/hands</li>
                </ul>
              </div>
            </div>
            <p style={{ marginTop: 24, padding: 20, background: "var(--surface-elevated)", borderRadius: 12, fontStyle: "italic" }}>
              <strong>The Gap:</strong> Calm is great for people who already have time and discipline for meditation. 
              But for overwhelmed students who need an <em>instant, interactive reset</em> between classes or study sessions, 
              it's too slow and too serious. That's where Rakez comes in.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ textAlign: "center" }}>
          <h2>So How Do We Solve This?</h2>
          <div className="cta">
            <Link className="button primary" href="/why">See Our Solution →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
