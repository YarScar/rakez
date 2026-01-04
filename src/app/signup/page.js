"use client";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // LP staff emails can use shorter passwords
  const isLPStaff = ['rob@launchpadphilly.org', 'sanaa@launchpadphilly.org', 'taheera@launchpadphilly.org']
    .includes(email.toLowerCase());
  const minPasswordLength = isLPStaff ? 1 : 8;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      window.location.href = "/survey";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "40px auto" }}>
      <h2>Create Account</h2>
      {error && (
        <div style={{ 
          padding: "12px 16px", 
          marginBottom: "20px", 
          background: "#fee", 
          border: "1px solid #fcc", 
          borderRadius: "8px", 
          color: "#c33" 
        }}>
          {error}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          minLength={2}
          required 
        />
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <label>Password {!isLPStaff && "(minimum 8 characters)"}</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          minLength={minPasswordLength}
          required 
        />
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}
