"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function FingerMusicActivity() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState("");

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

  const startActivity = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      setFeedback("🎵 Tap your fingers to create music!");
      
      // Simulate hand detection and scoring
      const scoreInterval = setInterval(() => {
        if (isActive) {
          setScore(s => s + Math.floor(Math.random() * 10));
          const messages = ["Great rhythm! 🎶", "Nice tap! ✨", "Keep going! 🌟", "Perfect! 🎯"];
          setFeedback(messages[Math.floor(Math.random() * messages.length)]);
        }
      }, 2000);

      return () => clearInterval(scoreInterval);
    } catch (err) {
      alert("Camera access denied. Please enable camera to use hand activities.");
    }
  };

  const handleComplete = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    router.push(`/activities/complete?activity=Finger Music&points=${score}&duration=30`);
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
      {/* Activity Header */}
      <section style={{ marginBottom: 24, textAlign: "center" }}>
        <h1>🎵 Finger Music</h1>
        <p style={{ color: "var(--muted)" }}>
          Tap your fingers to play sounds and create rhythmic patterns
        </p>
      </section>

      {/* Main Activity Area */}
      <section className="card" style={{ padding: 32, textAlign: "center" }}>
        {/* Webcam Feed */}
        <div style={{ 
          position: "relative",
          width: "100%",
          maxWidth: 640,
          height: 480,
          margin: "0 auto",
          background: "#000",
          borderRadius: 12,
          overflow: "hidden"
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
              transform: "scaleX(-1)" // Mirror effect
            }}
          />
          
          {/* Overlay Status */}
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
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🖐️</div>
                <p style={{ fontSize: "1.25rem" }}>Ready to start?</p>
              </div>
            </div>
          )}

          {/* Feedback Overlay */}
          {isActive && feedback && (
            <div style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 24px",
              background: "var(--primary)",
              color: "white",
              borderRadius: 999,
              fontWeight: 600,
              boxShadow: "var(--glow-primary)",
              animation: "fadeIn 0.3s ease"
            }}>
              {feedback}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-around",
          marginTop: 24,
          padding: "16px 24px",
          background: "var(--surface-elevated)",
          borderRadius: 12
        }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Score</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>{score}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Time Left</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>{timeLeft}s</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Hand Status</div>
            <div style={{ fontSize: "1.5rem" }}>{isActive ? "✅" : "⏸️"}</div>
          </div>
        </div>

        {/* Control Buttons */}
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
          <h3 style={{ marginBottom: 12 }}>How to Play</h3>
          <ul style={{ lineHeight: 2, color: "var(--muted)" }}>
            <li>Position your hand in front of the camera</li>
            <li>Tap your fingers together to trigger sounds</li>
            <li>Try different finger combinations for different notes</li>
            <li>Create rhythmic patterns to maximize your score</li>
          </ul>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </main>
  );
}
