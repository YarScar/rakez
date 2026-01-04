"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useCatImage } from "@/hooks/useCatImage";
import CatImageModal from "@/components/CatImageModal";
import Notification from "@/components/Notification";
import { ENCOURAGING_MESSAGES } from "@/lib/constants";
import { getRandomItem } from "@/lib/utils";

export default function CakeCandlesActivity() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [candlesPlaced, setCandlesPlaced] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState("");
  const [candles, setCandles] = useState([]);
  const [availableCandles, setAvailableCandles] = useState([
    { id: 1, placed: false },
    { id: 2, placed: false },
    { id: 3, placed: false },
    { id: 4, placed: false },
    { id: 5, placed: false },
    { id: 6, placed: false },
    { id: 7, placed: false },
    { id: 8, placed: false },
    { id: 9, placed: false },
    { id: 10, placed: false },
  ]);
  const [draggedCandle, setDraggedCandle] = useState(null);
  const [isPinching, setIsPinching] = useState(false);
  const [pinchPosition, setPinchPosition] = useState({ x: 0, y: 0 });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showCatImagePrompt, setShowCatImagePrompt] = useState(false);
  const [showCatImageModal, setShowCatImageModal] = useState(false);
  const [currentCatImage, setCurrentCatImage] = useState(null);
  
  const { getRandomCatImage } = useCatImage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const isProcessingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const candlesPlacedRef = useRef(0);
  const wasPinchingRef = useRef(false);

  const MAX_CANDLES = 10;
  const CAKE_X = 400;  // Cake position on canvas
  const CAKE_Y = 250;
  const CAKE_WIDTH = 250;
  const CAKE_HEIGHT = 200;

  // Detect pinch gesture (thumb and index finger close together)
  const detectPinch = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );
    
    return distance < 0.05; // Threshold for pinch
  };

  // Check if position is over the cake area
  const isOverCake = (x, y) => {
    return x >= CAKE_X && 
           x <= CAKE_X + CAKE_WIDTH &&
           y >= CAKE_Y && 
           y <= CAKE_Y + CAKE_HEIGHT;
  };

  // Check if pinch cursor is over an available candle on the sidebar
  const getCandleNearCursor = (x, y) => {
    const candleSize = 40;
    const sidebarX = 20;
    const startY = 80;
    const spacing = 50;
    
    for (let i = 0; i < availableCandles.length; i++) {
      if (!availableCandles[i].placed) {
        const candleY = startY + (i * spacing);
        
        if (x >= sidebarX && x <= sidebarX + candleSize &&
            y >= candleY && y <= candleY + candleSize) {
          return availableCandles[i];
        }
      }
    }
    return null;
  };

  const onHandResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw UI elements first (behind hand)
    // Draw available candles sidebar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 60, canvas.height - 20);
    
    const sidebarX = 20;
    const startY = 80;
    const spacing = 50;
    
    // Draw candle counter at top
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${candlesPlaced}/${MAX_CANDLES}`, 40, 40);
    
    availableCandles.forEach((candle, i) => {
      const candleY = startY + (i * spacing);
      ctx.font = '32px Arial';
      ctx.fillText(candle.placed ? '✓' : '🕯️', sidebarX + 8, candleY + 30);
    });
    
    // Draw cake
    ctx.fillStyle = 'rgba(255, 228, 196, 0.9)';
    ctx.fillRect(CAKE_X, CAKE_Y, CAKE_WIDTH, CAKE_HEIGHT);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.strokeRect(CAKE_X, CAKE_Y, CAKE_WIDTH, CAKE_HEIGHT);
    
    // Draw cake emoji
    ctx.font = '60px Arial';
    ctx.fillText('🎂', CAKE_X + CAKE_WIDTH/2 - 30, CAKE_Y + CAKE_HEIGHT/2 + 20);
    
    // Draw placed candles on cake
    candles.forEach((candle) => {
      ctx.font = '32px Arial';
      ctx.save();
      ctx.translate(CAKE_X + candle.x, CAKE_Y + candle.y);
      ctx.rotate((candle.rotation * Math.PI) / 180);
      ctx.fillText('🕯️', -16, 0);
      ctx.restore();
    });
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      
      // Draw hand skeleton
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
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

      // Calculate pinch position
      const pinchX = ((thumbTip.x + indexTip.x) / 2) * canvas.width;
      const pinchY = ((thumbTip.y + indexTip.y) / 2) * canvas.height;
      
      setPinchPosition({ x: pinchX, y: pinchY });
      
      // Draw cursor at pinch position
      const pinching = detectPinch(landmarks);
      if (pinching) {
        ctx.fillStyle = '#FF00FF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
      } else {
        ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
      }
      ctx.beginPath();
      ctx.arc(pinchX, pinchY, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Show dragged candle at cursor
      if (draggedCandle && pinching) {
        ctx.font = '40px Arial';
        ctx.fillText('🕯️', pinchX - 20, pinchY - 20);
      }
      
      // Handle pinch interaction
      if (isProcessingRef.current) {
        // Just started pinching - check if clicking on a candle
        if (pinching && !wasPinchingRef.current) {
          setIsPinching(true);
          wasPinchingRef.current = true;
          
          const nearbyCandle = getCandleNearCursor(pinchX, pinchY);
          if (nearbyCandle) {
            setDraggedCandle(nearbyCandle);
            setFeedback("🕯️ Dragging candle...");
          }
        }
        // Currently pinching - dragging
        else if (pinching && wasPinchingRef.current) {
          setIsPinching(true);
        }
        // Released pinch - drop candle
        else if (!pinching && wasPinchingRef.current) {
          setIsPinching(false);
          wasPinchingRef.current = false;
          
          if (draggedCandle && isOverCake(pinchX, pinchY)) {
            // Place the candle on cake
            const newCandle = { 
              id: draggedCandle.id, 
              x: pinchX - CAKE_X, 
              y: pinchY - CAKE_Y,
              rotation: Math.random() * 10 - 5
            };
            
            setCandles(prev => [...prev, newCandle]);
            setAvailableCandles(prev => 
              prev.map(c => c.id === draggedCandle.id ? { ...c, placed: true } : c)
            );
            
            setCandlesPlaced(prev => {
              const newCount = prev + 1;
              candlesPlacedRef.current = newCount;
              return newCount;
            });
            
            setFeedback("✅ Candle placed!");
          } else if (draggedCandle) {
            setFeedback("❌ Drop on the cake!");
          }
          
          setDraggedCandle(null);
        }
      }
    }
  };

  const startActivity = async () => {
    try {
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
        if (isProcessingRef.current && videoRef.current && 
            videoRef.current.readyState === 4 && handsRef.current) {
          try {
            await handsRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error("Frame processing error:", err);
          }
          animationFrameRef.current = requestAnimationFrame(processFrame);
        }
      };
      
      processFrame();
      setIsActive(true);
      setFeedback("Pinch to click! Pick candles from the left sidebar and drag them to the cake!");
      
    } catch (error) {
      console.error("Camera access error:", error);
      setFeedback("Camera access denied. Please allow camera access.");
    }
  };

  const stopActivity = () => {
    isProcessingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
  };

  const completeActivity = async () => {
    const pointsEarned = candlesPlaced * 2;
    
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cake_candles",
          points: pointsEarned,
          duration: 30
        }),
      });
      
      setNotificationTitle(getRandomItem(ENCOURAGING_MESSAGES));
      setNotificationMessage(`You placed ${candlesPlaced} candles! +${pointsEarned} points`);
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
        setCurrentCatImage(getRandomCatImage());
        setShowCatImagePrompt(true);
      }, 3000);
      
    } catch (error) {
      console.error("Failed to save activity:", error);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    
    if (timeLeft === 0 && isActive) {
      stopActivity();
      completeActivity();
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    return () => {
      stopActivity();
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <BackButton />
      
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎂 Birthday Cake Candles</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--muted)", marginBottom: 8 }}>
            Use pinch gesture as a cursor to click and drag candles!
          </p>
          {isActive && (
            <div style={{ 
              display: "inline-block",
              padding: "8px 16px",
              background: "var(--surface)",
              borderRadius: 8,
              fontSize: "1.25rem",
              fontWeight: "bold"
            }}>
              ⏱️ {timeLeft}s | 🕯️ {candlesPlaced}/{MAX_CANDLES}
            </div>
          )}
        </div>

        {/* Single unified camera view with overlays */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: 800,
          margin: "0 auto",
          aspectRatio: "4/3",
          background: "#000",
          borderRadius: 16,
          overflow: "hidden",
          border: "4px solid var(--primary)"
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", width: "100%", height: "100%", transform: "scaleX(-1)" }}
          />
          
          {!isActive && (
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              gap: 16
            }}>
              <button
                onClick={startActivity}
                style={{
                  padding: "20px 40px",
                  fontSize: "1.25rem",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer"
                }}
              >
                🎂 Start Activity
              </button>
              <p style={{ color: "white", fontSize: "0.9rem", maxWidth: 400, textAlign: "center", padding: "0 16px" }}>
                💡 Pinch thumb & index finger together to "click". Pick candles from the sidebar and drag to the cake!
              </p>
            </div>
          )}
        </div>

        {feedback && (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: "var(--surface)",
            borderRadius: 12,
            textAlign: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
            maxWidth: 800,
            margin: "16px auto 0"
          }}>
            {feedback}
          </div>
        )}
      </div>

      <Notification
        show={showNotification}
        title={notificationTitle}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        type="success"
      />

      <CatImageModal
        showPrompt={showCatImagePrompt}
        showModal={showCatImageModal}
        currentImage={currentCatImage}
        onYes={() => {
          setShowCatImagePrompt(false);
          setShowCatImageModal(true);
        }}
        onNo={() => {
          setShowCatImagePrompt(false);
          router.push("/activities/complete");
        }}
        onClose={() => {
          setShowCatImageModal(false);
          router.push("/activities/complete");
        }}
      />

      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}
