# Frontend Redesign Guide

This document is for the frontend engineer taking over the redesign of prompt.gallery.

## Quick Start

```bash
cd nextjs-app
npm install
npm run dev
# Opens at http://localhost:3000
```

## Tech Stack

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16.0.10 | App Router (not Pages Router) |
| React | 19.x | Latest React |
| Tailwind CSS | 4.0.9 | ⚠️ See styling notes below |
| TypeScript | 5.x | Strict mode enabled |
| Supabase | 2.x | Auth + Database |
| Stripe | 20.x | Payments |
| Lucide React | 0.561 | Icons |

## Project Structure

```
nextjs-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── globals.css         # ⭐ Global styles & Tailwind config
│   │   ├── page.tsx            # Homepage - prompts grid
│   │   ├── showcases/          # Paid showcases listing
│   │   ├── showcase/[id]/      # Individual showcase page
│   │   ├── export/             # Export tool for users
│   │   ├── dashboard/          # Creator dashboard
│   │   ├── auth/               # Auth pages + callback
│   │   └── api/                # API routes (Stripe, etc.)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── PromptCard.tsx      # Free prompt card
│   │   └── ShowcaseCard.tsx    # Paid showcase card
│   │
│   └── lib/                    # Utilities & data
│       ├── prompts-data.ts     # Static prompt data
│       ├── types.ts            # TypeScript types
│       ├── stripe.ts           # Stripe client
│       └── supabase/           # Supabase clients
│           ├── client.ts       # Browser client
│           ├── server.ts       # Server client
│           └── middleware.ts   # Session handling
│
├── supabase/
│   └── schema.sql              # Database schema
│
└── public/                     # Static assets
```

## ⚠️ Critical: Styling Notes

### The Problem
The current codebase uses **Tailwind CSS v4** with arbitrary value syntax like:
```tsx
className="bg-[var(--bg-card)] text-[var(--text-primary)]"
```

This syntax has **inconsistent behavior** in Tailwind v4, causing styles to sometimes not compile. The current workaround is explicit CSS rules in `globals.css`.

### Recommended Approaches for Redesign

**Option 1: Use Tailwind v4's @theme colors (Recommended)**
```css
/* In globals.css - already set up */
@theme inline {
  --color-bg-card: #161618;
}
```
```tsx
// In components - use the theme color directly
className="bg-bg-card text-text-primary"
```

**Option 2: Downgrade to Tailwind v3**
```bash
npm install tailwindcss@3 @tailwindcss/postcss@3
```
Then arbitrary values like `bg-[var(--color)]` will work reliably.

**Option 3: Plain CSS**
Define classes in `globals.css` and use them directly.

### Current Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #0a0a0b | Page background |
| `--bg-secondary` | #111113 | Secondary areas |
| `--bg-card` | #161618 | Card backgrounds |
| `--border-subtle` | #232326 | Subtle borders |
| `--text-primary` | #f4f4f5 | Main text |
| `--text-secondary` | #a1a1aa | Secondary text |
| `--accent-primary` | #f97316 | Orange accent |
| `--success` | #22c55e | Success green |

## Pages Overview

### `/` - Homepage (Prompts)
- Grid of free, curated prompts
- Filter by category
- Click-to-copy functionality
- Data: Static (`lib/prompts-data.ts`)

### `/showcases` - Paid Showcases
- Grid of paid AI conversation showcases
- Filter by category
- Preview + purchase flow
- Data: Supabase database

### `/showcase/[id]` - Showcase Detail
- Full showcase with preview
- Stripe payment integration
- Unlocked content display

### `/export` - Export Tool
- Users upload their AI chat exports
- Processing and showcase creation
- Multi-step wizard UI

### `/dashboard` - Creator Dashboard
- View created showcases
- Earnings/stats
- Requires authentication

## Backend Integration

### Supabase (Auth + Database)
- Client: `lib/supabase/client.ts` (browser)
- Server: `lib/supabase/server.ts` (server components)
- Middleware: `lib/supabase/middleware.ts` (session refresh)

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Note: The app works without these (uses mock data), but auth/database won't function.

### Stripe (Payments)
- Checkout: `/api/checkout`
- Webhooks: `/api/webhooks/stripe`
- Connect: `/api/connect` (creator payouts)

**Environment Variables Required:**
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Deployment

### Vercel Settings
- **Root Directory:** `nextjs-app`
- **Framework Preset:** Next.js
- **Build Command:** (default)
- **Output Directory:** (default)

### Important Files
- `vercel.json` - Framework detection
- `package-lock.json` - **Commit this!** Ensures reproducible builds

## Known Issues / Gotchas

1. **Tailwind v4 arbitrary values** - Don't rely on `bg-[var(--x)]` syntax
2. **No Supabase env vars** - App shows "using mock client" in console (OK for development)
3. **Middleware deprecation warning** - Next.js 16 warns about middleware → proxy migration (can ignore for now)
4. **Font loading** - Fonts loaded from Google Fonts in layout.tsx

## Suggested Redesign Workflow

1. **Start with globals.css** - Define your color system
2. **Update layout.tsx** - Fonts, metadata
3. **Tackle components** - Header, Footer, Cards
4. **Then pages** - Homepage, Showcases, etc.
5. **Test on Vercel** - Push frequently, test on production URL

## Questions?

The codebase has comments in key files explaining functionality. Check:
- `src/app/globals.css` - Styling system
- `src/components/*.tsx` - Component documentation
- `src/lib/types.ts` - Data structures

