/**
 * Get a random item from an array
 * @param {Array} array - Source array
 * @returns {*} - Random item from array
 */
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random encouraging message
 * @param {string[]} messages - Array of encouraging messages
 * @returns {string} - Random encouraging message
 */
export function getRandomEncouragement(messages) {
  return getRandomItem(messages);
}

/**
 * Calculate badge based on completion count
 * @param {number} count - Number of completions
 * @param {Object} thresholds - Badge threshold configuration
 * @returns {Object} - Badge object with emoji, title, and color
 */
export function getBadgeForCount(count, thresholds) {
  if (count >= thresholds.MASTER.count) return thresholds.MASTER;
  if (count >= thresholds.EXPERT.count) return thresholds.EXPERT;
  if (count >= thresholds.ACHIEVER.count) return thresholds.ACHIEVER;
  return thresholds.BEGINNER;
}

/**
 * Format duration in seconds to mm:ss
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
