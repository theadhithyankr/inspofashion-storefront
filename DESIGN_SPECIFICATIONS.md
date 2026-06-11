# Design Specifications - Lifestyle Redesign

## Hero Section Specifications

### Desktop Layout (1024px+)
```
┌──────────────────────────────────────────┐
│ Logo    Nav              Search  Cart    │ ← Header (h-20)
├──────────────────────────────────────────┤
│                                          │
│  Content (50%)       │   Image (50%)    │ ← Hero Section (h-screen)
│  ├─ "Timeless        │                  │
│  │  Comfort."        │   Your uploaded  │
│  ├─ "Everyday        │   image here     │
│  │  Elegance."       │   (Full cover)   │
│  ├─ Line separator   │                  │
│  ├─ Description      │                  │
│  └─ Buttons          │                  │
│     [Black] [Border] │                  │
│                                          │
└──────────────────────────────────────────┘
```

### Mobile Layout (< 640px)
```
┌───────────────────┐
│ ☰  Search  Cart   │ ← Header (h-16)
├───────────────────┤
│                   │
│   Your Image      │ ← Hero Section (full screen)
│   (Full width)    │   Image covers all
│                   │
│   On top/bottom:  │
│   Content area    │   Title, Description
│                   │   Buttons
│                   │
└───────────────────┘
```

### Colors
- **Background:** White (#FFFFFF)
- **Text:** Black (#000000)
- **Buttons:** Black primary, black border secondary

### Typography
- **Title Line 1:** Playfair Display, text-5xl (mobile) → text-6xl (desktop)
- **Title Line 2:** Playfair Display, text-5xl (mobile) → text-6xl (desktop)
- **Description:** Inter, text-sm, uppercase, letter-spacing-[0.15em]

### Spacing
- **Mobile:** px-6 (horizontal), py-12 (vertical)
- **Desktop:** px-12 (horizontal), py-12 (vertical)

---

## Header Specifications

### Layout
```
┌────────────────────────────────────────────┐
│ Logo │ Navigation │ Search │ Cart          │
└────────────────────────────────────────────┘
```

### Elements

#### Logo (Left)
- **Font:** Playfair Display, italic
- **Size:** text-xl (mobile) → text-2xl (desktop)
- **Color:** Black
- **Text:** "Inspofashions"

#### Navigation (Center - Desktop only)
- **Items:** Women's | New Arrivals | Bestsellers
- **Font:** Inter, uppercase
- **Size:** text-xs
- **Spacing:** gap-12
- **Hover:** text-opacity change, smooth 300ms transition

#### Search & Cart (Right)
- **Icons:** Lucide React (Search, ShoppingBag)
- **Size:** h-5 w-5
- **Hover:** Background change to light gray
- **Cart Badge:** Black background, white text, position -right-1 -top-1

### Responsive
- **Mobile:** Hamburger menu replaces center navigation
- **Desktop:** Full navigation visible
- **Sticky:** Always visible at top (sticky top-0 z-40)

### Colors
- **Background:** White
- **Text:** Black
- **Borders:** Light gray (#E0E0E0)
- **Hover:** Light gray background (#F5F5F5)

---

## Product Card Specifications

### Layout
```
┌─────────────────┐
│                 │
│   Image         │ ← aspect-3/4
│   (aspect 3:4)  │   Hover: scale-105
│                 │
└─────────────────┘
Product Name
Category    Price
Colors count
```

### Dimensions
- **Aspect Ratio:** 3:4 (portrait)
- **Background:** Light gray (#F5F5F5)

### Typography
- **Title:** Playfair Display, text-base (mobile) → text-lg (desktop)
- **Category:** Inter, text-xs, uppercase, gray
- **Price:** Inter, text-sm, bold, black

### Hover Effects
- **Image:** scale-105 over 500ms
- **Title:** Opacity change

### States
- **Normal:** Full opacity
- **Hover:** Image scales up slightly
- **Sold Out:** Grayscale filter, reduced opacity

---

## Product Grid Specifications

### Responsive Breakpoints
```
Mobile (< 640px):
  grid-cols-2
  gap-4

Tablet (640px - 1024px):
  md:grid-cols-3
  md:gap-8

Desktop (1024px+):
  lg:grid-cols-4
  lg:gap-10
```

### Spacing
- **Mobile:** gap-4 (16px)
- **Tablet:** gap-8 (32px)
- **Desktop:** gap-10 (40px)

---

## Collections Section Specifications

### Layout
```
"Collections" label
"Shop by mood" heading

┌───────┬───────┐
│   1   │   2   │ ← 2 cards per row
└───────┴───────┘
┌───────┬───────┐
│   3   │   4   │
└───────┴───────┘
```

### Desktop: 2×2 Grid
```
┌─────────────┬─────────────┐
│   Card 1    │   Card 2    │
│  (wider)    │  (wider)    │
├─────────────┼─────────────┤
│   Card 3    │   Card 4    │
│             │             │
└─────────────┴─────────────┘
```

### Card Specifications
- **Aspect Ratio:** Square (1:1)
- **Hover:** Image zoom scale-105, overlay opacity change
- **Overlay:** 20% black on hover
- **Text Position:** Bottom-left
- **Text Color:** White

### Typography
- **Title:** Playfair Display, text-2xl (mobile) → text-3xl (desktop)
- **Description:** Inter, text-sm, white/90

---

## Footer Specifications

### Layout
```
┌────────────────────────────────────────┐
│ Logo        Shop   Help   Brand        │
│ Description Links  Links  Links        │
│ Email       Links  Links  Links        │
├────────────────────────────────────────┤
│ © 2026 Inspofashions                   │
└────────────────────────────────────────┘
```

### Grid
```
Desktop (1024px+):
  md:grid-cols-4
  - Logo section: md:col-span-1
  - Links sections: 3 columns

Mobile:
  Single column layout
```

### Colors
- **Background:** White
- **Text:** Black and gray
- **Borders:** Light gray (#E0E0E0)
- **Links Hover:** Black text, smooth transition

### Typography
- **Logo:** Playfair Display, text-2xl
- **Section Titles:** Inter, text-xs, uppercase, gray
- **Links:** Inter, text-sm

---

## Color Palette

### Primary Colors
```
Black           #000000
White           #FFFFFF
Light Gray      #F5F5F5
Border Gray     #E0E0E0
Text Gray       #666666
```

### Usage
- **Primary Text:** Black (#000000)
- **Secondary Text:** Gray (#666666)
- **Backgrounds:** White or Light Gray
- **Borders:** Border Gray
- **Hover States:** Light Gray background

### Monochrome Scale
```
#000000  (100% black)
#333333  (80% black)
#666666  (60% black)
#999999  (40% black)
#CCCCCC  (20% black)
#F5F5F5  (Light gray/near white)
#FFFFFF  (100% white)
```

---

## Typography System

### Font Stack
- **Display:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, modern)

### Size Scale
```
Heading 1:  text-6xl (96px)  - Hero titles
Heading 2:  text-5xl (60px)  - Section titles
Heading 3:  text-4xl (36px)  - Card titles
Heading 4:  text-2xl (24px)  - Subtitles
Heading 5:  text-lg (18px)   - Product names
Body:       text-sm (14px)   - Descriptions
Caption:    text-xs (12px)   - Meta info
```

### Letter Spacing
```
Uppercase labels:  tracking-[0.15em]
Buttons:          tracking-[0.15em]
Normal text:      tracking-normal
```

### Line Height
```
Headings:  leading-[1.1]  (Tight)
Body:      leading-6      (Relaxed)
```

---

## Spacing System

### Section Padding
```
Mobile (< 640px):
  py-20 (80px top/bottom)

Tablet (640px - 1024px):
  sm:py-28 (112px)

Desktop (1024px+):
  md:py-36 (144px)

Horizontal:
  px-6 (mobile)
  sm:px-8
  lg:px-12 (desktop)
```

### Component Spacing
```
Gap (between items):
  - grid-cols-2 gap-4 (mobile)
  - gap-8 (tablet)
  - lg:gap-10 (desktop)

Margins:
  mb-4, mb-6, mb-8 (between sections)

Padding:
  p-4, p-6, p-8 (inside components)
```

---

## Interactive Elements

### Buttons

#### Primary Button
```
Background: Black (#000000)
Text: White
Padding: px-8 py-3
Font: Bold, uppercase, text-xs
Letter-spacing: tracking-[0.15em]

Hover:
  Background: Black/80 opacity
  Transition: 300ms smooth
```

#### Secondary Button
```
Background: Transparent
Border: 2px black
Text: Black
Padding: px-8 py-3
Font: Bold, uppercase, text-xs

Hover:
  Background: Black
  Text: White
  Transition: 300ms smooth
```

### Links
```
Default:  Black text, no underline
Hover:    Gray text, smooth 300ms transition
Focus:    Ring-2 ring-black ring-offset-2
```

---

## Animations

### Page Load
```
Hero image:   No animation (static)
Content:      fadeIn 0.8s ease-out
              (Opacity 0 → 1)
```

### Hover Effects
```
Product image:      scale-105, 500ms ease-out
Collection card:    scale-105, 500ms ease-out
Button:             Color change, 300ms
Link:               Opacity change, 300ms
Menu:               slideInMenu 260ms ease-out
Cart:               slideInCart 260ms ease-out
```

### Transitions
```
Duration:  300-500ms (smooth, not jarring)
Easing:    ease-out (feels responsive)
```

---

## Responsive Behavior

### Breakpoints
```
Mobile:   < 640px (sm:)
Tablet:   640px - 1024px (md:)
Desktop:  1024px+ (lg:)
```

### Key Changes by Device

#### Mobile
- Single column layouts
- Hamburger menu
- Full-width hero image
- Stacked buttons
- Text-center for mobile hero

#### Tablet
- 2-3 column grids
- Hamburger menu (until lg)
- Improved spacing
- Multi-line navigation possible

#### Desktop
- 4-column grid
- Full navigation visible
- 50% content + 50% image hero
- Maximum spacing
- Optimized reading width

---

## Accessibility

### Color Contrast
```
Black on White: 21:1 (AAA standard ✅)
Gray on White: 7:1 (AA standard ✅)
```

### Touch Targets
```
Minimum size: 44px × 44px
Buttons: 48-56px
Links: 40-48px
```

### Focus States
```
Focus ring:    2px solid black
Ring offset:   2px
Visible on:    Keyboard navigation
```

---

## Performance

### Image Optimization
- **Format:** WebP with JPEG fallback
- **Sizes:** Responsive images at breakpoints
- **Loading:** Priority on hero image, lazy on others

### CSS/JS
- **CSS:** Tailwind (minimal, optimized)
- **JS:** Next.js (code-split, lazy-loaded)
- **Animations:** GPU-accelerated transforms

---

**Design specifications are complete and implementation-ready.**
