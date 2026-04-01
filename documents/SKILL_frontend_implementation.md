# SKILL: Frontend Implementation
> For: IJT Examination System
> Reference alongside SKILL_stitch_workflow.md for all UI work

---

## Component Patterns

### Button Variants
```tsx
// Primary — red filled (Submit, Next, Save)
<button className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-semibold 
  rounded-xl py-3 px-6 transition-all duration-200">
  Submit
</button>

// Secondary — white outlined blue (Back, Go Back)
<button className="w-full bg-white border-2 border-[#1A73E8] text-[#1A73E8] 
  font-semibold rounded-xl py-3 px-6 transition-all duration-200 hover:bg-[#E8F0FE]">
  Back
</button>

// Ghost — outlined red (Review Answers)
<button className="border-2 border-[#E53935] text-[#E53935] font-semibold 
  rounded-xl py-3 px-6 transition-all duration-200 hover:bg-[#FFEBEE]">
  Review Answers
</button>
```

### Input Field
```tsx
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-[#1A1A2E]">Field Label</label>
  <input
    className="w-full border border-[#E0E0E0] rounded-xl px-4 py-3 text-base 
      text-[#1A1A2E] placeholder-[#6B7280] outline-none
      focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20
      transition-all duration-200"
    placeholder="Placeholder text"
  />
  {/* Error state */}
  <span className="text-xs text-[#E53935]">Error message here</span>
</div>
```

### White Card
```tsx
<div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(26,115,232,0.12)] p-8">
  {/* content */}
</div>
```

### Option Row (MCQ)
```tsx
// Unselected
<div className="flex items-center gap-3 w-full border border-[#E0E0E0] rounded-xl 
  px-4 py-3 cursor-pointer transition-all duration-200
  hover:border-[#1A73E8] hover:bg-[#E8F0FE]">
  <div className="w-5 h-5 rounded-full border-2 border-[#E0E0E0] flex-shrink-0" />
  <span className="text-base text-[#1A1A2E] font-normal">Option text</span>
</div>

// Selected
<div className="flex items-center gap-3 w-full border border-[#E53935] rounded-xl 
  px-4 py-3 cursor-pointer transition-all duration-200 bg-[#FFF5F5]">
  <div className="w-5 h-5 rounded-full border-2 border-[#E53935] bg-[#E53935] 
    flex-shrink-0 flex items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-white" />
  </div>
  <span className="text-base text-[#1A1A2E] font-medium">Option text</span>
</div>
```

### Pass/Fail Badge
```tsx
// Pass
<span className="bg-[#E8F5E9] text-[#2E7D32] font-semibold px-5 py-2 rounded-xl text-sm">
  PASSED
</span>

// Fail
<span className="bg-[#FFEBEE] text-[#E53935] font-semibold px-5 py-2 rounded-xl text-sm">
  FAILED
</span>
```

### Modal Overlay
```tsx
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
    {/* content */}
  </div>
</div>
```

### Admin Warning Banner
```tsx
// Yellow — students registered
<div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 
  flex items-center gap-2 text-amber-800 text-sm font-medium">
  ⚠️ {count} students are registered. Avoid editing questions once exam starts.
</div>

// Red — exam live
<div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 
  flex items-center gap-2 text-red-800 text-sm font-medium">
  🔴 Exam is live. Do not modify questions.
</div>
```

---

## Page Layout Patterns

### Blue Background with Card (Register / Login / Admin Login)
```tsx
<main className="min-h-screen bg-[#1A73E8] flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(26,115,232,0.12)] 
    p-8 w-full max-w-md">
    {/* card content */}
  </div>
</main>
```

### Exam Page Layout
```tsx
<>
  {/* Fixed Navbar */}
  <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E0E0E0] 
    shadow-sm h-16 flex items-center justify-between px-6">
    <img src={logoUrl} alt="IJT" className="h-10 object-contain" />
    <span className="font-medium text-[#1A1A2E] hidden sm:block">
      Islami Jamiat Talba — Examination
    </span>
    <Timer />
  </nav>

  {/* Progress */}
  <div className="fixed top-16 left-0 right-0 z-30 bg-white px-6 py-3 
    border-b border-[#E0E0E0]">
    <div className="flex justify-between text-sm text-[#6B7280] font-medium mb-2">
      <span>Page {currentPage} of {totalPages}</span>
      <span>{answeredCount} of {totalQuestions} answered</span>
    </div>
    <div className="w-full h-1.5 bg-[#E0E0E0] rounded-full">
      <div 
        className="h-full bg-[#1A73E8] rounded-full transition-all duration-300"
        style={{ width: `${(currentPage / totalPages) * 100}%` }}
      />
    </div>
  </div>

  {/* Content */}
  <main className="pt-32 pb-24 min-h-screen bg-[#F5F5F5] px-4 sm:px-6 max-w-3xl mx-auto">
    {/* question cards */}
  </main>

  {/* Navigation buttons */}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] 
    px-6 py-4 flex gap-3 max-w-3xl mx-auto">
    {/* Back / Next / Submit */}
  </div>
</>
```

### Admin Layout
```tsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="w-64 bg-[#0D47A1] flex flex-col fixed h-full z-40
    -translate-x-full md:translate-x-0 transition-transform duration-200">
    {/* nav items */}
  </aside>
  
  {/* Main */}
  <main className="flex-1 md:ml-64 bg-[#F5F5F5] min-h-screen p-6">
    {/* content */}
  </main>
</div>
```

---

## Responsive Rules

Always add these checks after implementing each page:

```
Mobile (375px):
- Cards: full width, p-4 instead of p-8
- Navbar center text: hidden on mobile (sm:block)
- Buttons: full width stacked
- Option rows: ensure text wraps cleanly
- Admin sidebar: hidden by default, hamburger toggle

Tablet (768px):
- Cards: max-w-md centered
- Exam page: max-w-2xl content
- Admin sidebar: visible
```

---

## Tailwind Config Additions

Add to `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      blue: {
        primary: '#1A73E8',
        dark: '#0D47A1',
        light: '#E8F0FE',
      },
      red: {
        accent: '#E53935',
        hover: '#C62828',
      },
      grey: {
        light: '#F5F5F5',
        border: '#E0E0E0',
      },
      text: {
        dark: '#1A1A2E',
        muted: '#6B7280',
      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    borderRadius: {
      xl: '12px',
      '2xl': '20px',
    },
    boxShadow: {
      card: '0 4px 24px rgba(26, 115, 232, 0.12)',
      hover: '0 8px 32px rgba(26, 115, 232, 0.2)',
    }
  }
}
```

---

## Answer Review Color Logic

```tsx
const getOptionStyle = (option: string, questionId: string) => {
  const selected = studentAnswers[questionId];
  const correct = correctAnswers[questionId];
  
  if (option === correct) {
    return 'border-green-500 bg-green-50'; // always show correct in green
  }
  if (option === selected && selected !== correct) {
    return 'border-red-500 bg-red-50'; // wrong selection in red
  }
  return 'border-[#E0E0E0] bg-white'; // neutral
};

const getIcon = (option: string, questionId: string) => {
  const selected = studentAnswers[questionId];
  const correct = correctAnswers[questionId];
  
  if (option === correct) return '✓'; // green checkmark
  if (option === selected && selected !== correct) return '✗'; // red X
  return null;
};
```

---

*Skill v1.0 — DS Studio*
