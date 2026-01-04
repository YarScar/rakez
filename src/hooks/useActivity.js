import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing activity timer
 * @param {number} duration - Timer duration in seconds
 * @param {Function} onComplete - Callback when timer completes
 * @returns {Object} Timer state and controls
 */
export function useActivityTimer(duration, onComplete) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft, onComplete]);

  const start = () => {
    setTimeLeft(duration);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = () => {
    setTimeLeft(duration);
    setIsActive(false);
  };

  return { timeLeft, isActive, start, stop, reset };
}

/**
 * Hook for managing activity score
 * @param {number} initialScore - Starting score
 * @returns {Object} Score state and controls
 */
export function useActivityScore(initialScore = 0) {
  const [score, setScore] = useState(initialScore);
  const scoreRef = useRef(initialScore);

  const increment = (amount = 1) => {
    setScore(prev => {
      const newScore = prev + amount;
      scoreRef.current = newScore;
      return newScore;
    });
  };

  const decrement = (amount = 1) => {
    setScore(prev => {
      const newScore = Math.max(0, prev - amount);
      scoreRef.current = newScore;
      return newScore;
    });
  };

  const reset = () => {
    setScore(initialScore);
    scoreRef.current = initialScore;
  };

  return { score, scoreRef, increment, decrement, reset, setScore };
}
