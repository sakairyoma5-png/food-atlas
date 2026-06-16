import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRecipeById } from "@/lib/db/queries"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipe = await getRecipeById(id)
    if (!recipe) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (recipe.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(recipe)

  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
