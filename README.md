# 🖐️ Rakez

**Rakez** is a hand-based interactive app designed to improve focus, creativity, and emotional well-being through playful, sensorimotor exercises. Using hand tracking technology, users engage in fun activities that are personalized, gamified, and mentally beneficial.

---

## Table of Contents

- [Overview](#overview)
- [Phases & Wireframe Flow](#phases--wireframe-flow)
  - [Phase 1: Onboarding & Personalization](#phase-1-onboarding--personalization)
  - [Phase 2: Core App Experience](#phase-2-core-app-experience)
  - [Phase 3: Admin Dashboard](#phase-3-admin-dashboard)
- [Key Interaction Flows](#key-interaction-flows)
- [Data Persistence](#data-persistence)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

Rakez leverages **hand-based interaction** to engage users in playful exercises that:

- Activate the sensorimotor cortex  
- Improve focus and energy  
- Encourage creativity and self-expression  
- Provide immediate feedback, gamification, and rewards  

By connecting mind and body, Rakez makes mental and emotional training enjoyable and measurable.

---

## Phases & Wireframe Flow

### Phase 1: Onboarding & Personalization

1. **Home Page (Not Logged In)**
   - App name & logo, big welcome message, short pitch
   - Buttons: `Get Started` (new users), `Log In` (existing users)
   - Navigation: About, Why Rakez, Features
   - Footer: Copyright, Privacy Policy, Contact
   - Purpose: Front door, guiding users to sign up or learn more

2. **About Page**
   - Highlights student stress, burnout, screen fatigue
   - Uses real-world scenarios & statistics
   - CTA: `See the Solution`

3. **Why Rakez? (Solution Page)**
   - Explains hand-based interaction benefits
   - AI personalization overview
   - Micro-rewards & humor
   - Visual "How it Works" flow
   - CTA: `Continue to Features`

4. **Features Page**
   - Birthday Cake Candles, Calming Flow, Energy Boost, Cognitive Games
   - Expressive Play, AI guidance, Task tracking, Achievements
   - Admin role-based access
   - CTA: `Create Account`

5. **Sign Up / Login**
   - Email & password input, strength indicator
   - Confirm password (signup), T&Cs checkbox
   - Optional: Social auth (Google)
   - CTA: `Create Account` or `Log In`

6. **Personalization Survey (6 Steps)**
   - Career stage, Energy level, Biggest struggle
   - Preferred tone, Movement comfort, Confirmation
   - Progress bar shows completion

---

### Phase 2: Core App Experience

7. **Main Dashboard**
   - Greeting: `Hey [Name]! 👋`
   - Quick stats: Current streak, Points this week, Energy level
   - Daily activities: 3–5 randomized activity cards, shuffle option
   - Bottom navigation: Dashboard | Activities | Progress | Settings

8. **Hand Activity (Core Interaction)**
   - Activity header: Name + instructions
   - Main content: Webcam feed, hand detection status, gesture visualization
   - Activity-specific UI:
   - Birthday Cake Candles → pinch & place candles  
     - Calming Flow → breathing animation  
     - Energy → speed meter & bursts  
     - Games → pattern display  
     - Expressive → abstract canvas/trails
   - Controls: Timer, score/points, Pause/Exit
   - Real-time feedback with floating encouragement

9. **Activity Completion Screen**
   - Celebration: Checkmark ✓, `Activity Complete! 🎉`
   - Summary: Points, streak, achievements, stats comparison
   - Rewards: Fun fact, meme, or motivational message
   - Next actions: `Next Activity` or `Back to Dashboard`

10. **Progress Tracker**
    - Stats overview: Streaks, total activities, points
    - Visual charts: Weekly activity, energy trends
    - Achievements: Badges (locked/unlocked), Personal bests

11. **Settings / Profile**
    - Avatar, name, email, preferences (tone, movement comfort, energy level)
    - Notifications: Daily reminders, preferred time
    - Data & Privacy: Download data, delete account, logout

---

### Phase 3: Admin Dashboard (Role-Based)

12. **Admin Overview**
    - Metrics: Active users, activities completed, engagement %
    - Navigation: Overview | Users | Activities | Analytics
    - Quick actions: View analytics, action logs

13. **Analytics Dashboard**
    - Filters: Date, activity type, user segment
    - Metrics: Hand sessions, average duration, popular activities
    - Charts: Line & bar, retention curve
    - Data table: sortable user activity logs

14. **Feature Management**
    - Activity table: Edit/Delete, Active/Inactive toggle
    - Feature flags & difficulty sliders
    - Quick actions: Add new activity

15. **Activity Editor**
    - Fields: Name, Type, Description, Difficulty, Duration, Gesture requirements, Status
    - Live preview, buttons: Save | Cancel | Delete

16. **Admin Logs**
    - Audit table: Admin name, action, details, timestamp, status
    - Filters: Admin user, action type, date
    - Export: CSV download

---

## Key Interaction Flows

1. **Hand Activity Recognition:**  
   MediaPipe → Gesture mapped → Real-time feedback → Score updates  

2. **Personalization:**  
   Survey responses stored → AI schedules personalized activities & tips  

3. **Progress System:**  
   Activity completion → Points awarded → Streaks → Achievements → Rewards  

4. **Admin Control:**  
   Feature toggles → Activity difficulty → User analytics → Log audit trail  

---

## Data Persistence

All user and admin data stored in **Neon PostgreSQL** via **Prisma**:

- User Profiles & Preferences  
- Hand Activity Sessions  
- Tasks & Achievements  
- Admin Logs  

---

## Tech Stack

- **Frontend:** Next.js, React, JavaScript, CSS  
- **Backend / Database:** Node.js, Prisma ORM, Neon (PostgreSQL)  
- **Hand Tracking:** Mediapipe Hands  
- **Other Tools:** Web Audio API, Canvas API  

---

## Installation

1. Clone repository:

```bash
git clone https://github.com/yourusername/rakez.git
cd rakez
