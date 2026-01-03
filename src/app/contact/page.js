"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    // Simulate sending (in production, this would call an API)
    setTimeout(() => {
      setStatus("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <main className="container" style={{ maxWidth: 700, padding: "40px 24px" }}>
      <h1>Contact Us</h1>
      <p style={{ color: "var(--muted)", marginTop: 12 }}>
        Have questions, feedback, or need support? We'd love to hear from you!
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Subject</label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        >
          <option value="">Select a topic...</option>
          <option value="support">Technical Support</option>
          <option value="feedback">Feedback & Suggestions</option>
          <option value="privacy">Privacy & Data</option>
          <option value="admin">Admin Features</option>
          <option value="partnership">Partnership Inquiry</option>
          <option value="other">Other</option>
        </select>

        <label>Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={6}
          required
        />

        <button type="submit" className="button primary" style={{ marginTop: 12 }}>
          Send Message
        </button>

        {status && (
          <p style={{ marginTop: 16, color: status.includes("sent") ? "var(--accent)" : "var(--muted)" }}>
            {status}
          </p>
        )}
      </form>

      <section style={{ marginTop: 48, padding: 24, background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
        <h3>Other Ways to Reach Us</h3>
        <ul style={{ marginTop: 16, lineHeight: 2 }}>
          <li><strong>Email:</strong> support@rakez.app</li>
          <li><strong>Privacy inquiries:</strong> privacy@rakez.app</li>
          <li><strong>Admin support:</strong> admin@rakez.app</li>
        </ul>
      </section>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link className="button" href="/">Back to Home</Link>
      </div>
    </main>
  );
}
