import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="container" style={{ maxWidth: 800, padding: "40px 24px" }}>
      <h1>Privacy Policy</h1>
      <p style={{ color: "var(--muted)", marginTop: 12 }}>Last updated: January 2, 2026</p>

      <section style={{ marginTop: 40 }}>
        <h2>1. Information We Collect</h2>
        <p style={{ marginTop: 12 }}>
          Rakez collects information you provide when you create an account, complete the personalization survey, 
          and use hand-based activities:
        </p>
        <ul style={{ marginTop: 12, marginLeft: 24, lineHeight: 1.8 }}>
          <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
          <li><strong>Preferences:</strong> Career stage, energy level, tone preference, movement comfort</li>
          <li><strong>Activity Data:</strong> Session duration, points earned, activity types completed</li>
          <li><strong>Usage Analytics:</strong> Feature usage, navigation patterns, performance metrics</li>
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>2. Hand Tracking & Webcam</h2>
        <p style={{ marginTop: 12 }}>
          Rakez uses your device's webcam for hand gesture tracking via MediaPipe technology. 
          <strong> All hand tracking processing happens locally on your device.</strong> We do not record, 
          store, or transmit webcam video or images to our servers.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>3. How We Use Your Information</h2>
        <ul style={{ marginTop: 12, marginLeft: 24, lineHeight: 1.8 }}>
          <li>Personalize activity recommendations based on your preferences and progress</li>
          <li>Track your streaks, achievements, and performance over time</li>
          <li>Improve app features and user experience through anonymized analytics</li>
          <li>Send optional notifications and reminders (if enabled)</li>
          <li>Provide admin users with aggregated engagement metrics</li>
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>4. Data Storage & Security</h2>
        <p style={{ marginTop: 12 }}>
          Your data is stored securely in Neon PostgreSQL with encryption at rest. Passwords are hashed using 
          industry-standard bcrypt algorithms. We implement security best practices to protect your information 
          from unauthorized access.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>5. Data Sharing</h2>
        <p style={{ marginTop: 12 }}>
          We do not sell, rent, or share your personal information with third parties. Admin users in your 
          organization may access aggregated analytics and activity logs for educational or research purposes.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>6. Your Rights</h2>
        <p style={{ marginTop: 12 }}>You have the right to:</p>
        <ul style={{ marginTop: 12, marginLeft: 24, lineHeight: 1.8 }}>
          <li>Access and download your personal data</li>
          <li>Update or correct your account information</li>
          <li>Delete your account and all associated data</li>
          <li>Opt out of optional notifications and communications</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          To exercise these rights, visit your <Link href="/settings" style={{ color: "var(--primary)" }}>Settings</Link> page 
          or contact us at privacy@rakez.app.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>7. Cookies & Local Storage</h2>
        <p style={{ marginTop: 12 }}>
          We use essential cookies for authentication and local storage for user preferences. No third-party 
          tracking or advertising cookies are used.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>8. Children's Privacy</h2>
        <p style={{ marginTop: 12 }}>
          Rakez is intended for users aged 13 and above. We do not knowingly collect information from children 
          under 13. If you believe a child has provided us with their information, please contact us immediately.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>9. Changes to This Policy</h2>
        <p style={{ marginTop: 12 }}>
          We may update this Privacy Policy periodically. We'll notify users of significant changes via email 
          or in-app notification.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>10. Contact Us</h2>
        <p style={{ marginTop: 12 }}>
          If you have questions about this Privacy Policy or how we handle your data, please contact us:
        </p>
        <ul style={{ marginTop: 12, marginLeft: 24, lineHeight: 1.8 }}>
          <li>Email: privacy@rakez.app</li>
          <li>Contact form: <Link href="/contact" style={{ color: "var(--primary)" }}>rakez.app/contact</Link></li>
        </ul>
      </section>

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <Link className="button" href="/">Back to Home</Link>
      </div>
    </main>
  );
}
