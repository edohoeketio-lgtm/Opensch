# OpenSch - Academic Operating System

OpenSch is a premium, cohort-based academic operating system designed to facilitate high-end learning experiences. It serves as both the Student Portal for curriculum traversal, community interaction, and portfolio management, as well as the Admin Command Center for cohort operations, deliverable reviews, and broadcast messaging.

## 🏗 Architecture & Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS (Utility-first, heavily strictly governed by the OpenSch Design System - OSDS)
- **Components**: Radix UI primitives & Lucide React icons
- **State/Data**: Server Components & Server Actions (Prisma ORM ready)
- **Testing**:
  - **Unit**: Vitest + React Testing Library (`npm run test`)
  - **E2E/Regression**: Playwright (`npm run test:e2e`)

## 🎨 OpenSch Design System (OSDS)

The platform adheres strictly to the OSDS, characterized by:
- **Premium Dark Aesthetic**: `#111111` core backgrounds with `#1C1C1E` elevated surfaces.
- **Glassmorphic Borders**: Structurally-pure `white/5` and `white/10` borders instead of heavy drop shadows or glowing blurs.
- **Typography**: Tracking-tight headings (`-0.04em`) with muted secondary text (`#888888`).
- **Accent**: Muted Gold / Champagne (`#B08D57`).

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Run the development server natively:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing

The codebase enforces a **Zero Silent Failures** mandate. Ensure all suites pass before merging any PR.

```bash
# Run unit and foundational logic tests
npm run test

# Run E2E regression suite (Requires local dev server running)
npm run test:e2e
```

## 📂 Project Structure

- `/app/(portal)`: The authenticated student experience (Dashboard, Feed, Curriculum, Settings).
- `/app/(admin)`: The instructor command center (Roster, Review Queue, Broadcasts, Course Builder).
- `/app/(marketing)`: The public-facing acquisition flows.
- `/app/api`: Edge and serverless functions for backend operations.
- `/__tests__`: Vitest unit tests.
- `/e2e`: Playwright browser automation tests.
- `/lib`: Global utilities and shared configuration.

## 🔒 Security Posture

- **Authentication Boundaries**: Enforced via Next.js Layouts and Route Handlers.
- **Secrets Management**: All sensitive keys must be injected at runtime via `.env` (not committed).
- **Edge Cases**: Graceful fallbacks for `404 Not Found` and `500 Internal Server Error` are handled natively via `not-found.tsx` and `error.tsx` to prevent stack trace leaks.
