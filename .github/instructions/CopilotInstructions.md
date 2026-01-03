---
applyTo: '**'
---
# 🖐️ Rakez — GitHub Copilot Instructions

**Purpose:** Help Copilot understand the Rakez app structure, features, and intended behavior so it can generate accurate React, Next.js, CSS, and Prisma code snippets.  

---

## 1. Project Overview

Rakez is a **hand-based interactive web app** that improves focus, creativity, and emotional well-being. Core ideas:

- Users interact with the app using **hand gestures** tracked via **Mediapipe**.  
- Activities are **personalized** via a survey and AI-generated recommendations.  
- The app has **gamified progress**: points, streaks, and achievements.  
- Admin dashboard allows **feature control, analytics, and activity management**.  

**Copilot guidance:** Assume all features are hand-gesture-centric, focusing on React components, Next.js pages, state management, and Prisma/Neon database integration.

---

## 2. Code Conventions / Best Practices

- Use **React functional components** and **hooks**.  
- No TypeScript or Tailwind CSS — only plain **CSS modules or standard CSS**.  
- Use **Next.js pages** and **API routes** for backend endpoints.  
- Use **Prisma ORM** for database queries, connected to **Neon PostgreSQL**.  
- Keep components **modular and reusable**, especially for activity cards, dashboards, and hand-tracking UI.  
- Include **comments describing logic**, especially around Mediapipe integration and AI personalization.

---

## 3. Component Guidance

### Hand Activity Component
- **Inputs:** Activity type, duration, gestures, instructions  
- **Outputs:** Real-time gesture detection, points, feedback messages  
- **UI:** Webcam feed, gesture outlines, sound or visual feedback  
- **Behavior:** Map gestures to actions, track points and streaks  

**Copilot prompt example:**  
> Generate a React component for a hand activity using Mediapipe. Show live webcam feed, overlay hand outlines, display points, timer, and floating encouragement messages.

---

### Dashboard
- **Greeting:** “Hey [Name]! 👋”  
- **Stats:** Current streak, points, energy  
- **Activity Cards:** 3–5 randomized daily activities  
- **Navigation:** Dashboard | Activities | Progress | Settings  

**Copilot prompt example:**  
> Create a dashboard React component showing a greeting, streak, points, and 3–5 activity cards with shuffle button. Include bottom navigation.

---

### Activity Completion Screen
- Display: checkmark ✓, points, achievements, motivational message  
- Buttons: `Next Activity` or `Back to Dashboard`  
- Optional: Show a reward (fun fact, meme, or video)  

**Copilot prompt example:**  
> Build a React component for activity completion showing points, streak, achievements, and reward message. Include navigation buttons.

---

### Personalization Survey
- **6-step survey:** Career stage, energy, biggest struggle, tone preference, movement comfort, confirmation  
- **State:** Save responses to database via Prisma  
- **UI:** Progress bar, step navigation  

**Copilot prompt example:**  
> Generate a multi-step React survey form. Store responses using Prisma, show progress bar, and include step navigation.

---

### Admin Dashboard
- **Metrics:** Active users, activities completed, engagement  
- **Analytics:** Charts (line, bar), sortable tables  
- **Feature Management:** Add/edit/delete activities, toggle active/inactive  
- **Logs:** Admin audit table, export CSV  

**Copilot prompt example:**  
> Build an admin dashboard page with metrics cards, activity table with edit/delete, sortable user log table, and filterable analytics charts.

---

## 4. Database Guidance

- Use **Prisma schema** for tables:
  - `UserProfile`: name, email, avatar, preferences, streak, points  
  - `HandActivity`: type, gestures, duration, difficulty  
  - `ActivitySession`: userId, activityId, points, completionTime  
  - `Achievement`: name, criteria, unlocked  
  - `AdminLogs`: adminId, action, details, timestamp  

**Copilot prompt example:**  
> Generate a Prisma schema for users, hand activities, sessions, achievements, and admin logs with relationships.

---

## 5. Styling & UI

- Use **plain CSS** or **CSS modules**  
- Layouts: Responsive, clean, playful, gamified  
- Colors: Bright and engaging for activities, calm for meditation flows  
- Floating feedback messages, timers, badges, and points should be **visually prominent**  

---

## 6. AI & Personalization

- Store survey responses and activity results  
- Use AI to suggest next activity or encouragement messages  
- Keep it modular so backend endpoints can provide personalized tips  
- Copilot can generate **pseudo-AI functions** that can later be replaced with real logic  

**Copilot prompt example:**  
> Write a function that takes user preferences and past activity points and returns a suggested next activity.

---

## 7. Real-time Hand Tracking

- Use **Mediapipe Hands**  
- Detect gestures and map to activity events  
- Provide **real-time feedback** visually and aurally  
- Maintain **performance for web browsers**  

**Copilot prompt example:**  
> Create a React hook for Mediapipe hand tracking that returns hand landmarks, gestures, and detection status.

---

## 8. Notes for Copilot

- Always assume **Rakez is hand-gesture focused**  
- Prioritize **modular components**, **user personalization**, and **progress tracking**  
- Use **Neon + Prisma** for persistence  
- Avoid TypeScript or Tailwind  
- Use descriptive variable and function names (e.g., `activitySession`, `handLandmarks`)  
- Include **UI/UX hints in comments** for playful and engaging interactions
