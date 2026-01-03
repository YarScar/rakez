"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function NoteMatchActivity() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState("");
  const [targetNote, setTargetNote] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showCatMemePrompt, setShowCatMemePrompt] = useState(false);
  const [showCatMemeModal, setShowCatMemeModal] = useState(false);
  const [currentCatMeme, setCurrentCatMeme] = useState(null);
  const [usedCatMemes, setUsedCatMemes] = useState([]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const audioContextRef = useRef(null);
  const lastNoteTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const hasMatchedCurrentTargetRef = useRef(false);
  const targetNoteRef = useRef(null);
  const scoreRef = useRef(0);

  // Encouraging messages for notifications
  const encouragingMessages = [
    "Amazing Work!",
    "You're Crushing It!",
    "Fantastic Job!",
    "Keep It Up!",
    "You're On Fire!",
    "Incredible!",
    "Outstanding!",
    "Brilliant!",
    "Excellent Work!",
    "You're A Star!",
    "Way To Go!",
    "Superb!",
    "Phenomenal!",
    "You Rock!",
    "Killing It!"
  ];

  const getRandomEncouragement = () => {
    return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
  };

  const getRandomCatMeme = () => {
    // Randomly select from the available cat memes
    const allCatMemes = ['image.png', 'image-1.png', 'image-2.png'];
    
    // Filter out already used memes
    let availableMemes = allCatMemes.filter(meme => !usedCatMemes.includes(meme));
    
    // If all memes have been shown, reset the used list
    if (availableMemes.length === 0) {
      setUsedCatMemes([]);
      availableMemes = [...allCatMemes];
    }
    
    // Select random meme from available ones
    const randomIndex = Math.floor(Math.random() * availableMemes.length);
    const selectedMeme = availableMemes[randomIndex];
    
    // Mark this meme as used
    setUsedCatMemes(prev => [...prev, selectedMeme]);
    
    return `/cat-memes/${selectedMeme}`;
  };

  // Musical notes frequencies (C major scale)
  const notes = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.00,
    A: 440.00,
    B: 493.88,
    C2: 523.25
  };

  const generateTargetNote = () => {
    const noteNames = Object.keys(notes);
    let randomNote;
    do {
      randomNote = noteNames[Math.floor(Math.random() * noteNames.length)];
    } while (randomNote === targetNoteRef.current && noteNames.length > 1);
    targetNoteRef.current = randomNote;
    setTargetNote(randomNote);
    hasMatchedCurrentTargetRef.current = false;
  };

  const playNote = (frequency, noteName) => {
    const now = Date.now();
    if (now - lastNoteTimeRef.current < 200) return;
    
    lastNoteTimeRef.current = now;
    
    try {
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
      
      setCurrentNote(noteName);
      setFeedback(`♪ ${noteName} note!`);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const onHandResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8];
      
      // Draw connections
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 3;
      const connections = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [5,9],[9,13],[13,17],[0,17],
        [9,10],[10,11],[11,12],
        [13,14],[14,15],[15,16],
        [17,18],[18,19],[19,20]
      ];
      
      connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
        ctx.stroke();
      });
      
      // Draw landmarks
      ctx.fillStyle = '#00FF00';
      landmarks.forEach((landmark, index) => {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, index === 8 ? 10 : 6, 0, 2 * Math.PI);
        ctx.fill();
        
        if (index === 8) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Determine zone and note
      const x = 1 - indexTip.x;
      const noteNames = Object.keys(notes);
      const zoneWidth = 1 / noteNames.length;
      const zoneIndex = Math.min(Math.floor(x / zoneWidth), noteNames.length - 1);
      const noteName = noteNames[zoneIndex];
      
      // Draw position line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(indexTip.x * canvas.width, 0);
      ctx.lineTo(indexTip.x * canvas.width, canvas.height);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      const currentTarget = targetNoteRef.current;
      
      if (noteName && isProcessingRef.current) {
        playNote(notes[noteName], noteName);
        
        if (noteName === currentTarget && !hasMatchedCurrentTargetRef.current && currentTarget !== null) {
          hasMatchedCurrentTargetRef.current = true;
          const matchedNote = currentTarget;
          
          setScore(prev => {
            const newScore = prev + 1;
            scoreRef.current = newScore;
            return newScore;
          });
          setShowMatch(true);
          
          setTimeout(() => {
            const noteNames = Object.keys(notes);
            let randomNote;
            do {
              randomNote = noteNames[Math.floor(Math.random() * noteNames.length)];
            } while (randomNote === matchedNote && noteNames.length > 1);
            
            targetNoteRef.current = randomNote;
            setTargetNote(randomNote);
            setShowMatch(false);
            hasMatchedCurrentTargetRef.current = false;
          }, 400);
        }
      }
    }
  };

  const startActivity = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      await audioContextRef.current.resume();
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const { Hands } = await import("@mediapipe/hands");
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      hands.onResults(onHandResults);
      handsRef.current = hands;
      isProcessingRef.current = true;
      
      const processFrame = async () => {
        if (isProcessingRef.current && videoRef.current && videoRef.current.readyState === 4 && handsRef.current) {
          try {
            await handsRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error("Frame processing error:", err);
          }
          animationFrameRef.current = requestAnimationFrame(processFrame);
        }
      };
      
      setIsActive(true);
      setScore(0);
      scoreRef.current = 0;
      setTimeLeft(30);
      setFeedback("🎵 Match the notes!");
      
      const noteNames = Object.keys(notes);
      const firstNote = noteNames[Math.floor(Math.random() * noteNames.length)];
      targetNoteRef.current = firstNote;
      setTargetNote(firstNote);
      hasMatchedCurrentTargetRef.current = false;
      
      const startProcessing = () => {
        if (videoRef.current?.readyState === 4) {
          processFrame();
        } else {
          setTimeout(startProcessing, 100);
        }
      };
      setTimeout(startProcessing, 500);
    } catch (err) {
      alert("Camera access denied. Please enable camera to use hand activities.");
    }
  };

  const stopActivity = () => {
    isProcessingRef.current = false;
    setIsActive(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setTimeout(() => {
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch (err) {
          console.error("Error closing hands:", err);
        }
        handsRef.current = null;
      }
    }, 100);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleComplete = async () => {
    console.log('[Note Match] handleComplete called, finalScore:', scoreRef.current);
    stopActivity();
    
    const finalScore = scoreRef.current;
    console.log('[Note Match] Stopped activity, final score:', finalScore);
    
    // Show notification immediately
    setNotificationTitle(getRandomEncouragement());
    if (finalScore > 0) {
      setNotificationMessage(`+${finalScore} points earned`);
    } else {
      setNotificationMessage("No points earned this time");
    }
    setShowNotification(true);
    
    // Show cat meme prompt after points notification if they earned points
    if (finalScore > 0) {
      setTimeout(() => {
        setCurrentCatMeme(getRandomCatMeme());
        setShowCatMemePrompt(true);
      }, 2500);
    }
    
    console.log('[Note Match] Sending activity data to API:', { type: 'NOTE_MATCH', points: finalScore, duration: 30 });
    
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          type: "NOTE_MATCH",
          points: finalScore,
          duration: 30
        })
      }).catch(fetchErr => {
        console.error('[Note Match] Fetch failed:', fetchErr);
        throw fetchErr;
      });
      
      console.log('[Note Match] API response status:', res.status);
      const responseText = await res.text();
      console.log('[Note Match] API raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[Note Match] JSON parse error:', parseErr);
        data = { error: responseText };
      }
      console.log('[Note Match] API response data:', data);
      
      if (res.ok) {
        console.log('[Note Match] Activity saved successfully, redirecting to progress...');
        // Wait 2 seconds to show notification, then redirect
        setTimeout(() => {
          router.push("/progress");
        }, 2000);
      } else {
        console.error('[Note Match] API error:', data);
      }
    } catch (err) {
      console.error("[Note Match] Error saving activity:", err);
      console.error("[Note Match] Error details:", err.message, err.stack);
      // Still redirect after showing notification
      setTimeout(() => {
        router.push("/activities");
      }, 2000);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    return () => {
      stopActivity();
    };
  }, []);

  return (
    <main className="container stack">
      <BackButton href="/activities" label="Back to Activities" />
      <h2>Note Match Challenge</h2>
      <p style={{ marginBottom: 24 }}>
        Match musical notes by moving your hand! Each correct match earns 1 point.
      </p>

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
        aspectRatio: "4/3",
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
            transform: "scaleX(-1)",
            position: "absolute",
            top: 0,
            left: 0
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "scaleX(-1)"
          }}
        />

        {isActive && (
          <>
            {/* Note zones */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              display: "flex",
              zIndex: 1
            }}>
              {Object.keys(notes).map((note, i) => (
                <div
                  key={note}
                  style={{
                    flex: 1,
                    background: `hsl(${(i * 45) % 360}, 70%, 50%)`,
                    opacity: currentNote === note ? 0.8 : 0.3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.3)" : "none",
                    transition: "opacity 0.2s ease"
                  }}
                >
                  {note}
                </div>
              ))}
            </div>

            {/* Stats and target note overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              zIndex: 2
            }}>
              <div style={{
                background: "rgba(0, 0, 0, 0.7)",
                padding: "12px 20px",
                borderRadius: 10,
                color: "white",
                fontWeight: 600
              }}>
                <div>⏱️ {timeLeft}s</div>
                <div>Score: {score}</div>
              </div>

              {targetNote && (
                <div style={{
                  background: showMatch ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                  padding: '16px 40px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  border: '3px solid white',
                  boxShadow: showMatch ? '0 8px 32px rgba(34, 197, 94, 0.6)' : '0 8px 32px rgba(239, 68, 68, 0.6)',
                  transition: 'all 0.2s ease',
                  minWidth: '120px',
                  textAlign: 'center'
                }}>
                  {targetNote}
                </div>
              )}
            </div>
          </>
        )}

        {!isActive && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 5
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎵</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
              Note Matching Game
            </div>
            <button 
              onClick={startActivity}
              style={{
                marginTop: 20,
                padding: "12px 32px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              ▶ Start Activity
            </button>
          </div>
        )}
      </div>

      {isActive && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button 
            onClick={handleComplete}
            style={{
              padding: "10px 24px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ■ Stop
          </button>
        </div>
      )}

      {feedback && (
        <div style={{
          textAlign: "center",
          marginTop: 16,
          padding: "12px",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: 8,
          fontSize: "1.1rem"
        }}>
          {feedback}
        </div>
      )}

      {showNotification && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          padding: "16px 24px",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
          zIndex: 1000
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.5rem" }}>🏆</span>
            <div>
              <div style={{ fontWeight: 600 }}>{notificationTitle}</div>
              <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>{notificationMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Cat Meme Prompt */}
      {showCatMemePrompt && !showCatMemeModal && (
        <div 
          onClick={() => {
            setShowCatMemeModal(true);
            setShowCatMemePrompt(false);
          }}
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            padding: "20px 24px",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
            zIndex: 1000,
            cursor: "pointer",
            transition: "transform 0.2s",
            maxWidth: "300px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "2rem" }}>🐱</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>You earned a cat meme!</div>
              <div style={{ fontSize: "0.875rem", opacity: 0.9, marginTop: 4 }}>Click to open</div>
            </div>
          </div>
        </div>
      )}

      {/* Cat Meme Modal */}
      {showCatMemeModal && currentCatMeme && (
        <div 
          onClick={() => {
            setShowCatMemeModal(false);
            setShowCatMemePrompt(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              maxWidth: 500,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative"
            }}
          >
            <button
              onClick={() => {
                setShowCatMemeModal(false);
                setShowCatMemePrompt(false);
              }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 8,
                width: 32,
                height: 32,
                fontSize: "1.2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
            <h2 style={{ marginBottom: 16, color: "#1f2937" }}>🎉 Your Cat Meme Reward!</h2>
            <img 
              src={currentCatMeme} 
              alt="Cat Meme Reward" 
              style={{ 
                width: "100%", 
                borderRadius: 12,
                marginBottom: 16
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <a 
                href={currentCatMeme} 
                download={`rakez-cat-reward-${Date.now()}.png`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600
                }}
              >
                💾 Save Meme
              </a>
              <button
                onClick={() => {
                  setShowCatMemeModal(false);
                  setShowCatMemePrompt(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
