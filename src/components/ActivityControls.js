"use client";

/**
 * Activity Control Buttons Component
 */
export default function ActivityControls({ isActive, onStart, onStop }) {
  if (isActive) {
    return (
      <div className="text-center mt-5">
        <button 
          onClick={onStop}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
        >
          ■ Stop
        </button>
      </div>
    );
  }

  return (
    <div className="text-center mt-5">
      <button
        onClick={onStart}
        className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg"
      >
        ▶ Start Activity
      </button>
    </div>
  );
}
