import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, supabaseUser.id))
    .limit(1)

  return NextResponse.json({
    user: dbUser[0] ?? null,
    supabaseUser,
  })
}
