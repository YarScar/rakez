import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <h1>Rakez</h1>
      <p>Hand-based playful exercises to boost focus and creativity.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href="/signup">Get Started</Link>
        <Link href="/login">Log In</Link>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link href="/about">About</Link>
        <Link href="/why">Why Rakez</Link>
        <Link href="/features">Features</Link>
      </div>
      <footer style={{ marginTop: 40, display: "flex", gap: 12 }}>
        <span>© {new Date().getFullYear()} Rakez</span>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/contact">Contact</Link>
      </footer>
    </main>
  );
}
