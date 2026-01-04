"use client";

/**
 * Reusable Score Display Component
 */
export default function ScoreDisplay({ score, maxScore, label = "Score", icon = "🎯" }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/70 text-white font-semibold">
      <span className="text-xl">{icon}</span>
      <span className="text-lg">
        {score}{maxScore ? `/${maxScore}` : ''}
      </span>
    </div>
  );
}
