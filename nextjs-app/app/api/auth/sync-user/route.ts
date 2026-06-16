import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !supabaseUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, supabaseUser.id))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(users).values({
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      username:
        supabaseUser.user_metadata?.preferred_username ??
        supabaseUser.email?.split("@")[0] ??
        null,
      displayName:
        supabaseUser.user_metadata?.full_name ??
        supabaseUser.user_metadata?.name ??
        null,
      firstName: supabaseUser.user_metadata?.given_name ?? null,
      lastName: supabaseUser.user_metadata?.family_name ?? null,
      profileImageUrl: supabaseUser.user_metadata?.avatar_url ?? null,
    })
  } else {
    await db
      .update(users)
      .set({
        email: supabaseUser.email ?? null,
        displayName:
          supabaseUser.user_metadata?.full_name ??
          supabaseUser.user_metadata?.name ??
          null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, supabaseUser.id))
  }

  return NextResponse.json({ ok: true })
}
