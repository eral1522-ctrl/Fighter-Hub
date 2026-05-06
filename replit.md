# FightersRoom

## Overview

FightersRoom is a membership platform for professional boxers. Fighters register, create profiles, pay membership fees, and access fight opportunities, sponsors, events, and brand campaigns.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/fighters-room) at `/`
- **API framework**: Express 5 (artifacts/api-server) at `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (email/password + social OAuth)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## App Structure

### Pages
- `/` — Landing page (hero, stats bar, combat sports, why join, live opportunities, testimonials, final CTA, footer)
- `/sign-in` — Clerk sign-in page (dark gold theme)
- `/sign-up` — Clerk sign-up page
- `/dashboard` — Fighter dashboard (opportunities, events, applications, stats)
- `/profile` — Fighter profile form (create/edit)
- `/admin` — Admin dashboard (manage fighters, opportunities, events, applications)
- `/association` — What IFA Does (8 pillar sections + CTA)
- `/statutes` — IFA Statutes (9 sections, bilingual)
- `/president-message` — Erik Alonso president page
- `/about` — About IFA (mission, vision, values, timeline, leadership)
- `/membership` — Full membership page (3 tiers: Athlete €20/mo, Club/Gym €99/mo, Partner/contact; FAQ; how it works)
- `/news-events` — News articles + upcoming events
- `/contact` — Contact form + social links + media/partnership sections
- `/privacy-policy` — GDPR-compliant privacy policy (12 sections)
- `/legal-notice` — Legal notice (org details, terms, IP, liability)

### Key Features
1. **Landing page** — "The Global Home of Combat Sports" hero, stats bar (1,200+ members / 45+ countries / 6 sports / 180+ events), 6 combat sports discipline cards, 8 member benefit cards, live opportunities, named testimonials, final CTA, multi-column footer
2. **Clerk auth** — email/password sign-up/sign-in with branded dark/gold UI
3. **Fighter profiles** — full professional profile with 16+ fields
4. **Fighter dashboard** — fight/sponsor opportunities, events, application tracking
5. **Admin panel** — approve/reject fighters and applications, create opportunities/events
6. **Membership plans** — Athlete €20/mo, Club/Gym €99/mo, Partner (contact)
7. **SEO** — robots.txt, sitemap.xml, full OG/Twitter Card meta tags in index.html
8. **Multi-column footer** — all pages use premium footer with 4 columns (Brand, For Fighters, Association, Legal)

## Database Tables
- `fighters` — fighter profiles with approval/membership status
- `opportunities` — fight and sponsor opportunities (type: fight | sponsor)
- `events` — boxing events
- `applications` — fighter applications to opportunities/events

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Environment Variables

Auto-provisioned:
- `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — PostgreSQL
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth

Manual configuration needed:
- `STRIPE_SECRET_KEY` — Stripe secret key (for payment processing)
- `STRIPE_PRICE_BASIC` — Stripe Price ID for Basic plan (€19/month)
- `STRIPE_PRICE_PRO` — Stripe Price ID for Pro plan (€49/month)
- `STRIPE_PRICE_ANNUAL` — Stripe Price ID for Annual plan (€299/year)
- `ADMIN_CLERK_IDS` — Comma-separated list of Clerk user IDs with admin access
- `ADMIN_EMAIL` — Email address to receive new fighter application notifications
- `APP_URL` — Public app URL (for Stripe redirect URLs and admin notification links)

## Stripe Integration

Stripe checkout is scaffolded in `artifacts/api-server/src/routes/membership.ts`.
Direct Stripe link: `https://buy.stripe.com/cNibJ39hjcX210cbh2gfu05`

## Admin Access

Set `ADMIN_CLERK_IDS` environment variable to a comma-separated list of Clerk user IDs
that should have admin access. In dev mode (no ADMIN_CLERK_IDS set), all authenticated
users can access the admin panel.

## Contact / Brand
- Email: info@fightersassociation.com
- Instagram: @fighters_room
- Domain: fightersassociation.com

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
