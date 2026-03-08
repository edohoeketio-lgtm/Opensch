# SKILLS.md — Vibe Coding Academy Public Website

This file defines the execution skills that must be used to maintain cohesion, quality, and premium consistency across the public website build.

---

## Skill 1 — NORTHSTAR_GUARDIAN

### Purpose

Protect the strategic integrity of the website so every page reinforces the same offer, audience, and conversion goal.

### Responsibilities

- Ensure the website always reflects the academy's core concept, positioning, target audience, and transformation promise
- Prevent scope drift into dashboard, LMS, or unrelated product directions
- Check every section against the site's primary job: turning qualified visitors into applicants
- Maintain consistency between curriculum, pricing, admissions, and CTA language

### Inputs

- NorthStar Profile
- site architecture
- cohort structure
- pricing
- user flows

### Outputs

- aligned page messaging
- consistent CTA usage
- consistent tier positioning
- consistent admissions framing

### Done when

- every page reinforces the same positioning
- every CTA points to the right destination
- tier language and pricing are consistent across all pages
- the site reads as one unified experience

---

## Skill 2 — DESIGN_SYSTEM_ENGINE

### Purpose

Maintain visual cohesion across all pages by enforcing the design system tokens, layout patterns, and component rules.

### Responsibilities

- Enforce the design tokens defined in `globals.css` (colors, typography, spacing, radii)
- Ensure every component uses the shared primitives (`SectionWrapper`, `SectionHeader`, `CTAButton`, `Card`, `AnimatedSection`)
- Maintain responsive behavior across breakpoints
- Enforce the "Quiet Luxury Editorial-Tech" aesthetic: restrained, precise, premium

### Design Tokens

- **Background**: `#F7F4EE` (warm off-white)
- **Ink**: `#111111` (deep black)
- **Accent**: `#B08D57` (restrained gold)
- **Surface**: `#F0EDE5`
- **Border**: `#E2DDD3`
- **Muted text**: `#6B6560`
- **Deep (dark sections)**: `#111111` background, `#1A1917` surface, `#A09A90` muted

### Typography

- **Primary**: Inter (sans-serif)
- **Accent**: Instrument Serif (serif, used for hero highlights and section accents)
- **Sizing**: fluid scale from `text-sm` (0.875rem) to headings (clamp-based)

### Done when

- no ad-hoc colors, fonts, or spacing values appear outside the token system
- all pages use the shared component library
- the site feels like one continuous, cohesive experience

---

## Skill 3 — CONTENT_INTEGRITY_CHECKER

### Purpose

Ensure all content across the site is accurate, consistent, and aligned with the NorthStar Profile.

### Responsibilities

- Validate that pricing, seat counts, dates, and cohort details match `lib/constants.ts`
- Ensure curriculum details match `lib/content.ts`
- Check that FAQ answers don't contradict other page content
- Confirm CTA text matches across all instances
- Ensure copy tone is intelligent, premium, direct, and non-hypey

### Content Sources

- `lib/constants.ts` — academy info, pricing, cohort details, schedule, CTAs, nav links
- `lib/content.ts` — curriculum weeks, FAQs, comparison features, proof items, application steps, outcomes, audience segments

### Done when

- no contradictions between pages
- all numbers (seats, prices, dates, hours) are consistent
- copy reads as confident and premium throughout

---

## Skill 4 — CONVERSION_FLOW_ARCHITECT

### Purpose

Ensure the user flow from discovery to application is smooth, logical, and conversion-optimized.

### Responsibilities

- Verify that every page has a clear next step (CTA)
- Ensure the primary flow (Home → understand → details → Apply) works seamlessly
- Check that Apply form validation works correctly
- Verify success states provide clear next-step guidance
- Ensure the Waitlist page provides a clear fallback when applications are closed

### Key Flows

1. **Primary**: Home → Curriculum/Pricing → Apply → Confirmation
2. **Exploration**: Home → FAQ → Apply
3. **Direct**: Any page → Apply (via navbar CTA)
4. **Closed state**: Any page → Waitlist

### Done when

- every page has at least one CTA pointing toward Apply
- form validation prevents incomplete submissions
- success states confirm submission and set expectations
- navigation never dead-ends

---

## Skill 5 — ACCESSIBILITY_AND_POLISH

### Purpose

Ensure the site meets basic accessibility standards and feels polished at every interaction point.

### Responsibilities

- Semantic HTML structure (proper heading hierarchy, landmarks, labels)
- Keyboard navigation support
- Sufficient color contrast (especially on dark sections)
- Focus states on all interactive elements
- Smooth scroll-triggered animations via Framer Motion
- Responsive design across mobile, tablet, and desktop

### Standards

- Single `<h1>` per page
- All form inputs have associated labels
- All interactive elements have unique IDs
- Focus-visible styles on all interactive elements
- Animations respect `prefers-reduced-motion`

### Done when

- all pages pass basic accessibility checks
- keyboard navigation works through all interactive elements
- the site feels polished and intentional at every breakpoint

---

## Skill 6 — TECH_STACK_GUARDIAN

### Purpose

Maintain consistency in the technical implementation and prevent dependency drift.

### Responsibilities

- Enforce the approved tech stack (Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Radix UI, lucide-react, clsx)
- Ensure App Router patterns are used correctly (server/client component separation)
- Prevent unnecessary dependencies from being added
- Maintain clean file organization (pages in `app/`, components in `components/`, data in `lib/`)

### File Structure

```
app/
  layout.tsx          — Root layout (server component)
  page.tsx            — Home page (client component)
  globals.css         — Design tokens + global styles
  [route]/
    page.tsx          — Server wrapper with metadata
    [Route]Page.tsx   — Client component with page content
components/
  layout/
    Navbar.tsx
    Footer.tsx
  ui/
    SectionWrapper.tsx
    SectionHeader.tsx
    CTAButton.tsx
    AnimatedSection.tsx
    Card.tsx
lib/
  constants.ts        — Static config data
  content.ts          — Page content data
  utils.ts            — Utility functions
```

### Done when

- no unapproved dependencies in `package.json`
- file organization follows the established pattern
- server/client boundary is respected
- TypeScript compiles with zero errors
