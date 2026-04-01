# IJT Examination System — Full Product Spec v2
> Client: Islami Jamiat Talba (IJT)
> Built by: DS Studio
> Stack: Next.js 14 + Supabase + Prisma + Vercel
> Target: Antigravity IDE + Claude Opus for implementation

---

## 1. What This System Does

An online MCQ examination system for IJT's charity education program. Students register, sit a timed MCQ exam on screen, and receive an instant auto-graded result with a personal answer review. The admin has full control over questions, exam config, and branding — no developer needed after deployment.

**Scale:** ~400 concurrent students
**Classes:** 9 and 10 only
**Cost:** PKR 0 — fully free tier

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| Connection Pooling | Supabase PgBouncer (port 6543) |
| ORM | Prisma |
| File Storage | Supabase Storage (logo upload) |
| Auth | Manual JWT (jose library) |
| CSV Parsing | PapaParse |
| Font | Poppins (Google Fonts) |
| Hosting | Vercel (free tier) |

---

## 3. Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // pooled — port 6543
  directUrl = env("DIRECT_URL")         // direct — port 5432
}

// Auto-increments roll number on registration
model Student {
  id         String   @id @default(cuid())
  rollNumber Int      @unique @default(autoincrement())
  name       String
  fatherName String
  studentId  String   @unique  // login username
  password   String            // bcrypt hashed
  class      String            // "9" or "10"
  createdAt  DateTime @default(now())
  result     Result?
}

// Questions per class — admin managed
model Question {
  id            String          @id @default(cuid())
  class         String          // "9" or "10"
  questionText  String
  optionA       String
  optionB       String
  optionC       String
  optionD       String
  correctOption String          // "A" | "B" | "C" | "D"
  createdAt     DateTime        @default(now())
  answers       AttemptAnswer[]
}

// One global config — applies to all students regardless of class
model ExamConfig {
  id                String  @id @default(cuid())
  durationMinutes   Int     @default(55)
  passingPercentage Float   @default(50)
  logoUrl           String? // Supabase Storage public URL
  orgName           String  @default("Islami Jamiat Talba")
}

// Written ONCE on submit — never during exam
model Result {
  id         String          @id @default(cuid())
  studentId  String          @unique
  student    Student         @relation(fields: [studentId], references: [id])
  marks      Int             // number of correct answers
  total      Int             // total questions in exam
  percentage Float           // (marks/total) * 100
  passed     Boolean
  submittedAt DateTime       @default(now())
  answers    AttemptAnswer[]
}

// Stores selected option letter only — written once on submit
model AttemptAnswer {
  id             String   @id @default(cuid())
  resultId       String
  result         Result   @relation(fields: [resultId], references: [id])
  questionId     String
  question       Question @relation(fields: [questionId], references: [id])
  selectedOption String   // "A" | "B" | "C" | "D"
}
```

**Total tables: 4** — Student, Question, ExamConfig, Result, AttemptAnswer

**DB writes per student: 2**
1. Registration → Student record
2. Submit → Result + AttemptAnswers (single transaction)

Everything else (answers, timer, questions) lives in React state + session only.

---

## 4. Design System

### Colors
```css
--blue-primary:   #1A73E8;   /* Main blue */
--blue-dark:      #0D47A1;   /* Hover states */
--blue-light:     #E8F0FE;   /* Option hover background */
--red-accent:     #E53935;   /* CTAs, selected options, timer warning */
--red-hover:      #C62828;   /* Red hover */
--white:          #FFFFFF;
--grey-light:     #F5F5F5;   /* Page background */
--grey-border:    #E0E0E0;   /* Borders */
--text-dark:      #1A1A2E;   /* Primary text */
--text-muted:     #6B7280;   /* Secondary text */
--green-pass:     #2E7D32;   /* Pass badge text */
--green-pass-bg:  #E8F5E9;   /* Pass badge background */
--red-fail-bg:    #FFEBEE;   /* Fail badge background */
```

### Typography
```css
font-family: 'Poppins', sans-serif;
/* Weights: 400, 500, 600, 700 */
```

### Vibe
Formal, elegant, minimal. Not government-ugly, not startup-flashy. Understated authority. Every element earns its place.

---

## 5. Pages

### 5.1 Registration Page

**Layout:** Full `--blue-primary` background. Single white card centered on screen.

**Card (top to bottom):**
- IJT logo (small, 64px, from admin upload)
- Heading: "Student Registration" — Poppins 700
- Subtext: "Islami Jamiat Talba Examination System" — Poppins 400, muted
- Divider
- Fields: Full Name, Father's Name, Student ID, Password, Class (dropdown: Class 9 / Class 10)
- Submit button — full width, red, Poppins 600

**Behavior:**
- If student ID already exists in DB → show login page instead (do not show registration again)
- All fields required
- Password minimum 6 characters
- Inline validation errors in red below each field
- On success → navigate to Splash Screen

**Responsive:** Card full width with padding on mobile

---

### 5.2 Login Page

**Layout:** Same as registration — white card on full blue background.

**Card:**
- IJT logo (small)
- Heading: "Welcome Back"
- Fields: Student ID, Password
- Login button — full width, red

**Behavior:**
- On success → navigate to Splash Screen
- If result already exists for this student → navigate directly to Result Page (no re-taking)

---

### 5.3 Splash Screen

**Purpose:** Full screen branded loading screen. Fetches and preloads all questions into React state while displaying. Student sees branding, system gets ready silently.

**Layout:** Full screen, `--blue-primary` background.

**Center content:**
- IJT logo (120px) with breathing pulse animation:
  ```css
  @keyframes breathe {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.75; transform: scale(0.96); }
  }
  animation: breathe 2.8s ease-in-out infinite;
  ```
- Red spinning ring around logo (160px, border-top red, rest transparent):
  ```css
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  animation: spin 1.2s linear infinite;
  ```
- Org name below: Poppins 600, white, letter-spacing 0.05em
- Subtext: "Preparing your examination..." — Poppins 400, white 70% opacity

**Logic:**
- On mount → fetch questions for student's class from `/api/exam/questions`
- Shuffle questions using seeded Fisher-Yates (seed = studentId)
- Store in React state
- Minimum display time: 1.5 seconds (aesthetic)
- Once fetch complete AND 1.5s passed → navigate to Exam Page
- On fetch error → show retry button

---

### 5.4 Exam Page

**Layout:** `--grey-light` full page background. Fixed navbar top.

**Navbar (fixed, white, border-bottom):**
- Left: IJT logo (40px height)
- Center: "Islami Jamiat Talba — Examination" — Poppins 500
- Right: Timer

**Timer:**
- Format: MM:SS
- Color: `--text-dark` when > 5 minutes
- Color: `--red-accent` + subtle pulse when ≤ 5 minutes
- Hits 00:00 → auto-submit (bypasses unanswered check — submits whatever is answered)
- Timer value pulled from ExamConfig.durationMinutes
- Stored in sessionStorage — survives accidental refresh

**Progress Bar (below navbar):**
- "Page X of Y" text — Poppins 500, muted
- Thin bar, blue fill, grey track

**Question Cards (10 per page):**
- White card, shadow, rounded corners, padding 32px
- Question number: "Q1." — Poppins 700, blue
- Question text: Poppins 500, dark, line-height 1.7

**Options (A, B, C, D):**
- Full width clickable rows
- Default: white bg, grey border
- Hover: `--blue-light` bg, blue border
- Selected: `#FFF5F5` bg, red border, red radio fill
- Transition: smooth 0.2s

**Pagination:**
- 10 questions per page
- Total pages = Math.ceil(totalQuestions / 10)
- All answers held in React state — zero DB calls during exam

**Navigation buttons:**
- Back: white bg, blue border + text — hidden on page 1
- Next: red bg, white text — hidden on last page
- Submit: red bg, white text — only on last page

**Skipping behavior:**
- Student CAN move between pages without answering all questions
- Unanswered questions tracked in state
- Next page: allowed even with blanks
- Submit pressed with unanswered questions anywhere:
  - Block submission
  - Show: "You have X unanswered questions. Please answer all questions before submitting."
  - Highlight which page(s) have blanks

**Confirmation modal (before final submit — all answered):**
- Overlay 40% black
- White card, rounded
- "Are you sure you want to submit? This cannot be undone."
- "Go Back" (outlined) + "Submit Exam" (red filled)

**Responsive:**
- Question cards full width on mobile
- Options stack vertically
- Buttons full width on mobile
- Timer always visible in navbar

---

### 5.5 Result Page

**Layout:** White page, centered card (max-width 480px).

**Card (top to bottom):**
- IJT logo (64px, centered)
- Student name — Poppins 700, large
- Roll No · Student ID · Class — Poppins 400, muted, small
- Divider
- Score: large percentage — Poppins 700, blue
- "X out of Y correct" — Poppins 400, muted
- Pass/Fail badge:
  - PASS: green bg, green text
  - FAIL: red bg, red text
- "Passing mark: X%" — muted, small
- Divider
- "Review Answers" button — outlined blue, Poppins 600
- Note: "Please show this screen to the invigilator." — italic, muted

---

### 5.6 Answer Review Page

**Layout:** White page, scrollable list of question cards.

**Each question card:**
- Question number + text
- 4 options displayed
- Student's selected option:
  - If correct → highlighted green (bg + border + checkmark icon)
  - If wrong → highlighted red (bg + border + X icon)
- If wrong → correct option also highlighted green so student knows the right answer
- Simple, clean, no clutter

**Back button** at top to return to Result Page.

---

### 5.7 Admin Login Page

**Layout:** White card on full blue background.

**Card:**
- Heading: "Admin Panel"
- Subtext: "Islami Jamiat Talba"
- Password field only
- Login button — red, full width

**Auth:** Password compared against `process.env.ADMIN_PASSWORD`. Returns admin JWT stored in httpOnly cookie.

---

### 5.8 Admin Dashboard

**Layout:** Sidebar navigation + main content area. Sidebar collapses to hamburger on mobile.

**Sidebar items:**
- Exam Settings
- Class 9 Questions
- Class 10 Questions
- Results
- Logout

---

#### Exam Settings

Fields (all editable, saved to ExamConfig):
- Exam Duration (minutes) — number input
- Passing Percentage (%) — number input 0–100
- Organization Name — text input
- Logo Upload — file input (PNG/JPG → Supabase Storage → saves public URL)

Save button — red.
Shows current saved values on load.

---

#### Question Management (Class 9 / Class 10 — same UI)

**Live banner (top of page):**
- If students registered but no results yet:
  `⚠️ X students are registered. Avoid editing questions once exam starts.`
- If results exist (exam in progress):
  `🔴 Exam is live. Do not modify questions.`
- Yellow/red background respectively. Informational only — does not block.

**Two modes side by side: Manual + CSV**

**Manual Add:**
- Form: Question Text (textarea), Option A/B/C/D (inputs), Correct Answer (dropdown A/B/C/D)
- Save Question button — red
- Edit: click edit on any question → populates form → save updates record
- Delete: confirmation prompt → removes question

**CSV Bulk Import:**
- "Import from CSV" button
- Expected format (header row ignored):
  ```
  question,option_a,option_b,option_c,option_d,correct
  Who wrote the law of gravity?,Newton,Tesla,Einstein,Merlin,A
  ```
- "Download CSV Template" button — downloads pre-filled example file
- On upload:
  - Parse client-side with PapaParse
  - Validate: all 6 columns present, correct is A/B/C/D only
  - Show editable preview table — admin can fix errors inline before saving
  - Rows with errors highlighted red with reason
  - "Confirm Import" → POST to `/api/admin/questions/bulk`
  - On success → question list refreshes, shows count added

**Question list** (below both forms):
- Shows all questions for this class
- Each row: question preview + Edit + Delete buttons
- CSV-imported and manually-added questions appear identically

---

#### Results Panel

Table columns: Roll No · Name · Class · Marks · Total · Percentage · Pass/Fail · Submitted At

Features:
- Sort by any column
- Filter by class or pass/fail
- Export to CSV button (client-side)
- Each row has "View Review" — opens that student's answer review in a modal

---

## 6. API Routes

### Student Auth
```
POST /api/auth/register
Body: { name, fatherName, studentId, password, class }
- Check studentId not already taken
- Hash password (bcrypt, 10 rounds)
- Create Student (rollNumber auto-increments)
- Return JWT + rollNumber

POST /api/auth/login
Body: { studentId, password }
- Verify password
- If Result exists for student → return { redirect: 'result' }
- Return JWT
```

### Exam
```
GET /api/exam/questions
Headers: Bearer JWT
- Verify token, extract class
- Fetch all questions for that class
- Shuffle with seeded Fisher-Yates (seed = studentId)
- Return questions WITHOUT correctOption field

POST /api/exam/submit
Headers: Bearer JWT
Body: { answers: [{ questionId, selectedOption }] }
- Verify token
- Check Result doesn't already exist (prevent double submit)
- Fetch correct answers from DB
- Calculate: marks, total, percentage, passed
- Single transaction: create Result + all AttemptAnswers
- Return { marks, total, percentage, passed, rollNumber, name, class }
```

### Admin
```
POST /api/admin/login
Body: { password }
- Compare with process.env.ADMIN_PASSWORD
- Return admin JWT (httpOnly cookie)

GET  /api/admin/config
POST /api/admin/config
- Get or update ExamConfig

POST /api/admin/logo
- Multipart upload → Supabase Storage bucket "logos"
- Update ExamConfig.logoUrl

GET    /api/admin/questions?class=9
POST   /api/admin/questions
PUT    /api/admin/questions/[id]
DELETE /api/admin/questions/[id]

POST /api/admin/questions/bulk
Body: { class, questions: [{questionText, optionA, optionB, optionC, optionD, correctOption}] }
- Validate all rows server-side
- prisma.question.createMany()
- Return { inserted: N }

GET /api/admin/results
- Return all Results joined with Student
- Include AttemptAnswers joined with Questions for review modal

GET /api/health
- Returns 200 OK
- Used by cron-job.org ping to prevent Supabase free tier sleep
```

---

## 7. Key Logic

### Fisher-Yates Seeded Shuffle
```ts
// lib/shuffle.ts
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let hash = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(hash) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```
Every student gets a different question order. Same student always gets same order (consistent on refresh).

### Timer
```ts
// On exam mount
const examEndTime = Date.now() + durationMinutes * 60 * 1000;
sessionStorage.setItem('examEndTime', examEndTime.toString());

// Every second
const remaining = parseInt(sessionStorage.getItem('examEndTime')!) - Date.now();
if (remaining <= 0) autoSubmit();
```
sessionStorage survives page refresh. Timer never resets unless session is cleared.

### Scoring
```ts
const correct = answers.filter(a => {
  return questionsMap[a.questionId].correctOption === a.selectedOption;
}).length;

const percentage = (correct / total) * 100;
const passed = percentage >= config.passingPercentage;
```

### Submit Transaction
```ts
await prisma.$transaction([
  prisma.result.create({
    data: { studentId, marks: correct, total, percentage, passed }
  }),
  prisma.attemptAnswer.createMany({
    data: answers.map(a => ({
      resultId,
      questionId: a.questionId,
      selectedOption: a.selectedOption
    }))
  })
]);
```

---

## 8. Folder Structure

```
/app
  /page.tsx                          → redirect to /register
  /register/page.tsx
  /login/page.tsx
  /splash/page.tsx
  /exam/page.tsx
  /result/page.tsx
  /review/page.tsx
  /admin/
    /login/page.tsx
    /dashboard/page.tsx
  /api/
    /auth/register/route.ts
    /auth/login/route.ts
    /exam/questions/route.ts
    /exam/submit/route.ts
    /admin/login/route.ts
    /admin/config/route.ts
    /admin/logo/route.ts
    /admin/questions/route.ts
    /admin/questions/[id]/route.ts
    /admin/questions/bulk/route.ts
    /admin/results/route.ts
    /health/route.ts

/components
  /ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Modal.tsx
    Badge.tsx
  /exam/
    QuestionCard.tsx
    OptionRow.tsx
    Timer.tsx
    ProgressBar.tsx
  /admin/
    Sidebar.tsx
    QuestionForm.tsx
    CSVImport.tsx
    ResultsTable.tsx
  /layout/
    Navbar.tsx
    SplashScreen.tsx

/lib
  prisma.ts         → Prisma singleton
  jwt.ts            → sign/verify helpers
  supabase.ts       → Supabase storage client
  shuffle.ts        → seeded Fisher-Yates

/prisma
  schema.prisma

/.env.local
```

---

## 9. Environment Variables

```env
# Supabase — use pooled URL for app, direct for migrations
DATABASE_URL="postgresql://postgres:[pass]@db.[ref].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[service_role_key]"

# Auth
JWT_SECRET="[random 32+ char string]"
ADMIN_JWT_SECRET="[different random 32+ char string]"

# Admin
ADMIN_PASSWORD="[set before deployment]"
```

---

## 10. Build Sessions for Antigravity

Build in this exact order. Do not skip ahead. Each session produces a working layer before the next begins.

---

### SESSION 1 — Inner Frame (Project Foundation)
*Goal: Working project that connects to DB. Nothing visual yet.*

1. Init Next.js 14 project with App Router + Tailwind CSS
2. Install dependencies: `prisma`, `@prisma/client`, `bcryptjs`, `jose`, `papaparse`, `@supabase/supabase-js`
3. Add Poppins font via Google Fonts in `layout.tsx`
4. Set up Tailwind config with full design token colors (all CSS variables as Tailwind values)
5. Create `/prisma/schema.prisma` — full schema as specified
6. Set up `.env.local` with all environment variables (placeholders)
7. Create `lib/prisma.ts` — Prisma singleton
8. Create `lib/jwt.ts` — sign and verify helpers for student JWT and admin JWT
9. Create `lib/shuffle.ts` — seeded Fisher-Yates
10. Create `lib/supabase.ts` — Supabase storage client
11. Run `npx prisma migrate dev --name init`
12. Verify DB connection works

**Checkpoint:** Project runs locally, DB connected, no errors.

---

### SESSION 2 — Structural Frame (Auth + API Layer)
*Goal: All API routes working and testable.*

1. `POST /api/auth/register` — register student, return JWT
2. `POST /api/auth/login` — login, handle already-submitted redirect
3. `GET /api/exam/questions` — fetch + shuffle questions, strip correct answers
4. `POST /api/exam/submit` — score + single transaction save
5. `POST /api/admin/login` — hardcoded password check, return admin JWT cookie
6. `GET/POST /api/admin/config` — get and update ExamConfig
7. `POST /api/admin/logo` — upload to Supabase Storage
8. `GET/POST/PUT/DELETE /api/admin/questions` + `[id]` — full CRUD
9. `POST /api/admin/questions/bulk` — createMany with validation
10. `GET /api/admin/results` — full results with student + answers joined
11. `GET /api/health` — returns 200

**Checkpoint:** All routes testable via Postman or curl. No frontend yet.

---

### SESSION 3 — Outer Frame (Shared UI Components)
*Goal: Reusable component library built and styled.*

1. `Button.tsx` — variants: primary (red), secondary (white/outlined), ghost
2. `Input.tsx` — with label, error state, focus ring
3. `Card.tsx` — white card with shadow and radius
4. `Modal.tsx` — overlay + centered card + close behavior
5. `Badge.tsx` — pass (green) and fail (red) variants
6. `Navbar.tsx` — logo left, title center, slot right (for timer)
7. `ProgressBar.tsx` — blue fill, grey track, label above
8. `Timer.tsx` — MM:SS display, red + pulse when ≤ 5 min, sessionStorage logic, auto-submit callback
9. `SplashScreen.tsx` — full blue screen, logo + breathing animation + red spinner ring + text

**Checkpoint:** All components render correctly in isolation. Storybook not needed — just verify visually.

---

### SESSION 4 — Armor Layer 1 (Student Flow)
*Goal: Full student journey working end to end.*

1. Registration page — white card on blue, full form, validation, submit → splash
2. Login page — same layout, credentials, redirect logic
3. Splash page — animation plays, questions fetched in background, navigates to exam
4. Exam page — navbar + timer + progress + paginated question cards + option selection + navigation buttons + unanswered warning + confirmation modal
5. Result page — score card, pass/fail badge, roll number, review button
6. Answer review page — all questions listed, green/red highlighting, correct answer shown on wrong

**Checkpoint:** Register a student, take full exam, see result, review answers. Everything works.

---

### SESSION 5 — Armor Layer 2 (Admin Panel)
*Goal: Admin can fully configure and manage the exam.*

1. Admin login page
2. Admin middleware — protect all `/admin` routes, redirect to login if no valid cookie
3. Dashboard layout — sidebar + content area + mobile hamburger
4. Exam Settings section — config form + logo upload
5. Question Management — manual add/edit/delete + CSV import with preview table + download template button + live banner
6. Results panel — sortable table + filter + CSV export + view review modal

**Checkpoint:** Admin logs in, uploads logo, sets config, adds questions manually and via CSV, views results.

---

### SESSION 6 — Reinforcement (Polish + Deploy)
*Goal: Production ready.*

1. Loading states on all buttons and API calls
2. Error handling — all API errors show user-friendly messages
3. Mobile responsiveness pass — test all pages at 375px
4. Prevent back navigation during exam (warn user if they try to leave)
5. Seed one ExamConfig record on first run if none exists (default values)
6. Deploy to Vercel — add all env variables in dashboard
7. Create Supabase Storage bucket named `logos` set to public
8. Run `npx prisma migrate deploy` on production DB
9. Set up cron-job.org — ping `[your-domain]/api/health` every 3 days
10. Admin end-to-end test on live URL before exam day

**Checkpoint:** Live URL works. Admin sets up exam. One student completes full flow on production.

---

## 11. Pre-Exam Day Checklist (For Admin)

- [ ] Log into admin panel on live URL
- [ ] Upload IJT logo
- [ ] Set exam duration and passing percentage
- [ ] Add all Class 9 questions (manual or CSV)
- [ ] Add all Class 10 questions (manual or CSV)
- [ ] Do a test run — register one fake student, take exam, check result
- [ ] Brief the invigilators — students show result screen, invigilator notes roll no + marks

---

*Spec v2.0 — DS Studio*
