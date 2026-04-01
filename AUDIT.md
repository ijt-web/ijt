

---

## Security & Anti-Cheating Audit [NEW]

### 🔴 HIGH: Lack of Server-Side Time Validation
**Problem:** The `submit` API does not check how long a student spent on the exam. A bot or user with a script could submit 50 correct answers in 1 second without trigger.
**Recommendation:** Implement a "Minimum Time Requirement" (e.g., 2-3 minutes) in the submission API.

### 🟡 MEDIUM: Incomplete tab-switching detection
**Problem:** Current code uses `visibilitychange`. If a user uses a split-screen (another window focused but exam tab visible), it does not trigger.
**Recommendation:** Add `window.onblur` listeners to detect focus loss.

### 🟡 MEDIUM: User Interactivity Controls
**Problem:** Users can right-click to search questions or copy/paste text into AI tools.
**Recommendation:** Disable `contextmenu`, `copy`, and `paste` events on the exam page.

### 🟡 MEDIUM: Hardcoded JWT Defaults
**Problem:** `lib/jwt.ts` provides fallback secrets if ENV variables are missing. This is a security risk in production.
**Recommendation:** Throw an error if `JWT_SECRET` is missing in production environments.

### 🟢 OK: Question Sanitization
**Audit:** Confirmed that `app/api/exam/questions/route.ts` correctly strips `correctOption` before sending the payload to the frontend. No direct leaks found.
