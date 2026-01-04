"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function CakeCandlesActivity() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [candlesPlaced, setCandlesPlaced] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showCatMemePrompt, setShowCatMemePrompt] = useState(false);
  const [showCatMemeModal, setShowCatMemeModal] = useState(false);
  const [currentCatMeme, setCurrentCatMeme] = useState(null);
  const [shownCatImages, setShownCatImages] = useState([]);
  const [draggedCandle, setDraggedCandle] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const isProcessingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const candlesPlacedRef = useRef(0);
  const wasPinchingRef = useRef(false);
  const cakeImageRef = useRef(null);
  const candleImageRef = useRef(null);

  // Available candles state - left side of screen
  const [availableCandles] = useState([
    { id: 1, x: 80, y: 120 },
    { id: 2, x: 80, y: 200 },
    { id: 3, x: 80, y: 280 },
    { id: 4, x: 80, y: 360 }
  ]);
  const [placedCandles, setPlacedCandles] = useState([]);

  const MAX_CANDLES = 4;
  // Cake area - centered on screen
  const CAKE_AREA = { x: 210, y: 130, width: 200, height: 240 };

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
    "You're A Star!"
  ];

  const getRandomEncouragement = () => {
    return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
  };

  const getRandomCatMeme = () => {
    const localImages = [
      '/cat-memes/image.png',
      '/cat-memes/image-1.png',
      '/cat-memes/image-2.png',
      '/cat-memes/image-3.png',
      '/cat-memes/image-4.png',
      '/cat-memes/image-5.png',
      '/cat-memes/image-6.png',
      '/cat-memes/image-7.png',
      '/cat-memes/image-8.png',
      '/cat-memes/image-9.png',
      '/cat-memes/image-10.png',
      '/cat-memes/image-11.png'
    ];
    
    const apiImages = [
      `https://cataas.com/cat?id=1&${Date.now()}`,
      `https://cataas.com/cat?id=2&${Date.now()}`,
      `https://cataas.com/cat?id=3&${Date.now()}`,
      `https://cataas.com/cat?id=4&${Date.now()}`,
      `https://cataas.com/cat?id=5&${Date.now()}`
    ];
    
    const allImages = [...localImages, ...apiImages];
    let availableImages = allImages.filter((img, index) => {
      const imageKey = img.startsWith('http') ? `api-${index}` : img;
      return !shownCatImages.includes(imageKey);
    });
    
    if (availableImages.length === 0) {
      setShownCatImages([]);
      availableImages = [...allImages];
    }
    
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    const imageKey = selectedImage.startsWith('http') 
      ? `api-${allImages.indexOf(availableImages[randomIndex])}`
      : selectedImage;
    setShownCatImages(prev => [...prev, imageKey]);
    
    return selectedImage;
  };

  // Load cake and candle PNG images
  useEffect(() => {
    // Load cake image
    const cakeImg = new Image();
    cakeImg.src = '/cake.png';
    cakeImg.onload = () => {
      cakeImageRef.current = cakeImg;
      console.log('Cake image loaded');
    };
    cakeImg.onerror = () => {
      console.log('Cake PNG not found - add /public/cake.png');
    };

    // Load candle image
    const candleImg = new Image();
    candleImg.src = '/candle.png';
    candleImg.onload = () => {
      candleImageRef.current = candleImg;
      console.log('Candle image loaded');
    };
    candleImg.onerror = () => {
      console.log('Candle PNG not found - add /public/candle.png');
    };
  }, []);

  const detectPinch = (landmarks) => {
    const thumbTip = landmarks[4];   // Thumb tip
    const indexTip = landmarks[8];   // Index finger tip
    
    // Calculate 3D distance between thumb and index finger
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );
    
    // Pinch detected when fingers are close together
    return distance < 0.05;
  };

  // Render function to draw cake and candles continuously
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 640;
    canvas.height = 480;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw white background box for cake
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(CAKE_AREA.x - 20, CAKE_AREA.y - 20, CAKE_AREA.width + 40, CAKE_AREA.height + 40);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 6;
    ctx.strokeRect(CAKE_AREA.x - 20, CAKE_AREA.y - 20, CAKE_AREA.width + 40, CAKE_AREA.height + 40);
    
    // Draw cake (PNG or fallback emoji)
    if (cakeImageRef.current && cakeImageRef.current.complete) {
      ctx.drawImage(cakeImageRef.current, CAKE_AREA.x, CAKE_AREA.y, CAKE_AREA.width, CAKE_AREA.height);
    } else {
      ctx.fillStyle = 'rgba(255, 228, 196, 0.9)';
      ctx.fillRect(CAKE_AREA.x, CAKE_AREA.y, CAKE_AREA.width, CAKE_AREA.height);
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.fillText('🎂', CAKE_AREA.x + CAKE_AREA.width/2, CAKE_AREA.y + CAKE_AREA.height/2);
    }
    
    // Draw available candles
    availableCandles.forEach(candle => {
      const isPlaced = placedCandles.some(c => c.id === candle.id);
      
      if (!isPlaced) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(candle.x, candle.y, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        if (candleImageRef.current && candleImageRef.current.complete) {
          ctx.drawImage(candleImageRef.current, candle.x - 30, candle.y - 40, 60, 80);
        } else {
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000';
          ctx.fillText('🕯️', candle.x, candle.y);
        }
      } else {
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#10b981';
        ctx.fillText('✓', candle.x, candle.y);
      }
    });
    
    // Draw placed candles on cake
    placedCandles.forEach(candle => {
      ctx.save();
      ctx.translate(candle.x, candle.y);
      ctx.rotate((candle.rotation * Math.PI) / 180);
      
      if (candleImageRef.current && candleImageRef.current.complete) {
        ctx.drawImage(candleImageRef.current, -20, -30, 40, 60);
      } else {
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText('🕯️', 0, 0);
      }
      ctx.restore();
    });
  };

  const isOverCake = (x, y) => {
    return x >= CAKE_AREA.x && 
           x <= CAKE_AREA.x + CAKE_AREA.width &&
           y >= CAKE_AREA.y && 
           y <= CAKE_AREA.y + CAKE_AREA.height;
  };

  const getCandleNearCursor = (x, y) => {
    // Check if cursor is near any available (not yet placed) candle
    for (let candle of availableCandles) {
      const isPlaced = placedCandles.some(c => c.id === candle.id);
      if (!isPlaced) {
        const distance = Math.sqrt(
          Math.pow(x - candle.x, 2) + Math.pow(y - candle.y, 2)
        );
        // Candle is "clicked" if cursor is within 50 pixels
        if (distance < 50) {
          return candle;
        }
      }
    }
    return null;
  };

  const onHandResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Render static elements first
    renderCanvas();
    
    // Process hand tracking
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8];  // Index finger tip acts as cursor
      
      // Convert normalized coordinates to canvas pixels
      const cursorX = indexTip.x * canvas.width;
      const cursorY = indexTip.y * canvas.height;
      
      // Update cursor position state
      setCursorPosition({ x: cursorX, y: cursorY });
      
      // Detect pinch gesture (thumb + index finger)
      const isPinching = detectPinch(landmarks);
      
      // Draw cursor at index finger position
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, isPinching ? 20 : 15, 0, 2 * Math.PI);
      ctx.fillStyle = isPinching ? 'rgba(255, 0, 255, 0.8)' : 'rgba(59, 130, 246, 0.6)';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Show dragged candle following the cursor
      if (draggedCandle && isPinching) {
        if (candleImageRef.current && candleImageRef.current.complete) {
          ctx.drawImage(candleImageRef.current, cursorX - 25, cursorY - 50, 50, 70);
        } else {
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🕯️', cursorX, cursorY - 30);
        }
      }
      
      // Handle pinch interactions
      if (isProcessingRef.current) {
        // Pinch started (click down)
        if (isPinching && !wasPinchingRef.current) {
          wasPinchingRef.current = true;
          const nearbyCandle = getCandleNearCursor(cursorX, cursorY);
          if (nearbyCandle) {
            setDraggedCandle(nearbyCandle);
            setFeedback("🕯️ Candle grabbed! Drag to cake 🎂");
          }
        }
        // Pinch released (click up / drop)
        else if (!isPinching && wasPinchingRef.current) {
          wasPinchingRef.current = false;
          
          // Check if candle was dropped on the cake
          if (draggedCandle && isOverCake(cursorX, cursorY)) {
            const newCandle = { 
              id: draggedCandle.id, 
              x: cursorX, 
              y: cursorY,
              rotation: Math.random() * 20 - 10  // Random slight rotation
            };
            
            setPlacedCandles(prev => [...prev, newCandle]);
            setCandlesPlaced(prev => {
              const newCount = prev + 1;
              candlesPlacedRef.current = newCount;
              return newCount;
            });
            setFeedback("🎉 Candle placed! +1 point");
          } else if (draggedCandle) {
            setFeedback("❌ Drop candle on the cake area!");
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
      setFeedback("Pinch candles and drag them to the cake!");
      
    } catch (error) {
      console.error("Camera access error:", error);
      setFeedback("Camera access denied");
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

  const handleComplete = async () => {
    stopActivity();
    
    const finalScore = candlesPlacedRef.current;
    const pointsEarned = finalScore * 2;
    
    setNotificationTitle(getRandomEncouragement());
    setNotificationMessage(pointsEarned > 0 ? `+${pointsEarned} points earned` : "No points earned this time");
    setShowNotification(true);
    
    if (pointsEarned > 0) {
      setTimeout(() => {
        setCurrentCatMeme(getRandomCatMeme());
        setShowCatMemePrompt(true);
      }, 2500);
    }
    
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          type: "CAKE_CANDLES",
          points: pointsEarned,
          duration: 30
        })
      });
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
      handleComplete();
    }
  }, [isActive, timeLeft]);

  // Render canvas when images load or state changes
  useEffect(() => {
    renderCanvas();
  }, [availableCandles, placedCandles, cakeImageRef.current, candleImageRef.current]);

  useEffect(() => {
    return () => {
      stopActivity();
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", paddingBottom: 60 }}>
      <BackButton />
      
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>🎂 Birthday Cake Candles</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Pinch and drag candles onto the cake!
          </p>
        </div>

        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "600px",
          margin: "0 auto",
          aspectRatio: "4/3",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 16,
          overflow: "hidden",
          border: "4px solid var(--primary)"
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: "none" }}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}
          />

          {isActive && (
            <>
              <div style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 20,
                background: "rgba(0, 0, 0, 0.7)",
                padding: "12px 20px",
                borderRadius: 10,
                color: "white",
                fontWeight: 600,
                zIndex: 10
              }}>
                <div>⏱️ {timeLeft}s</div>
                <div>🕯️ {candlesPlaced}/{MAX_CANDLES}</div>
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
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎂</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
                Cake Candles Game
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
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>You earned a cat image!</div>
                <div style={{ fontSize: "0.875rem", opacity: 0.9, marginTop: 4 }}>Click to open</div>
              </div>
            </div>
          </div>
        )}

        {showCatMemeModal && currentCatMeme && (
          <div 
            onClick={() => {
              setShowCatMemeModal(false);
              router.push("/activities/complete");
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              cursor: "pointer",
              padding: 20
            }}
          >
            <div style={{
              maxWidth: "90%",
              maxHeight: "90%",
              position: "relative"
            }}>
              <img 
                src={currentCatMeme} 
                alt="Cat Meme" 
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
                }}
              />
              <div style={{
                position: "absolute",
                bottom: -60,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "0.875rem",
                whiteSpace: "nowrap"
              }}>
                Click anywhere to continue
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
