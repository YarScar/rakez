"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ProgressPage() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Activities",
            data: [2, 3, 1, 4, 2, 5, 3],
            borderColor: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0a84ff",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <main className="container stack">
      <h2>Progress</h2>
      <div className="card" style={{ height: 360 }}>
        <canvas ref={canvasRef} />
      </div>
    </main>
  );
}
