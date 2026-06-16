import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getRecipesByUserId,
  getRecipesByConversationId,
  createRecipe,
  getConversationById,
} from "@/lib/db/queries"
import { insertRecipeSchema } from "@/lib/db/schema"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    let recipes
    if (conversationId) {
      const conversation = await getConversationById(conversationId)
      if (!conversation || conversation.userId !== user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
      recipes = await getRecipesByConversationId(conversationId)
    } else {
      recipes = await getRecipesByUserId(user.id)
    }

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = insertRecipeSchema.safeParse({ ...body, userId: user.id })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const recipe = await createRecipe(parsed.data)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
