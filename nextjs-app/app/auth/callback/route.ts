import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/home"

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const supabaseUser = data.user

      // Upsert user into our users table
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, supabaseUser.id))
        .limit(1)

      if (existingUser.length === 0) {
        await db.insert(users).values({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          username: supabaseUser.user_metadata?.preferred_username ?? supabaseUser.email?.split("@")[0] ?? null,
          displayName: supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null,
          firstName: supabaseUser.user_metadata?.given_name ?? null,
          lastName: supabaseUser.user_metadata?.family_name ?? null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        })
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
