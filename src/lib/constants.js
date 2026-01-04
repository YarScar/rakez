/**
 * Application-wide constants
 */

// Encouraging messages for notifications
export const ENCOURAGING_MESSAGES = [
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

// Musical notes frequencies (C major scale)
export const MUSICAL_NOTES = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88,
  C2: 523.25
};

// Cat meme sources - local and API
export const CAT_IMAGE_SOURCES = {
  LOCAL: [
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
  ],
  API_BASE: 'https://cataas.com/cat',
  API_COUNT: 5
};

// Activity types (match Prisma enum values)
export const ACTIVITY_TYPES = {
  NOTE_MATCH: 'NOTE_MATCH',
  CAKE_CANDLES: 'CAKE_CANDLES',
  CALMING_FLOW: 'CALMING_FLOW',
  FINGER_MUSIC: 'FINGER_MUSIC'
};

// Activity default durations (in seconds)
export const ACTIVITY_DURATIONS = {
  DEFAULT: 30,
  SHORT: 15,
  MEDIUM: 30,
  LONG: 60
};

// Points rewards
export const POINTS = {
  TASK_COMPLETE: 10,
  ACTIVITY_COMPLETE: 20,
  SURVEY_COMPLETE: 50,
  DAILY_STREAK: 5
};

// Badge thresholds
export const BADGE_THRESHOLDS = {
  MASTER: { count: 50, emoji: "🏆", title: "Master", color: "#FFD700" },
  EXPERT: { count: 25, emoji: "⭐", title: "Expert", color: "#C0C0C0" },
  ACHIEVER: { count: 10, emoji: "🎯", title: "Achiever", color: "#CD7F32" },
  BEGINNER: { count: 0, emoji: "🌟", title: "Beginner", color: "#4F46E5" }
};

// MediaPipe Hands configuration
export const MEDIAPIPE_CONFIG = {
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
};

// Hand landmark connections for drawing
export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 13], [13, 17], [0, 17],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20]
];
