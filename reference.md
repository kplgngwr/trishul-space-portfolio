# Project Reference: Trishul Space Portfolio

> **Quick-context file** – read this instead of scanning the whole repo.

This project is a React-based web application for **Trishul Space**, built with TypeScript + Vite. It follows the **Feature-Sliced Design (FSD)** architecture.

---

## 🛠 Tech Stack

| Layer        | Technology                       |
|------------- |----------------------------------|
| Framework    | React 19.2+                      |
| Language     | TypeScript ~5.9.3                |
| Build Tool   | Vite 7.2.4                       |
| Styling      | CSS Modules (Vanilla CSS) + Tailwind CSS 4.1.18 |
| Animations   | Framer Motion 12.23.26           |
| 3D Graphics  | Three.js 0.182.0, React Three Fiber 9.5.0, React Three Drei 10.7.7 |
| Animation Library | Anime.js 4.2.2                |
| State & Data | React Query (@tanstack/react-query 5.90.16) |
| Form & Validation | Zod 4.3.4                   |
| Routing      | React Router DOM 7.11.0          |
| Error Handling | React Error Boundary 6.0.1      |
| Deployment   | Vercel (`vercel.json` SPA rewrite)|
| Fonts        | Rajdhani (display), Play (body)   |
| Linting      | ESLint 9.39.1 with TypeScript support |

---

## 📁 Source Structure (`src/`)

### `app/` — Application Shell
| File              | Purpose                                              |
|-------------------|------------------------------------------------------|
| `App.tsx`         | Root component — lazy routes + `<Suspense>` wrappers |
| `Layout.tsx`      | Shared layout: Header → `<Outlet>` → Footer         |
| `styles/index.css`| Global design tokens, reset, utility classes         |

### `pages/` — Route-level Components
Each folder maps to a route in `App.tsx`.

| Folder         | Route              | Key Component        | Status           |
|----------------|--------------------|----------------------|------------------|
| `Home/`        | `/`                | `HomePage.tsx`       | ✅ Active        |
| `milestone/`   | `/milestone`       | `MilestonePage.tsx`  | ✅ Active        |
| `Team/`        | `/team`            | `TeamPage.tsx`       | ✅ Active        |
| `Career/`      | `/career`          | `CareerPage.tsx`     | ✅ Active        |
| `Contact/`     | `/contact`         | `ContactPage.tsx`    | ✅ Active        |
| `pressRelease/`| `/pressRelease`    | `pressRelease.tsx`   | ✅ Active        |
| `Product/`     | `/product`         | `ProductPage.tsx`    | ⏸ Commented out  |
| `NotFound/`    | `*`                | `NotFoundPage.tsx`   | ✅ Active        |

### `widgets/` — Composable UI Sections
Each widget lives in `widgets/<name>/ui/<name>.tsx` with a barrel `index.ts`.

| Widget           | Used In        | Purpose                                                |
|------------------|----------------|--------------------------------------------------------|
| `header/`        | Layout         | Sticky nav bar with mobile menu                        |
| `footer/`        | Layout         | Site footer with links & socials                       |
| `hero/`          | HomePage       | Full-screen hero with stats & swipe ripple             |
| **`mission/`**   | **HomePage**   | **"Propulsion is the Bottleneck" — problem statement, stats (54%/60%/90%), engine visual, necessity bar** |
| **`product/`**   | **HomePage**   | **Harpy-1 engine showcase — 60/40 layout, variant switching (Vacuum/Ground), aerospace-grade specification rows, CTA hierarchy** |
| `about/`         | HomePage       | Company intro with gallery slider & stats              |
| `technology/`    | _(commented)_  | Technology showcase (to be included later)              |
| `test-facility/` | HomePage       | Test facility video section                            |
| `partners/`      | HomePage       | Partner logo strip                                     |
| `page-flip/`     | HomePage       | Stacked-card scroll animation wrapper                  |
| `roadmap/`       | _(unused)_     | Legacy — replaced by `milestone` page. Delete when ready |

### `entities/` — Business Data Models
Each entity has `model/` with `*.schema.ts` (types) and `*.data.ts` (static data).

| Entity          | Data it holds                              |
|-----------------|--------------------------------------------|
| `milestone/`    | Roadmap milestones + vision items          |
| `partner/`      | Partner company names & logos              |
| `pressRelease/` | News articles (title, body, date, images)  |
| `product/`      | **Product specs (thrust, propellant, cycle, ISP, burn), descriptions, variant images (WebP+PNG), Zod schema validation** |
| `team-member/`  | Team profiles (name, role, photo, links)   |

### `shared/` — Reusable Code
| Sub-folder     | Contents                                                     |
|----------------|--------------------------------------------------------------|
| `ui/`          | `Button`, `GlowCard`, `ErrorFallback`, icon components       |
| `lib/hooks/`   | `useIntersection`, `useScrollProgress`, `useTiltHover`, `useReducedMotion`, `useCountUp`, `useCardGlow`, `useMouseSwipe`, `usePageFlip`, `useScrollController`, `useSmoothScroll`, `useHashScroll` |
| `lib/animation/`| `fadeInUp`, `fadeInLeft`, `fadeInRight`, `scaleFade`, `staggerContainer`, `slideChange`, `getVariants()` |
| `lib/`         | `emailService.ts`, `useFormState.ts`                          |
| `config/`      | `constants.ts` — `NAV_ITEMS`, `HEADER_HEIGHT`, `BREAKPOINTS`, `ANIMATION` |

---

## 🧭 Navigation Config (`shared/config/constants.ts`)

```ts
export const NAV_ITEMS = [
  // { label: "Product", href: "/product" },  ← commented out
  { label: "Updates", href: "/pressRelease" },
  { label: "Milestone", href: "/milestone" },
  { label: "Team", href: "/team" },
  { label: "Career", href: "/career" },
] as const;
```

---

## 🏠 Home Page Section Order (`pages/Home/HomePage.tsx`)

```
PageFlipContainer:
  1. Hero              → widgets/hero
  2. Mission           → widgets/mission  ← Problem context
  3. Product           → widgets/product  ← NEW: Harpy-1 solution showcase
  4. (Technology)      → widgets/technology (commented out — later)
  5. About             → widgets/about

Outside PageFlipContainer:
  6. Test Facility     → widgets/test-facility
  7. Partners          → widgets/partners
```

---

## 🗂 Other Root Files

| File                | Purpose                                      |
|---------------------|----------------------------------------------|
| `index.html`        | Entry HTML with font links & meta tags       |
| `vite.config.ts`    | Vite config with `@/` alias                 |
| `vercel.json`       | SPA fallback rewrite for Vercel              |
| `.env`              | Environment variables                        |
| `tsconfig.*.json`   | TypeScript configuration                     |
| `eslint.config.js`  | ESLint flat config with TS support           |

---

## 🎨 Design System Tokens (defined in `styles/index.css`)

- **Colors:** `--color-brand-primary` (#1e40af blue), `--color-brand-accent` (#f97316 orange)
- **Surfaces:** `primary` (#fafbfc), `secondary` (#f1f5f9), `elevated` (#fff), `inverse` (#0f172a)
- **Typography:** Fluid clamp scales (`--text-fluid-xs` → `--text-fluid-hero`)
- **Fonts:** `--font-display` (Rajdhani), `--font-body` (Play)
- **Spacing:** 4px modular base (`--spacing-1` to `--spacing-32`)
- **Shadows:** `--shadow-sm` through `--shadow-xl`, glow variants
- **Global classes:** `.container`, `.section`, `.section-eyebrow`, `.text-gradient`, `.grid-2/3/4`

---

## 📐 Width, Content & Theme Structure

This project uses a layered width system rather than a single universal paragraph width. The goal is to keep sections readable on laptop screens while still allowing full-width composition when the layout needs it.

### Width Rules

- **Page container:** `.container` limits the page to `--container-max` with responsive side padding.
- **Desktop default:** `--container-max` is `1536px`, with `2rem` side padding.
- **Very large screens:** at `1920px+`, the container expands to `1800px` and padding increases to `4rem`.
- **Section wrappers:** full-width sections can still stretch edge-to-edge, but inner content should control its own measure.
- **Body copy:** the global `p` style caps text at `60ch` by default to preserve readability.
- **Intro headers / hero descriptions:** use a wider custom measure when the content needs to span a section more deliberately, then tighten again on smaller screens.
- **Grid content:** technical or card-based layouts should use the grid tracks themselves for width control instead of adding arbitrary nested max-widths.

### Practical Measure Targets

- **Editorial paragraphs:** `~55ch` to `60ch`
- **Compact product and technical descriptions:** `~42rem` to `68rem` depending on the section width and screen size
- **Section titles:** narrower than the supporting description so the heading remains visually anchored
- **Data rows and specs:** let the row grid define the width; avoid wrapping key values unnecessarily

### Typography Balance

- Keep line-height higher for long-form prose and tighter for technical labels or specification rows.
- Use centered alignment for intro sections where the page is introducing a section rather than listing dense content.
- Let the hierarchy communicate theme: eyebrow → title → description → structured content.
- Avoid oversized vertical gaps between title and copy; compact spacing feels more engineered and less editorial.

### Theme Structure Notes

- The visual language is intentionally aerospace-oriented: restrained spacing, blue/orange accents, soft surfaces, and minimal chrome.
- Section backgrounds alternate between `primary` and `secondary` surfaces to separate story beats without heavy borders.
- Dense technical sections should feel like instrument panels or spec sheets, not dashboard widgets.
- Large visual areas should remain embedded in the layout rather than floating in boxed panels unless a card treatment is explicitly needed.

### Section Examples in This Codebase

- **Hero:** wide, immersive, full-screen framing
- **Mission:** balanced intro + visual, with strong narrative width control
- **Product:** custom-width centered intro, then two-column technical layout
- **About:** wider text measure with gallery + stats
- **Team:** dedicated page flow that now starts with About content, then team profiles below

### Test Facility Section Pattern

- Use the standard container width for the primary content, matching the rest of the homepage rhythm.
- Keep the main facility video crisp and visually framed inside the centered container.
- Add a full-width blurred ambient video layer behind the content to preserve cinematic depth without widening the main readable area.
- Treat the background layer as atmosphere only: low opacity, softened, and edge-to-edge.
- Keep the foreground content aligned to the shared page grid so the section feels like part of the same system, not a separate full-bleed exception.
- Prefer restrained borders, subtle depth, and clean spacing over heavy masking or loud overlays.

---

## 📜 Conventions

1. **FSD layers:** `app → pages → widgets → entities → shared` (strict import direction)
2. **CSS Modules** for all component styling (`.module.css`)
3. **Barrel exports** (`index.ts`) at each folder boundary
4. **Lazy loading** all pages via `React.lazy()` in `App.tsx`
5. **Framer Motion** for animations with `useReducedMotion` support
6. **Error boundaries** around every widget in `HomePage`

### Page Composition Notes

- **Home page:** Hero → Mission → Product → Test Facility → Partners
- **Team page:** About section at the top, then Co-Founders and Mentors below
- Keep route-level composition in `pages/` and reusable section UI in `widgets/`

---

## 🚀 Development & Build

### Scripts (from `package.json`)
```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

### Key Configuration Files
- **`vite.config.ts`** — Vite setup with React plugin, Tailwind CSS, and `@/` import alias
- **`tsconfig.json`** & **`tsconfig.node.json`** — TypeScript configuration with strict mode
- **`eslint.config.js`** — ESLint flat config with TS support
- **`vercel.json`** — Deployment config with SPA rewrite (all routes → `index.html`)

---

## 📦 Public Assets Structure

| Folder          | Contents                                  |
|-----------------|-------------------------------------------|
| `favicon/`      | Icon variants (16x16, 32x32, 192x192, 512x512) |
| `hdr/`          | HDR environment maps for 3D scenes        |
| `models/`       | 3D model files                            |
| `products/`     | Product images                            |
| `partners/`     | Partner logos                             |
| `team/`         | Team member photos                        |
| `milestones/`   | Milestone imagery                         |
| `pressRelease/` | News article images                       |
| Root            | Logo files, favicon, meta images          |

---

## 🔧 Import Aliases

- `@/` → `./src/` (configured in `vite.config.ts`)
- All imports use absolute path patterns: `@/pages`, `@/widgets`, `@/shared/lib`, etc.

---

## 🎯 Widget Deep Dive: Mission Widget

**Location:** `src/widgets/mission/ui/mission.tsx`

### Purpose
Showcases the core industry problem: **"Propulsion is the Bottleneck"**

### Structure
```
Mission Component
├── Section Header (eyebrow, title, subtitle)
├── Main Grid (2-column layout)
│   ├── Left Side (Content)
│   │   └── Description + Stats Grid
│   │       ├── Stat Card 1: Launch Failures (54%)
│   │       ├── Stat Card 2: Vehicle Cost (60%)
│   │       └── Stat Card 3: Engineering Complexity (90%)
│   └── Right Side (Visual)
│       └── Image Frame
│           ├── Engine Image (/products/harpy-sketch-1.png)
│           └── Floating Annotation ("Indigenous Design")
└── Necessity Bar (bottom section with mission statement)
```

### Key Features
- **Enhanced Icon Components:** Custom SVG icons with gradient backgrounds, animated rings, and responsive scaling
- **Interactive Stat Cards:** Gradient backgrounds, hover animations with glow effects, and dynamic transform states
- **Responsive Grid:** 3-column layout on desktop, 2-column on tablet, single-column on mobile with side-by-side layout
- **Motion Variants:** Uses Framer Motion with `useReducedMotion` support
- **Intersection Observer:** Triggers animations when section enters viewport (threshold: 0.15)
- **Creative Hover Effects:** Icon scaling, card lift effect, gradient glows, and backdrop blur transitions

### Animation Variants Used
- `fadeInUp` — Header and necessity bar
- `fadeInLeft` — Left content side
- `fadeInRight` — Right visual side
- `scaleFade` — Individual stat cards
- `staggerContainer` — Overall animation orchestration

---

## 🎯 Widget Deep Dive: Product Widget

**Location:** `src/widgets/product/ui/product.tsx` + `src/widgets/product/ui/product.module.css`

### Purpose
Showcases **Harpy-1 cryogenic liquid engine** with professional aerospace-grade presentation, variant switching, and technical specifications.

### Architecture

**Data Source:** `entities/product/model/product.data.ts`
- Static product data with Zod schema validation
- Product specs array (thrust, propellant, cycle, ISP, burn)
- Variant definitions (vacuum/ground)
- Scalable structure for multiple products (future-proofing)

**Component Structure:**
```
Product Component
├── Section Header (eyebrow, title, subtitle)
├── Main Grid (2-column: 60% visual | 40% content)
│   ├── Visual Side (Left 60%)
│   │   ├── Image Container
│   │   │   ├── Harpy-1 Vacuum variant image
│   │   │   └── Harpy-1 Ground variant image
│   │   │       (AnimatePresence for smooth transitions)
│   │   └── Image Format: WebP (primary) + PNG (fallback)
│   │       Aspect Ratio: 16/9, Lazy-loaded, object-fit: contain
│   │
│   └── Content Side (Right 40%)
│       ├── Engine Title + Description
│       ├── Variant Selector
│       │   └── Mission Configuration [ Vacuum ] [ Ground ]
│       │       (Minimal segmented control style)
│       ├── Specification Rows
│       │   ├── Icon (colored SVG) | Label | Value
│       │   ├── Thrust (Orange #f97316) — 37 kN
│       │   ├── Propellant (Blue #1e40af) — LOX / LNG
│       │   ├── Cycle (Violet #7c3aed) — Fuel-Rich
│       │   ├── ISP (Cyan #0891b2) — 345 s
│       │   └── Burn (Red #dc2626) — 700 s
│       │       (No cards, no boxes, subtle dividers only)
│       └── CTA Section
│           ├── Primary: "Explore Engine" (button)
│           └── Secondary: "Download Datasheet" + "Request Specifications" (text-links)
│
└── Responsive Stacking
    ├── Desktop (1024px+): 60/40 grid layout
    ├── Tablet (1024px): Adjusted spacing, maintain grid
    └── Mobile (640px): Single column (image first, specs stacked)
```

### Icon Components (5 Total)

All SVG icons use 24x24 viewBox with stroke-width 2.5, linear gradients, and animated background circles.

| Icon          | Color    | Hex     | Concept                           |
|---------------|----------|---------|-----------------------------------|
| ThrustIcon    | Orange   | #f97316 | Upward arrows, central force      |
| PropellantIcon| Blue     | #1e40af | Tank/container concept            |
| CycleIcon     | Violet   | #7c3aed | Circular process (4 points)       |
| IspIcon       | Cyan     | #0891b2 | Crosshairs/performance indicator  |
| BurnIcon      | Red      | #dc2626 | Flame/thermal concept             |

### Styling Strategy

**Design Aesthetic:** Aerospace Engineering + SpaceX-style Premium Technical Presentation

**Specification Layout (NOT Cards):**
- Structured rows with label on left, value on right
- Subtle bottom borders as dividers (no cards, no boxes)
- Muted label color (#64748b), strong value color (brand colors)
- Spacious vertical alignment for premium editorial feel
- Zero gradient saturation, minimal visual noise

**Variant Selector:**
- Mission Configuration label with segmented control buttons
- Minimal styling with subtle active state (no glow, no heavy gradients)
- Clean typography hierarchy

**CTA Section:**
- Primary CTA: "Explore Engine" (solid button, brand blue)
- Secondary CTAs: "Download Datasheet", "Request Specifications" (text-links, muted color)
- Clear visual hierarchy (primary dominates, secondaries recede)

**Color Palette (Aerospace Theme):**
- Primary Blue: #1e40af (thrust, main accent)
- Orange Accent: #f97316 (propellant, CTAs)
- Secondary Violet: #7c3aed (cycle type)
- Tertiary Cyan: #0891b2 (ISP performance)
- Error Red: #dc2626 (burn/thermal)
- Muted Slate: #64748b (labels, secondary text)

### Key Features

1. **Variant Switching**
   - React state `activeVariant: 'vacuum' | 'ground'`
   - AnimatePresence handles smooth image transitions
   - Variant description updates dynamically
   - Full-resolution image switching with lazy loading

2. **Intersection-Triggered Animations**
   - useIntersection hook with threshold: 0.15
   - Animations trigger when section enters viewport
   - Respects prefers-reduced-motion for accessibility

3. **Responsive Layout**
   - Desktop: CSS Grid with 60/40 split
   - Tablet: Adjusted spacing, grid maintained
   - Mobile: CSS Grid single column with image first, specs stacked
   - Container-based responsive design

4. **Image Optimization**
   - WebP primary format with PNG fallback
   - Aspect ratio: 16/9 (maintained with CSS)
   - Lazy loading attribute enabled
   - object-fit: contain (no cropping, full engine visible)
   - Loading from `/products/harpy-1-*.webp`

5. **Data Validation**
   - Zod schema validates product structure at import time
   - Type-safe with TypeScript inferred types
   - ProductSpec: `{ label, value }`
   - Product: `{ id, name, specs[], image, isUnderDevelopment }`

6. **Animation Variants Used**
   - `fadeInUp` — Section header
   - `fadeInLeft` — Visual side
   - `fadeInRight` — Content side
   - `staggerContainer` — Overall orchestration
   - `scaleFade` — Icon animations

### Product Data Schema (`entities/product/model/product.schema.ts`)

```ts
const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  specs: z.array(productSpecSchema).min(1),
  image: z.string().refine((val) => val.startsWith('/') || val.startsWith('http')),
  isUnderDevelopment: z.boolean().optional(),
});

type Product = z.infer<typeof productSchema>;
type Products = z.infer<typeof productsSchema>;
```

### Product Data Store (`entities/product/model/product.data.ts`)

```ts
const rawProducts = [
  {
    id: 'harpy',
    name: 'Harpy-1',
    description: 'A cryogenic liquid engine...',
    specs: [
      { label: 'Thrust (Vacuum)', value: '37 kN' },
      { label: 'Propellant', value: 'LOX / LNG' },
      { label: 'Cycle', value: 'Fuel-rich staged combustion' },
      { label: 'Specific Impulse', value: '345 s' },
      { label: 'Burn Duration', value: '700 s' },
    ],
    image: '/products/harpy-1.webp',
    isUnderDevelopment: true,
  },
  // Future products can be added here without component changes
];

export const products: Products = productsSchema.parse(rawProducts);
```

### Performance Optimization

- **Image Format:** WebP (40% smaller than PNG) with PNG fallback for browser compatibility
- **Lazy Loading:** `loading="lazy"` attribute on images
- **Code Splitting:** Component lazy-loaded via page route
- **CSS Modules:** Scoped styles prevent conflicts
- **Intersection Observer:** Only triggers animations when visible
- **Accessibility:** `prefers-reduced-motion` respected for animation disabling

### Lighthouse Optimization Targets

- FCP (First Contentful Paint): Hero image priority, lazy-load product images
- LCP (Largest Contentful Paint): WebP format, minimal image size
- CLS (Cumulative Layout Shift): Fixed aspect ratios, no layout thrashing
- Performance Score: Aim for 90+

---

## ⚙️ Common Patterns & Best Practices

### Animation & Motion
```tsx
// Standard pattern for intersection-triggered animations
const { ref, hasIntersected } = useIntersection<HTMLElement>({ threshold: 0.15 });
const prefersReducedMotion = useReducedMotion();

const variants = {
  fadeInUp: getVariants(fadeInUp, prefersReducedMotion),
  // ... more variants
};

// Apply to component
<motion.div
  initial="hidden"
  animate={hasIntersected ? 'visible' : 'hidden'}
  variants={variants.staggerContainer}
>
```

### Error Handling
- Error boundaries wrap widgets in `HomePage`
- Uses `react-error-boundary` for graceful error UI
- Fallback UI shown on component errors

### Data Management
- Static data in `entities/<name>/model/*.data.ts`
- Type definitions in `entities/<name>/model/*.schema.ts`
- React Query for async server state (when needed)
- Zod for runtime validation

### Performance Optimization
- Lazy loading all pages with `React.lazy()`
- Code splitting per route
- CSS Modules prevent style conflicts
- Image lazy loading (`loading="lazy"`)
- HDR environment maps for optimized 3D scenes
