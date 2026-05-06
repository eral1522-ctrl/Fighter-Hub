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
- `/` — Landing page (hero, why join, live API opportunities, membership CTA)
- `/sign-in` — Clerk sign-in page (dark gold theme)
- `/sign-up` — Clerk sign-up page
- `/dashboard` — Fighter dashboard (opportunities, events, applications, stats)
- `/profile` — Fighter profile form (create/edit)
- `/admin` — Admin dashboard (manage fighters, opportunities, events, applications)
- `/association` — What IFA Does (8 pillar sections + CTA)
- `/statutes` — IFA Statutes (9 sections, bilingual)
- `/president-message` — Erik Alonso president page (photo/message placeholder)

### Key Features
1. **Landing page** with hero "Access fights, sponsors and global boxing opportunities."
2. **Clerk auth** — email/password sign-up/sign-in with branded dark/gold UI
3. **Fighter profiles** — full professional profile with 16+ fields
4. **Fighter dashboard** — fight/sponsor opportunities, events, application tracking
5. **Admin panel** — approve/reject fighters and applications, create opportunities/events
6. **Membership plans** — Basic €19/mo, Pro €49/mo, Annual €299/yr (Stripe-ready structure)

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
To activate payments:
1. Install stripe: `pnpm --filter @workspace/api-server add stripe`
2. Add `STRIPE_SECRET_KEY` to environment secrets
3. Create products/prices in Stripe dashboard and set `STRIPE_PRICE_*` env vars
4. Uncomment the Stripe checkout session code in `membership.ts`

## Admin Access

Set `ADMIN_CLERK_IDS` environment variable to a comma-separated list of Clerk user IDs
that should have admin access. In dev mode (no ADMIN_CLERK_IDS set), all authenticated
users can access the admin panel.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
