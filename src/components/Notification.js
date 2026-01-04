"use client";
import { useEffect } from "react";

/**
 * Reusable notification component
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the notification
 * @param {string} props.title - Notification title
 * @param {string} props.message - Notification message
 * @param {Function} props.onClose - Callback when notification closes
 * @param {number} props.duration - Duration in ms before auto-close (default: 3000)
 * @param {string} props.type - Notification type: 'success' | 'error' | 'info' (default: 'success')
 */
export default function Notification({ 
  show, 
  title, 
  message, 
  onClose, 
  duration = 3000,
  type = 'success' 
}) {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const typeStyles = {
    success: "bg-gradient-to-r from-green-500 to-emerald-600",
    error: "bg-gradient-to-r from-red-500 to-rose-600",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600"
  };

  const icons = {
    success: "🎉",
    error: "❌",
    info: "ℹ️"
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${typeStyles[type]} text-white rounded-xl shadow-2xl p-6 max-w-md min-w-[300px]`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icons[type]}</span>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{title}</h4>
            {message && <p className="text-sm opacity-90">{message}</p>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold ml-2"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
