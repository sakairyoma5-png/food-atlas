import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRecipeById, updateRecipeSaveStatus } from "@/lib/db/queries"
import { z } from "zod"

const saveSchema = z.object({
  isSaved: z.boolean(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = saveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const existing = await getRecipeById(params.id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const recipe = await updateRecipeSaveStatus(params.id, parsed.data.isSaved)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error updating recipe save status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
