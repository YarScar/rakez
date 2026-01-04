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
  const draggedCandleRef = useRef(null);
  const isProcessingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const candlesPlacedRef = useRef(0);
  const placedIdsRef = useRef(new Set());
  const wasPinchingRef = useRef(false);
  const cakeImageRef = useRef(null);
  const candleImageRef = useRef(null);

  // Available candles state - left side of screen (mutable positions)
  const [availableCandles, setAvailableCandles] = useState([
    { id: 1, x: 80, y: 120 },
    { id: 2, x: 80, y: 200 },
    { id: 3, x: 80, y: 280 },
    { id: 4, x: 80, y: 360 }
  ]);
  const [placedCandles, setPlacedCandles] = useState([]);

  // Refs to hold latest candle arrays so MediaPipe callback (stable reference)
  // can read up-to-date positions without relying on React closure updates.
  const availableCandlesRef = useRef(availableCandles);
  const placedCandlesRef = useRef(placedCandles);

  useEffect(() => {
    availableCandlesRef.current = availableCandles;
  }, [availableCandles]);

  useEffect(() => {
    placedCandlesRef.current = placedCandles;
  }, [placedCandles]);

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

  // Return numeric pinch distance (normalized) for hysteresis-based detection
  const getPinchDistance = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    return Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );
  };

  // Render function to draw cake and candles continuously
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Assume canvas.width/height already set by caller (from video)
    // If not set, default to 640x480
    if (!canvas.width) canvas.width = 640;
    if (!canvas.height) canvas.height = 480;
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
    
    // Draw available candles (read from ref to reflect latest positions inside callback)
    (availableCandlesRef.current || []).forEach(candle => {
      const isPlaced = (placedCandlesRef.current || []).some(c => c.id === candle.id);
      const isDragged = (draggedCandleRef.current && draggedCandleRef.current.id === candle.id) || (draggedCandle && draggedCandle.id === candle.id);
      
      if (!isPlaced && !isDragged) {
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
    
    // Draw placed candles on cake (use ref for latest)
    (placedCandlesRef.current || []).forEach(candle => {
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
    const list = availableCandlesRef.current || [];
    const placed = new Set((placedCandlesRef.current || []).map(c => c.id));
    for (let candle of list) {
      if (placed.has(candle.id)) continue;
      const dx = x - candle.x;
      const dy = y - candle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Use slightly larger pick radius (60 px) for easier grabbing
      if (distance < 60) {
        return candle;
      }
    }
    return null;
  };

  const onHandResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Match canvas to video size
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render static elements (cake, available/placed candles)
    renderCanvas();

    // Process hand tracking
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8]; // Index finger tip

      // Draw skeleton/connections (same scheme as note_match)
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
        const a = landmarks[start];
        const b = landmarks[end];
        ctx.beginPath();
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
        ctx.stroke();
      });

      // Draw landmarks
      ctx.fillStyle = '#00FF00';
      landmarks.forEach((lm, i) => {
        const x = lm.x * canvas.width;
        const y = lm.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, i === 8 ? 10 : 6, 0, 2 * Math.PI);
        ctx.fill();
        if (i === 8) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Compute cursor position
      const cursorX = indexTip.x * canvas.width;
      const cursorY = indexTip.y * canvas.height;
      setCursorPosition({ x: cursorX, y: cursorY });

      // Use numeric pinch distance with pixel thresholds for robustness
      const pinchDistance = getPinchDistance(landmarks); // normalized
      const pixelDistance = pinchDistance * Math.max(canvas.width, canvas.height);
      const downThresholdPx = 40; // start pinch when fingers are within ~40px
      const upThresholdPx = 60; // release when larger than ~60px
      let isPinching;
      if (wasPinchingRef.current) {
        isPinching = pixelDistance < upThresholdPx;
      } else {
        isPinching = pixelDistance < downThresholdPx;
      }

      // Draw cursor
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, isPinching ? 20 : 15, 0, 2 * Math.PI);
      ctx.fillStyle = isPinching ? 'rgba(255, 0, 255, 0.8)' : 'rgba(59, 130, 246, 0.6)';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw pinch pixel distance for debugging
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fillText(Math.round(pixelDistance) + 'px', cursorX + 18, cursorY - 18);

      // Show dragged candle following the cursor
      const activeDragged = draggedCandleRef.current || draggedCandle;
      if (activeDragged && isPinching) {
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
        if (isPinching && !wasPinchingRef.current) {
          wasPinchingRef.current = true;
          const nearbyCandle = getCandleNearCursor(cursorX, cursorY);
          if (nearbyCandle) {
            setDraggedCandle(nearbyCandle);
            draggedCandleRef.current = nearbyCandle;
            setFeedback("🕯️ Candle grabbed! Drag to cake 🎂");
            console.log('candle grabbed', nearbyCandle.id, 'px', Math.round(pixelDistance));
          }
        } else if (!isPinching && wasPinchingRef.current) {
          wasPinchingRef.current = false;
          const active = draggedCandleRef.current || draggedCandle;
          if (active) {
            if (isOverCake(cursorX, cursorY)) {
              if (candlesPlacedRef.current >= MAX_CANDLES) {
                setFeedback(`Maximum of ${MAX_CANDLES} candles placed`);
              } else if (placedIdsRef.current.has(active.id)) {
                setFeedback('Candle already placed');
              } else {
                const newCandle = {
                  id: active.id,
                  x: cursorX,
                  y: cursorY,
                  rotation: Math.random() * 20 - 10
                };
                // lock on cake
                placedIdsRef.current.add(active.id);
                setPlacedCandles(prev => [...prev, newCandle]);
                setCandlesPlaced(prev => {
                  const newCount = prev + 1;
                  candlesPlacedRef.current = newCount;
                  return newCount;
                });
                // remove from available candles so it no longer moves
                setAvailableCandles(prev => prev.filter(c => c.id !== active.id));
                setFeedback('🎉 Candle placed! +1 point');
              }
            } else {
              // Persist new position for the available candle
              setAvailableCandles(prev => prev.map(c => c.id === active.id ? { ...c, x: cursorX, y: cursorY } : c));
              setFeedback('Candle moved to new position');
            }
            setDraggedCandle(null);
            draggedCandleRef.current = null;
          }
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
      
      // Start processing once video is ready
      const startProcessing = () => {
        if (videoRef.current?.readyState === 4) {
          processFrame();
        } else {
          setTimeout(startProcessing, 100);
        }
      };
      setIsActive(true);
      setFeedback("Pinch candles and drag them to the cake!");
      setTimeout(startProcessing, 300);
      
    } catch (error) {
      console.error("Camera access error:", error);
      setFeedback("Camera access denied");
    }
  };

  const stopActivity = () => {
    isProcessingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (handsRef.current) {
      try {
        handsRef.current.close();
      } catch (err) {
        console.log("Hands already closed");
      }
      handsRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
              transform: "scaleX(-1)",
              pointerEvents: "none"
            }}
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
