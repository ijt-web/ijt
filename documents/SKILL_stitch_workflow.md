# SKILL: Stitch + Antigravity Design Workflow
> For: IJT Examination System
> Use this skill for all UI/frontend work in Sessions 3, 4, and 5

---

## What Stitch Is

Google Stitch is an AI UI design tool connected to Antigravity via MCP. It generates high-fidelity screens from prompts, exports a `DESIGN.md` (called "Design DNA") with all tokens — colors, fonts, spacing, components — and lets Antigravity fetch that design context to implement pixel-perfect React/Tailwind code.

The workflow is: **Prompt Stitch → Get Design DNA → Antigravity implements from it**

---

## Step 1: Generate Screens in Stitch

Before building any page, generate it in Stitch first using the design system from `IJT_EXAM_SYSTEM_SPEC_V2.md` Section 4.

Open Stitch and use these prompts per page:

### Registration Page
```
Formal, minimal exam registration page for a charity education program called Islami Jamiat Talba. 
White card centered on a solid bright blue (#1A73E8) full-screen background. 
Card contains: small logo top center, heading "Student Registration", muted subtext, 
a form with fields for Full Name, Father's Name, Student ID, Password, and a Class dropdown. 
Full-width red (#E53935) submit button at bottom. 
Font: Poppins. Clean, elegant, understated authority. No gradients, no shadows on background.
```

### Splash Screen
```
Full screen loading splash for an exam system. Solid bright blue (#1A73E8) background.
Center: circular logo placeholder (120px) with a red spinning ring around it (160px diameter).
Below logo: org name "Islami Jamiat Talba" in white Poppins 600, letter-spacing wide.
Below that: "Preparing your examination..." in white at 70% opacity, Poppins 400 small.
Minimal, formal, elegant. No other elements.
```

### Exam Page
```
Online MCQ exam page, formal and minimal. Light grey (#F5F5F5) background.
Fixed white navbar: logo left, "Islami Jamiat Talba — Examination" center, timer MM:SS right.
Below navbar: thin blue progress bar with "Page 1 of 4" label.
Main content: white question cards with subtle shadow. Question number in blue bold, question text below.
4 option rows per question: full width, bordered, with radio button left. 
Selected state: light red tint background, red border, red radio fill.
Bottom: Back button (white/outlined blue) left, Next button (red filled) right.
Font: Poppins. Clean, no clutter.
```

### Result Page
```
Exam result page, formal minimal. White background.
Centered card (max 480px): small logo top, student name large bold, 
roll number + class small muted below.
Large percentage score in blue. "X out of Y correct" muted below.
Pass badge: green background green text. Fail badge: red background red text.
Passing mark info small muted. 
"Review Answers" outlined blue button. 
"Please show this screen to the invigilator" italic muted note at bottom.
Poppins font. Formal, clean.
```

### Answer Review Page
```
Answer review page after exam. White background, scrollable.
Each question in a card: question text, 4 options listed.
Correct answer highlighted green (light green bg, green border, checkmark icon).
Wrong selected answer highlighted red (light red bg, red border, X icon).
If student was wrong, correct answer also shows green highlight.
Back button top left, outlined blue.
Poppins font. Clean and clear.
```

### Admin Dashboard
```
Admin panel for an exam management system. Clean sidebar layout.
Left sidebar: dark blue (#0D47A1) background, white nav items — Exam Settings, Class 9 Questions, 
Class 10 Questions, Results, Logout at bottom. Small logo top of sidebar.
Main content area: white, light grey page bg.
Exam Settings section: clean form with labeled inputs for duration, passing %, org name, logo upload.
Red save button. Formal, minimal, professional.
```

---

## Step 2: Extract Design DNA

After generating each screen in Stitch:

1. Open the screen in Stitch
2. Click your profile → Stitch Settings → API Key → Create Key → Copy it
3. In Antigravity → Agent Panel → `...` → MCP Servers → Search "Stitch" → Install
4. In the agent, run:
```
Use the Stitch MCP to fetch the Design DNA for the [page name] screen.
Extract all design tokens: colors, fonts, spacing, border radius, shadow values, component patterns.
Store these in a DESIGN.md file at the root of the project.
```

---

## Step 3: Implement from Design DNA

Once `DESIGN.md` exists, tell Antigravity:

```
Read DESIGN.md and IJT_EXAM_SYSTEM_SPEC_V2.md Section 4 and 5.
Implement the [page name] page as a Next.js page component using Tailwind CSS.
Match the Stitch design exactly — pixel perfect.
Use the color tokens from DESIGN.md mapped to the CSS variables in the spec.
Font: Poppins via Google Fonts (already set up in layout.tsx from Session 1).
Do not use any UI component libraries. Tailwind only.
```

---

## Step 4: Vibe Check

After each page is implemented:

1. Open Antigravity's integrated browser
2. Compare side by side with the Stitch screen
3. If anything is off, tell the agent:
```
The [element] doesn't match the Stitch design. 
The Stitch version has [describe difference]. Fix it.
```

---

## Animations (Not from Stitch — implement manually)

Stitch won't capture animations. After implementing each page, add these manually:

### Splash Screen — Logo Breathe
```css
@keyframes breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(0.96); }
}
/* Apply to logo: animation: breathe 2.8s ease-in-out infinite; */
```

### Splash Screen — Red Spinner Ring
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* Ring: 160x160px circle, border: 3px solid transparent, border-top: 3px solid #E53935 */
/* animation: spin 1.2s linear infinite; */
```

### Timer Warning Pulse (≤ 5 minutes)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
/* Apply to timer text when remainingMs <= 300000 */
/* color: #E53935; animation: pulse 1s ease-in-out infinite; */
```

### Option Select Transition
```css
/* All option rows: transition: all 0.2s ease; */
/* Handles smooth color change on select/hover */
```

---

## Key Rules When Implementing from Stitch

1. **Colors** — always use the CSS variables from spec Section 4, not hardcoded hex values. Map Stitch tokens to variables.
2. **Font** — Poppins only. Weights: 400, 500, 600, 700. Already loaded in `layout.tsx`.
3. **No UI libraries** — if Stitch generated any shadcn or MUI-looking components, rewrite them in plain Tailwind.
4. **Responsive** — after implementing desktop, always do a mobile pass at 375px width.
5. **Stitch is reference, spec is law** — if Stitch output conflicts with `IJT_EXAM_SYSTEM_SPEC_V2.md`, follow the spec.

---

## Which Sessions Use This Skill

| Session | Use Stitch For |
|---|---|
| Session 3 | Generate all screens in Stitch, extract DESIGN.md, build shared components from it |
| Session 4 | Implement each student page referencing DESIGN.md |
| Session 5 | Implement admin pages referencing DESIGN.md |
| Session 6 | Vibe check all pages against Stitch screens |

Sessions 1 and 2 are backend only — Stitch is not needed.

---

*Skill v1.0 — DS Studio*
