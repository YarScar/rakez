"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking for token in cookie
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/demo");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show header on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">🧘</span>
          <span className="logo-text">Rakez</span>
        </Link>

        <nav className="header-nav">
          <Link href="/about">About</Link>
          <Link href="/why">Why</Link>
          <Link href="/features">Features</Link>
          {user && <Link href="/dashboard">Dashboard</Link>}
        </nav>

        <div className="header-auth">
          {loading ? (
            <div className="auth-loading">...</div>
          ) : user ? (
            <div className="user-menu">
              <span className="user-name">{user.name || user.email}</span>
              <button onClick={handleLogout} className="button logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="button login-btn">
                Login
              </Link>
              <Link href="/signup" className="button primary signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
