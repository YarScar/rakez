"use client";
import { useEffect } from "react";

/**
 * Modal component for displaying cat images with prompt
 * @param {Object} props
 * @param {boolean} props.showPrompt - Show the prompt to view image
 * @param {boolean} props.showModal - Show the modal with image
 * @param {string} props.currentImage - URL of the current cat image
 * @param {Function} props.onYes - Callback when user clicks Yes
 * @param {Function} props.onNo - Callback when user clicks No
 * @param {Function} props.onClose - Callback when user closes modal
 */
export default function CatImageModal({ 
  showPrompt, 
  showModal, 
  currentImage, 
  onYes, 
  onNo, 
  onClose 
}) {
  useEffect(() => {
    if (showModal || showPrompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showPrompt]);

  if (!showPrompt && !showModal) return null;

  return (
    <>
      {/* Prompt Modal */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🎉 Great Job!</h3>
            <p className="text-gray-600 mb-6">
              Would you like to see a random cat image as a reward?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onYes}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Yes, Show Me! 🐱
              </button>
              <button
                onClick={onNo}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showModal && currentImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Reward! 🐱</h3>
            <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={currentImage}
                alt="Cat reward"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/cat-memes/image.png'; // Fallback image
                }}
              />
            </div>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Thanks! 😊
            </button>
          </div>
        </div>
      )}
    </>
  );
}
