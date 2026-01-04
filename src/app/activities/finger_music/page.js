"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FingerMusicActivity() {
  const router = useRouter();
  useEffect(() => {
    router.push('/activities');
  }, [router]);
  return null;
}
