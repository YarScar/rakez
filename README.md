# Rakez

Rakez is a hand-tracking interactive web app built with Next.js that blends sensorimotor activities, gamification, and light AI to help users practice focus, calm, and creativity.

## Highlights
- Hand-tracking activities using MediaPipe (Birthday Cake Candles, Note Match, Calming Flow).
- Daily AI-backed bonus task generated server-side and shown in a dashboard modal with an "ask" endpoint for follow-up questions.
- Safe Markdown rendering for AI answers via `react-markdown` + `rehype-sanitize` + `remark-gfm`.
- Persistence with Prisma + PostgreSQL; migrations live under `prisma/migrations`.

## Key Features & Where to Find Them
- Cake Candles (pinch-to-grab & drag, persistence, points): [src/app/activities/cake_candles/page.js](src/app/activities/cake_candles/page.js)
- Note Match (musical note matching + audio): [src/app/activities/note_match/page.js](src/app/activities/note_match/page.js)
- Calming Flow (breathing + gentle movement): [src/app/activities/calming_flow/page.js](src/app/activities/calming_flow/page.js)
- Daily AI task API: [src/app/api/daily-task/route.js](src/app/api/daily-task/route.js)
- Daily task "ask" endpoint: [src/app/api/daily-task/ask/route.js](src/app/api/daily-task/ask/route.js)
- Daily task modal / minimized widget: [src/components/DailyTaskModal.js](src/components/DailyTaskModal.js)
- Reusable cat image modal: [src/components/CatImageModal.js](src/components/CatImageModal.js)
- Prisma client helper: [src/lib/prisma.js](src/lib/prisma.js)
- API helpers and activity utilities: [src/lib/api-helpers.js](src/lib/api-helpers.js), [src/lib/activity-utils.js](src/lib/activity-utils.js)

## Important Files
- `package.json` — scripts & dependencies: [package.json](package.json)
- App entry & pages: [src/app](src/app)
- API routes: [src/app/api](src/app/api)
- Prisma schema & migrations: [prisma/schema.prisma](prisma/schema.prisma), [prisma/migrations](prisma/migrations)
- ESLint config: [eslint.config.mjs](eslint.config.mjs)

## Environment Variables
- `DATABASE_URL` — Postgres connection string used by Prisma
- `OPENAI_API_KEY` — optional; required for AI-powered endpoints (`/api/daily-task` and `/api/daily-task/ask`)

## Local Development
1. Install dependencies
```bash
npm install
```
2. Create a `.env` file with at least:
```
DATABASE_URL=postgresql://... 
OPENAI_API_KEY=sk-...
```
3. Run Prisma migrations (adjust for your environment/provider):
```bash
npx prisma migrate deploy
```
4. Optional: seed demo users
```bash
node scripts/seed-user.js
node scripts/seed-lp-staff.js
```
5. Start development server
```bash
npm run dev
```

## Linting
Run ESLint autofix:
```bash
npm run lint -- --ext .js,.jsx,.ts,.tsx src --fix
```

## Notes & Current Status
- Daily tasks are created server-side and deduplicated per UTC day; see [src/app/api/daily-task/route.js](src/app/api/daily-task/route.js).
- AI responses are sanitized and rendered as Markdown in the modal component.
- The `FINGER_MUSIC` activity was removed from the UI; a safe Prisma migration to remove the enum value is staged in `prisma/migrations`.
- Camera-based activities require a secure context (localhost or HTTPS).

## Next Steps I Can Help With
- Start dev server and smoke-test activities (requires webcam access).
- Finish any remaining lint/cleanup tasks (convert `<img>` to `next/image`, remove unused code).
- Add DB uniqueness constraint for daily tasks if you want enforced DB-level dedupe.

---

If you'd like the README shortened, expanded, or tailored for contributors or admins, tell me which audience to target and I'll update it.
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
