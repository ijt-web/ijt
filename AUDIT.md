# Project Review: IJT Assessment System — Audit Against Spec

## Issues Found & Fixes Applied

### 🔴 CRITICAL: Folder Structure Mismatch (Spec Section 8)

**Problem:** The spec uses FLAT routes (`/register/page.tsx`, `/login/page.tsx`, `/splash/page.tsx`, etc.) — NOT a `(student)` route group. The current `(student)` group layout nests all student pages under a layout with a permanent blue background + splash screen on EVERY navigation, which breaks the exam page (needs grey bg, not blue).

**Fix:** Move pages out of `(student)/` into flat `/app/` routes per the spec's folder structure.

---

### 🔴 CRITICAL: Missing Splash Page (Spec Section 5.3)

**Problem:** The spec defines a SEPARATE `/splash/page.tsx` that pre-fetches questions and navigates to `/exam`. Instead, the splash was embedded in the student layout (wrong). The splash should:
1. Fetch questions for the student's class
2. Show for minimum 1.5 seconds
3. Navigate to `/exam` once both conditions are met

**Fix:** Create a standalone `/splash/page.tsx` per spec.

---

### 🟡 MEDIUM: Registration redirects to `/instructions` (Spec says → Splash)

**Problem:** Spec Section 5.1 says "On success → navigate to Splash Screen". Current code redirects to `/instructions` which doesn't exist in the spec either.

**Fix:** Redirect to `/splash` on successful registration/login.

---

### 🟡 MEDIUM: Instructions page doesn't exist in spec

**Problem:** There is no `/instructions` page defined in the spec (Section 8). The spec flow is:
Register → Splash (loads questions) → Exam → Result → Review

**Fix:** Remove the instructions page. The exam rules can optionally be shown on the splash/exam intro, but the spec doesn't list a separate instructions page. We'll keep basic rules within the splash page.

---

### 🟡 MEDIUM: Timer uses wrong sessionStorage key (Spec Section 7)

**Problem:** Spec says `sessionStorage.setItem('examEndTime', ...)` using millisecond-based `Date.now()`. Timer component uses `exam_end_time` with second-based timestamps.

**Fix:** Align Timer keys and logic with spec exactly.

---

### 🟡 MEDIUM: SplashScreen animation doesn't match spec (Section 5.3)

**Problem:** Spec defines specific animation values:
- breathe: `opacity: 0.75; transform: scale(0.96)` at 50%, duration `2.8s`
- spin: duration `1.2s` (not 8s), `border-top red, rest transparent` (not dashed border)

**Fix:** Update globals.css keyframes to match spec exactly.

---

### 🟢 MINOR: Splash text doesn't match spec

**Problem:** Spec says show org name + "Preparing your examination..." below the logo. Current splash says "Starting Assessment".

**Fix:** Update text.

---

### 🟢 MINOR: Login page heading doesn't match spec

**Problem:** Spec Section 5.2 says heading should be "Welcome Back". Current code says "Student Login".

**Fix:** Update heading text.

---

### 🟢 MINOR: Registration subtext doesn't match spec

**Problem:** Spec says subtext: "Islami Jamiat Talba Examination System". Current says "Please enter your details to begin the assessment".

**Fix:** Update subtext.
