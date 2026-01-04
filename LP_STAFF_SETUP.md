# LP Staff Setup - Quick Guide

## ✅ What's Done:

1. **Role-Based Authentication (RBA)** implemented
2. **LP_STAFF role** added to database
3. **Rubric page** (`/rubric`) - Protected, LP staff only
4. **Reflection page** (`/reflection`) - Protected, LP staff only
5. Both pages redirect to login if unauthorized

## 🔑 LP Staff Accounts:

**These emails automatically get LP_STAFF role when signing up:**

1. **Rob**: rob@launchpadphilly.org / **lpuser1**
2. **Sanaa**: sanaa@launchpadphilly.org / **lpuser2**  
3. **Taheera**: taheera@launchpadphilly.org / **lpuser3**

*Note: LP staff can use any password length (no 8 character minimum)*

Sign up at `/signup` and they'll immediately have access to `/rubric` and `/reflection`.

## 📄 Protected Pages:

- `/rubric` - Rubric Evidence (CCC.1.1, CCC.1.2, CCC.1.3)
- `/reflection` - Project Reflection

Both show user info when logged in as LP staff.
