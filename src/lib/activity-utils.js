/**
 * Shared utilities for activity pages
 */
import { ENCOURAGING_MESSAGES, CAT_IMAGE_SOURCES } from './constants';

/**
 * Get a random encouraging message
 * @returns {string} Random encouraging message
 */
export function getRandomEncouragement() {
  return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
}

/**
 * Get a random cat image (local or API)
 * @param {string[]} shownImages - Array of already shown image keys
 * @param {Function} setShownImages - Setter to update shown images
 * @returns {string} URL of the selected cat image
 */
export function getRandomCatImage(shownImages, setShownImages) {
  // Generate API image URLs
  const apiImages = Array.from({ length: CAT_IMAGE_SOURCES.API_COUNT }, (_, i) => 
    `${CAT_IMAGE_SOURCES.API_BASE}?id=${i + 1}`
  );
  
  const allImages = [...CAT_IMAGE_SOURCES.LOCAL, ...apiImages];
  
  // Filter out already shown images
  let availableImages = allImages.filter((img, index) => {
    const imageKey = img.startsWith('http') ? `api-${index}` : img;
    return !shownImages.includes(imageKey);
  });
  
  // Reset if all images have been shown
  if (availableImages.length === 0) {
    setShownImages([]);
    availableImages = [...allImages];
  }
  
  // Select random image
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];
  
  // Mark as shown
  const imageKey = selectedImage.startsWith('http') 
    ? `api-${allImages.indexOf(selectedImage)}`
    : selectedImage;
  setShownImages(prev => [...prev, imageKey]);
  
  return selectedImage;
}

/**
 * Calculate points based on activity completion
 * @param {number} score - Activity score
 * @param {number} multiplier - Points multiplier (default: 1)
 * @returns {number} Points earned
 */
export function calculatePoints(score, multiplier = 1) {
  return Math.max(0, Math.floor(score * multiplier));
}

/**
 * Format time remaining (seconds to mm:ss)
 * @param {number} seconds - Seconds remaining
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
