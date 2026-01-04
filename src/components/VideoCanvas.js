"use client";

/**
 * Video canvas container for hand-tracking activities
 */
export default function VideoCanvas({ 
  videoRef, 
  canvasRef, 
  isActive,
  overlay 
}) {
  return (
    <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3] bg-black rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute w-full h-full object-cover scale-x-[-1]"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      />
      
      {/* Overlay content (timers, scores, etc) */}
      {isActive && overlay && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {overlay}
        </div>
      )}

      {/* Start prompt */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center text-white">
            <p className="text-2xl font-bold mb-2">Ready to start?</p>
            <p className="text-gray-300">Click "Start Activity" below</p>
          </div>
        </div>
      )}
    </div>
  );
}
