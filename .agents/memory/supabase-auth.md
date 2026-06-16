---
name: Supabase Auth setup
description: Auth flow, user upsert pattern, and required Supabase dashboard configuration
---

# Supabase Auth Setup

## Auth Flow
1. User clicks Google/GitHub/email login in `app/login/page.tsx`
2. Supabase SSR redirects to provider
3. Provider redirects to `app/auth/callback/route.ts`
4. Callback exchanges code for session, then upserts user into our `users` table (using Drizzle)
5. Redirect to `/home`

## Required Supabase Dashboard Config
- Authentication > Providers: enable Google, GitHub (with OAuth app credentials)
- Authentication > URL Configuration > Redirect URLs: add `https://your-app.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`

## Why upsert in callback
Supabase Auth stores users in `auth.users` (separate schema). Our `public.users` table needs to be populated for app data. The callback is the single reliable place to do this.

## How to apply
When adding new OAuth providers, always add the redirect URL in Supabase dashboard first, or login will fail silently.
