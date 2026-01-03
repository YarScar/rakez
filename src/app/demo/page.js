"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function DemoPage() {
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: "Complete a study session", completed: false },
    { id: 2, title: "Take a 5-minute break", completed: true },
    { id: 3, title: "Review notes", completed: false },
  ]);
  const [demoPoints, setDemoPoints] = useState(20);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [showCatMemePrompt, setShowCatMemePrompt] = useState(false);
  const [showCatMemeModal, setShowCatMemeModal] = useState(false);
  const [currentCatMeme, setCurrentCatMeme] = useState(null);
  const [shownCatImages, setShownCatImages] = useState([]);

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
    // Combine local images and API images
    const localImages = [
      '/cat-memes/image.png',
      '/cat-memes/image-1.png',
      '/cat-memes/image-2.png'
    ];
    
    // Add 5 API images with unique identifiers
    const apiImages = [
      `https://cataas.com/cat?id=1&${Date.now()}`,
      `https://cataas.com/cat?id=2&${Date.now()}`,
      `https://cataas.com/cat?id=3&${Date.now()}`,
      `https://cataas.com/cat?id=4&${Date.now()}`,
      `https://cataas.com/cat?id=5&${Date.now()}`
    ];
    
    const allImages = [...localImages, ...apiImages];
    
    // Filter out already shown images
    let availableImages = allImages.filter((img, index) => {
      // For API images, check by index since URL has timestamp
      const imageKey = img.startsWith('http') ? `api-${index}` : img;
      return !shownCatImages.includes(imageKey);
    });
    
    // If all images have been shown, reset
    if (availableImages.length === 0) {
      setShownCatImages([]);
      availableImages = [...allImages];
    }
    
    // Select random image from available ones
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    
    // Mark this image as shown
    const imageKey = selectedImage.startsWith('http') 
      ? `api-${allImages.indexOf(availableImages[randomIndex])}`
      : selectedImage;
    setShownCatImages(prev => [...prev, imageKey]);
    
    return selectedImage;
  };
  
  // Hand activity demo state
  const [activityActive, setActivityActive] = useState(false);
  const [activityScore, setActivityScore] = useState(0);
  const [activityFeedback, setActivityFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentNote, setCurrentNote] = useState("");
  const [targetNote, setTargetNote] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scoreIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const handsRef = useRef(null);
  const audioContextRef = useRef(null);
  const lastNoteTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lastMatchTimeRef = useRef(0);
  const hasMatchedCurrentTargetRef = useRef(false);
  const targetNoteRef = useRef(null);
  const activityScoreRef = useRef(0);

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
    console.log('🎯 Generated new target note:', randomNote);
    targetNoteRef.current = randomNote; // Update ref immediately
    setTargetNote(randomNote);
    hasMatchedCurrentTargetRef.current = false; // Reset match flag for new target
  };

  const playNote = (frequency, noteName) => {
    const now = Date.now();
    // Throttle note playing to avoid too many sounds
    if (now - lastNoteTimeRef.current < 200) return;
    
    lastNoteTimeRef.current = now;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      console.log(`Playing note ${noteName} at ${frequency}Hz, context state: ${ctx.state}`);
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Smoother volume curve
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
      
      setCurrentNote(noteName);
      setActivityFeedback(`♪ ${noteName} note!`);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const onHandResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8]; // Index finger tip
      
      console.log('Hand detected! Index finger at:', indexTip.x, indexTip.y);
      
      // Draw connections first (behind points)
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 3;
      const connections = [
        [0,1],[1,2],[2,3],[3,4], // Thumb
        [0,5],[5,6],[6,7],[7,8], // Index
        [5,9],[9,13],[13,17],[0,17], // Palm
        [9,10],[10,11],[11,12], // Middle
        [13,14],[14,15],[15,16], // Ring
        [17,18],[18,19],[19,20] // Pinky
      ];
      
      connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
        ctx.stroke();
      });
      
      // Draw landmarks on top
      ctx.fillStyle = '#00FF00';
      landmarks.forEach((landmark, index) => {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, index === 8 ? 10 : 6, 0, 2 * Math.PI); // Bigger circle for index tip
        ctx.fill();
        
        // Add white outline to index finger tip
        if (index === 8) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Determine which zone the index finger is in and play corresponding note
      const x = 1 - indexTip.x; // Mirror the x coordinate to match the mirrored video
      const noteNames = Object.keys(notes);
      const zoneWidth = 1 / noteNames.length;
      const zoneIndex = Math.min(Math.floor(x / zoneWidth), noteNames.length - 1);
      const noteName = noteNames[zoneIndex];
      
      // Draw vertical line showing current position
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(indexTip.x * canvas.width, 0);
      ctx.lineTo(indexTip.x * canvas.width, canvas.height);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      const currentTarget = targetNoteRef.current;
      
      // Play note regardless of match
      if (noteName && isProcessingRef.current) {
        playNote(notes[noteName], noteName);
        
        // Check if the played note matches the target - only allow one match per target
        if (noteName === currentTarget && !hasMatchedCurrentTargetRef.current && currentTarget !== null) {
          console.log('🎉 MATCH! Note:', noteName, 'Score +1');
          
          // Immediately lock this target to prevent multiple points
          hasMatchedCurrentTargetRef.current = true;
          const matchedNote = currentTarget; // Store the matched note
          
          setActivityScore(prev => {
            const newScore = prev + 1;
            activityScoreRef.current = newScore; // Update ref immediately
            console.log('Score updated from', prev, 'to', newScore);
            return newScore;
          });
          setShowMatch(true);
          
          // Show green for 400ms, then immediately switch to new red note
          setTimeout(() => {
            // Generate new note different from the matched one
            const noteNames = Object.keys(notes);
            let randomNote;
            do {
              randomNote = noteNames[Math.floor(Math.random() * noteNames.length)];
            } while (randomNote === matchedNote && noteNames.length > 1);
            console.log('🎯 New target note:', randomNote, '(was', matchedNote, ')');
            
            // Update to new note and turn it red
            targetNoteRef.current = randomNote; // Update ref immediately
            setTargetNote(randomNote);
            setShowMatch(false);
            hasMatchedCurrentTargetRef.current = false; // Allow matching the new note
          }, 400);
        }
      }
    } else {
      console.log('No hands detected in this frame');
    }
  };

  const toggleDemoTask = (id) => {
    setDemoTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        setDemoPoints(p => p + 10);
        setNotificationTitle(getRandomEncouragement());
        setNotificationMessage("+10 points earned");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
        
        // Show cat image prompt after a short delay
        setTimeout(() => {
          setCurrentCatMeme(getRandomCatMeme());
          setShowCatMemePrompt(true);
        }, 2500);
        
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const startHandActivity = async () => {
    try {
      // Initialize audio context first (requires user interaction)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      await audioContextRef.current.resume();
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Initialize MediaPipe Hands dynamically
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
      
      // Process video frames
      const processFrame = async () => {
        if (isProcessingRef.current && videoRef.current && videoRef.current.readyState === 4 && handsRef.current) {
          try {
            await handsRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error("Frame processing error:", err);
            // Don't stop on error, just skip this frame
          }
          animationFrameRef.current = requestAnimationFrame(processFrame);
        }
      };
      
      setActivityActive(true);
      setActivityScore(0);
      activityScoreRef.current = 0; // Reset ref
      setTimeLeft(30);
      setActivityFeedback("🎵 Match the notes!");
      
      // Generate first target note immediately
      const noteNames = Object.keys(notes);
      const firstNote = noteNames[Math.floor(Math.random() * noteNames.length)];
      console.log('🎯 Initial target note:', firstNote);
      targetNoteRef.current = firstNote; // Update ref immediately
      setTargetNote(firstNote);
      hasMatchedCurrentTargetRef.current = false;
      
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            stopHandActivity();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      
      // Start processing after video is ready
      const startProcessing = () => {
        if (videoRef.current?.readyState === 4) {
          processFrame();
        } else {
          setTimeout(startProcessing, 100);
        }
      };
      setTimeout(startProcessing, 500);
      
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access needed for hand activities. This is just a demo - sign up to try the real experience!");
    }
  };

  const stopHandActivity = () => {
    // Stop processing first
    isProcessingRef.current = false;
    setActivityActive(false);
    
    // Cancel any pending animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clear intervals
    if (scoreIntervalRef.current) {
      clearInterval(scoreIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Stop camera
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Close hands instance after a short delay to allow any pending operations to complete
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
    
    // Always show notification with final score
    const finalScore = activityScoreRef.current;
    console.log('Activity ended with score:', finalScore);
    
    setNotificationTitle(getRandomEncouragement());
    if (finalScore > 0) {
      setDemoPoints(p => p + finalScore);
      setNotificationMessage(`+${finalScore} points earned`);
    } else {
      setNotificationMessage("No points earned this time");
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    
    // Show cat image prompt after points notification
    if (finalScore > 0) {
      setTimeout(() => {
        setCurrentCatMeme(getRandomCatMeme());
        setShowCatMemePrompt(true);
      }, 2500);
    }
    
    setActivityFeedback("");
    setTimeLeft(30);
    setCurrentNote("");
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      isProcessingRef.current = false;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <div className="stack">
          <h1>🎯 Try Rakez - Interactive Demo</h1>
          <p className="subtitle">
            Experience task management with real-time rewards. Try completing a task below!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <style>{`
            .demo-banner {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 20px 24px;
              border-radius: 12px;
              margin-bottom: 32px;
              text-align: center;
              box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
            }
            
            .demo-stats {
              display: flex;
              gap: 16px;
              margin-bottom: 32px;
              flex-wrap: wrap;
            }
            
            .demo-stat-card {
              flex: 1;
              min-width: 150px;
              padding: 20px;
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 12px;
              text-align: center;
            }
            
            .demo-task {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 16px;
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: 12px;
              margin-bottom: 12px;
              transition: all 0.3s ease;
              cursor: pointer;
            }
            
            .demo-task:hover {
              transform: translateX(4px);
              border-color: #3b82f6;
            }
            
            .demo-task.completed {
              opacity: 0.6;
              background: rgba(16, 185, 129, 0.05);
              border-color: rgba(16, 185, 129, 0.3);
            }
            
            .notification {
              position: fixed;
              top: 24px;
              right: 24px;
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              padding: 16px 24px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
              animation: slideIn 0.3s ease;
              z-index: 1000;
            }
            
            @keyframes slideIn {
              from {
                transform: translateX(400px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            
            .cta-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 15px;
              text-decoration: none;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
              border: 2px solid transparent;
              margin: 8px;
            }
            
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4);
            }
            
            .activity-demo {
              margin-bottom: 32px;
              padding: 24px;
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(124, 58, 237, 0.05));
              border: 2px solid rgba(139, 92, 246, 0.2);
              border-radius: 12px;
            }
            
            .video-container {
              position: relative;
              width: 100%;
              max-width: 500px;
              height: 350px;
              margin: 20px auto;
              background: #000;
              border-radius: 12px;
              overflow: hidden;
            }
            
            .activity-overlay {
              position: absolute;
              top: 16px;
              left: 16px;
              right: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 10;
            }
            
            .activity-button {
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              border: none;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            
            .start-button {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
            }
            
            .start-button:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            }
            
            .stop-button {
              background: linear-gradient(135deg, #ef4444, #dc2626);
              color: white;
            }
            
            .stop-button:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            }
          `}</style>

          {showNotification && (
            <div className="notification">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{notificationTitle}</div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>{notificationMessage}</div>
                </div>
              </div>
            </div>
          )}

          {/* Cat Image Prompt */}
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

          {/* Cat Image Modal */}
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
                <h2 style={{ marginBottom: 16, color: "#1f2937" }}>🎉 Your Cat Image Reward!</h2>
                <img 
                  src={currentCatMeme} 
                  alt="Cat Image Reward" 
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
                    💾 Save Image
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

          <div className="demo-banner">
            <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>
              ⚡ This is a Demo
            </div>
            <div style={{ opacity: 0.9 }}>
              Try completing tasks to see how Rakez works. Ready to start for real?
            </div>
          </div>

          <div className="demo-stats">
            <div className="demo-stat-card">
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>
                {demoPoints}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Total Points</div>
            </div>
            <div className="demo-stat-card">
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                {demoTasks.filter(t => t.completed).length}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Tasks Completed</div>
            </div>
            <div className="demo-stat-card">
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#8b5cf6", marginBottom: 4 }}>
                🌱
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Beginner Badge</div>
            </div>
          </div>

          {/* Hand Activity Demo */}
          <div className="activity-demo">
            <h2 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              🎵 Interactive Hand Activity
              <span style={{ 
                fontSize: "0.75rem", 
                padding: "4px 8px", 
                background: "#8b5cf6", 
                color: "white", 
                borderRadius: 6,
                fontWeight: 600 
              }}>
                LIVE DEMO
              </span>
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>
              Experience our hand-gesture based activity! Move your hands to create music and earn points in real-time.
            </p>
            
            <div className="video-container">
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
                width={500}
                height={350}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "scaleX(-1)"
                }}
              />
              
              {/* Note zones visualization */}
              {activityActive && (
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
              )}
              {!activityActive && (
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
                    Finger Music Activity
                  </div>
                  <button 
                    onClick={startHandActivity}
                    className="activity-button start-button"
                  >
                    ▶ Start Demo
                  </button>
                </div>
              )}
              
              {activityActive && (
                <>
                  <div className="activity-overlay">
                    <div style={{
                      background: "rgba(0, 0, 0, 0.7)",
                      padding: "8px 16px",
                      borderRadius: 8,
                      color: "white",
                      fontWeight: 600,
                      display: "flex",
                      gap: 12
                    }}>
                      <span>⏱️ {timeLeft}s</span>
                      <span>•</span>
                      <span>Score: {activityScore}</span>
                    </div>
                    
                    {/* Target Note Display */}
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
                    
                    <button 
                      onClick={stopHandActivity}
                      className="activity-button stop-button"
                    >
                      ■ Stop
                    </button>
                  </div>
                  {activityFeedback && (
                    <div style={{
                      position: "absolute",
                      bottom: 24,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: 8,
                      fontSize: "1rem",
                      fontWeight: 600,
                      animation: "fadeIn 0.3s ease"
                    }}>
                      {activityFeedback}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {activityScore > 0 && (
              <div style={{
                textAlign: "center",
                padding: "12px",
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: 8,
                marginTop: 12
              }}>
                <span style={{ fontWeight: 600, color: "#8b5cf6" }}>
                  💫 Activity Points Earned: +{activityScore}
                </span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ marginBottom: 16 }}>📋 Demo Tasks</h2>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>
              Click on any incomplete task to mark it as complete and earn points!
            </p>
            
            {demoTasks.map(task => (
              <div
                key={task.id}
                className={`demo-task ${task.completed ? 'completed' : ''}`}
                onClick={() => !task.completed && toggleDemoTask(task.id)}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  style={{ width: 20, height: 20, cursor: "pointer" }}
                />
                <span style={{ 
                  flex: 1, 
                  textDecoration: task.completed ? "line-through" : "none",
                  fontWeight: task.completed ? 400 : 500
                }}>
                  {task.title}
                </span>
                {task.completed && <span style={{ color: "#10b981", fontSize: "0.875rem" }}>✓ Done</span>}
              </div>
            ))}
          </div>

          <div style={{ 
            textAlign: "center", 
            padding: "40px 24px", 
            background: "var(--surface)", 
            borderRadius: 12, 
            border: "1px solid var(--border)" 
          }}>
            <h2 style={{ marginBottom: 12 }}>Ready to track your real progress?</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>
              Create an account to save your tasks, earn real achievements, and access all features.
            </p>
            <div>
              <Link href="/signup" className="cta-button">
                ✨ Create Free Account
              </Link>
              <Link href="/login" className="cta-button" style={{ 
                background: "transparent", 
                border: "2px solid #3b82f6",
                color: "#3b82f6"
              }}>
                🔐 Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
