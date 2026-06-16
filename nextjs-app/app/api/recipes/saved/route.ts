import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSavedRecipesByUserId } from "@/lib/db/queries"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipes = await getSavedRecipesByUserId(user.id)
    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching saved recipes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
