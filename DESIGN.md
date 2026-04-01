# Design DNA: The Scholastic Monolith

This document defines the visual language for the **IJT Assessment System**, extracted from high-fidelity Stitch designs.

## 1. Creative North Star: "The Architectural Monolith"
- **Philosophy**: Authority through stability and intentional negative space.
- **The Monolith**: Primary content (forms, questions) lives in centered white cards that feel heavy and grounded.
- **Depth**: Achieved through **Tonal Layering**, not decorative shadows or 1px borders.
- **Contrast**: High-tension triad of Institutional Blue, Academic Red, and Neutral Surfaces.

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary (Red)** | `#E53935` | High-priority CTAs (Submit, Save), Success states. |
| **Secondary (Blue)** | `#1A73E8` | Full-screen backgrounds, focused environments. |
| **Dark Blue** | `#0D47A1` | Admin Sidebar, Institutional headers. |
| **Surface** | `#F9F9FB` | Page backdrops, recessed areas. |
| **Monolith** | `#FFFFFF` | Core content cards, interactive elements. |
| **Ink** | `#1A1C1D` | Primary text (90% opacity for legibility). |
| **Muted** | `#414754` | Labels, subtext, instructions. |

## 3. Typography (Poppins)
- **Display**: 3.5rem (`text-6xl`). Tight leading (1.1x). Used for Hero moments.
- **Headline**: 1.5rem (`text-2xl`). Used for Card titles.
- **Body**: 0.875rem (`text-sm`). Workhorse for forms and lists.
- **Label**: Uppercase, tracking-wide. Used for metadata and categories.

## 4. Structural Rules
- **No-Divider Rule**: Strictly forbid 1px solid horizontal lines. Separate sections using background color shifts (e.g., White to Light Grey) or the Spacing Scale.
- **Border Radius**: 
  - `lg` (8px) for buttons and inputs.
  - `2xl` (20px) for the Monolith Cards.
- **Shadows**: Only for "Floating" elements (Modals). Use extra-diffused ambient shadows: `0px 20px 40px rgba(0, 25, 69, 0.06)`.

## 5. Components DNA

### Buttons
- **Primary**: Full-width, Solid Red, White text.
- **Secondary**: Outline Blue, White background.
- **Ghost**: Outline Red, Transparent background.

### Cards
- Pure White, `rounded-2xl`, deep padding (`p-10` or `p-12`).

### Form Fields
- Understated. Light grey (`surface_container_low`) background.
- Label sits 0.5rem above the field.

### Progress Bar
- Blue fill (`#1A73E8`), light grey track. Thin (4px).
