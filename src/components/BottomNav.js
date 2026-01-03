"use client";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/tasks">Tasks</Link>
      <Link href="/activities">Activities</Link>
      <Link href="/progress">Progress</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
