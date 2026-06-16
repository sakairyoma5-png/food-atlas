import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getFoodLogsByUserId, createFoodLog } from "@/lib/db/queries"
import { insertFoodLogSchema } from "@/lib/db/schema"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const logs = await getFoodLogsByUserId(user.id)
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching food logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const parsed = insertFoodLogSchema.safeParse({ ...body, userId: user.id })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.errors }, { status: 400 })
    }

    const log = await createFoodLog(parsed.data)
    return NextResponse.json(log)
  } catch (error) {
    console.error("Error creating food log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
