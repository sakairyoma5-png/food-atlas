---
name: Next.js migration architecture
description: How the Next.js app coexists with the Replit Express app during migration
---

# Next.js Migration Architecture

## Key Rule
Next.js app lives in `nextjs-app/` subdirectory. Root directory keeps the Replit Express + React app running unmodified.

## Why
Replit deployment must stay live during migration. Two separate deployments in parallel.

## How to apply
- All new Next.js work goes in `nextjs-app/`
- `nextjs-app/package.json` is a standalone project — Replit's packager_tool only installs to root, so `nextjs-app/` deps are managed by Vercel at deploy time
- Vercel project setting: Root Directory = `nextjs-app/`
- `nextjs-app/lib/db/schema.ts` mirrors `shared/schema.ts` but omits `sessions` table (Supabase handles sessions natively)
