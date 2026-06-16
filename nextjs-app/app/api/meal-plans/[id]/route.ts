import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMealPlanById, deleteMealPlan } from "@/lib/db/queries"

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const plan = await getMealPlanById(params.id)
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (plan.userId !== user.id) return NextResponse.json({ error: "Access denied" }, { status: 403 })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error fetching meal plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const plan = await getMealPlanById(params.id)
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (plan.userId !== user.id) return NextResponse.json({ error: "Access denied" }, { status: 403 })

    await deleteMealPlan(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting meal plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
