"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackButton({ href, label = "Back" }) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href} className="back-button">
        <span className="back-icon">←</span>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={() => router.back()} className="back-button">
      <span className="back-icon">←</span>
      {label}
    </button>
  );
}
