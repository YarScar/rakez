"use client";

/**
 * Reusable Timer Display Component
 */
export default function Timer({ timeLeft, isActive }) {
  if (!isActive) return null;

  const isLowTime = timeLeft <= 10;

  return (
    <div className={`
      inline-flex items-center gap-2 
      px-4 py-2 rounded-lg font-semibold
      ${isLowTime 
        ? 'bg-red-500/90 text-white animate-pulse' 
        : 'bg-black/70 text-white'
      }
    `}>
      <span className="text-xl">⏱️</span>
      <span className="text-lg">{timeLeft}s</span>
    </div>
  );
}
