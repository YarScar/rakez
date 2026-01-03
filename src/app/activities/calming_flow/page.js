"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function CalmingFlowActivity() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale"); // inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const breathCycle = setInterval(() => {
        setBreathPhase(phase => {
          if (phase === "inhale") return "hold";
          if (phase === "hold") return "exhale";
          return "inhale";
        });
        setScore(s => s + 5);
      }, 4000);
      return () => clearInterval(breathCycle);
    }
  }, [isActive]);

  const startActivity = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err) {
      alert("Camera access denied. Please enable camera to use hand activities.");
    }
  };

  const handleComplete = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    router.push(`/activities/complete?activity=Calming Flow&points=${score}&duration=60`);
  };

  const handlePause = () => {
    setIsActive(false);
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <main className="container" style={{ maxWidth: 900 }}>
      <BackButton href="/activities" label="Back to Activities" />
      <section style={{ marginBottom: 24, textAlign: "center" }}>
        <h1>🌊 Calming Flow</h1>
        <p style={{ color: "var(--muted)" }}>
          Slow breathing paired with gentle hand movements to reduce stress
        </p>
      </section>

      <section className="card" style={{ padding: 32, textAlign: "center" }}>
        {/* Breathing Animation Circle */}
        <div style={{ 
          width: 200,
          height: 200,
          margin: "0 auto 32px",
          borderRadius: "50%",
          background: breathPhase === "inhale" ? "linear-gradient(135deg, var(--primary), var(--accent))" :
                      breathPhase === "exhale" ? "linear-gradient(135deg, var(--accent), var(--primary))" :
                      "var(--muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: 700,
          transition: "all 4s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: breathPhase === "inhale" ? "scale(1.2)" : 
                     breathPhase === "exhale" ? "scale(0.8)" : "scale(1)",
          boxShadow: isActive ? "0 0 40px currentColor" : "none"
        }}>
          {breathPhase === "inhale" ? "Breathe In" :
           breathPhase === "hold" ? "Hold" :
           "Breathe Out"}
        </div>

        {/* Webcam Feed */}
        <div style={{ 
          width: "100%",
          maxWidth: 480,
          height: 360,
          margin: "0 auto",
          background: "#000",
          borderRadius: 12,
          overflow: "hidden",
          position: "relative"
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ 
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)"
            }}
          />
          
          {!isActive && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              color: "white"
            }}>
              <div>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🧘</div>
                <p>Ready to relax?</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-around",
          marginTop: 24,
          padding: "16px 24px",
          background: "var(--surface-elevated)",
          borderRadius: 12
        }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Calm Points</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>{score}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Time Left</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>{timeLeft}s</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Breathing</div>
            <div style={{ fontSize: "1.5rem" }}>{isActive ? "🌬️" : "⏸️"}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="actions" style={{ marginTop: 24, justifyContent: "center" }}>
          {!isActive ? (
            <button onClick={startActivity} className="button primary">
              Start Activity
            </button>
          ) : (
            <>
              <button onClick={handlePause} className="button">
                Pause
              </button>
              <button onClick={handleComplete} className="button primary">
                Complete Now
              </button>
            </>
          )}
          <button onClick={() => router.push("/activities")} className="button">
            Exit
          </button>
        </div>

        {/* Instructions */}
        <div style={{ 
          marginTop: 32,
          padding: 20,
          background: "var(--surface)",
          borderRadius: 12,
          textAlign: "left"
        }}>
          <h3 style={{ marginBottom: 12 }}>How It Works</h3>
          <ul style={{ lineHeight: 2, color: "var(--muted)" }}>
            <li>Follow the breathing circle: expand on inhale, contract on exhale</li>
            <li>Move your hands slowly in sync with your breathing</li>
            <li>Open palms wide when breathing in</li>
            <li>Gently close hands when breathing out</li>
            <li>Stay relaxed and maintain slow, steady movements</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
