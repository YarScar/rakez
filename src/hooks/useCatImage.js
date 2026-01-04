import { useState, useCallback } from 'react';

/**
 * Custom hook for managing randomized cat images without duplicates
 * Combines local images with API images and tracks shown images
 * @returns {Object} - { getRandomCatImage, resetShownImages }
 */
export function useCatImage() {
  const [shownCatImages, setShownCatImages] = useState([]);

  const getRandomCatImage = useCallback(() => {
    // Combine local images and API images
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
  }, [shownCatImages]);

  const resetShownImages = useCallback(() => {
    setShownCatImages([]);
  }, []);

  return { getRandomCatImage, resetShownImages };
}
