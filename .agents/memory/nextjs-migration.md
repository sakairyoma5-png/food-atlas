---
name: Next.js migration architecture
description: Coexistence strategy and key decisions for the Next.js / Replit parallel migration
---

# Next.js Migration Architecture

## Key Rule
Next.js app lives in `nextjs-app/` subdirectory alongside the unchanged Replit Express root app. Both deployments run independently.

**Why:** Replit deployment must stay live during migration. Vercel and Replit are separate targets.

## How to apply
- All new Next.js work goes in `nextjs-app/`
- Replit's `installLanguagePackages` only affects the root workspace, not subdirectories. `nextjs-app/` deps are resolved by Vercel at deploy time via its own `npm install`
- Vercel project setting: Root Directory = `nextjs-app/`
- The Next.js schema mirrors the Replit schema but omits the `sessions` table — Supabase handles sessions natively
- Drizzle config lives at `lib/db/drizzle.config.ts`; all `drizzle-kit` scripts must pass `--config lib/db/drizzle.config.ts`
