import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getFoodLogById, deleteFoodLog } from "@/lib/db/queries"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const log = await getFoodLogById(params.id)
    if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (log.userId !== user.id) return NextResponse.json({ error: "Access denied" }, { status: 403 })

    await deleteFoodLog(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting food log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
