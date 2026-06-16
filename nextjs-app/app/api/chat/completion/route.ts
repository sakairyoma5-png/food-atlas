import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { openai, DEFAULT_MODEL, SYSTEM_PROMPT, extractRecipeData } from "@/lib/openai"
import {
  getConversationById,
  createConversation,
  getMessagesByConversationId,
  createMessage,
  createRecipe,
} from "@/lib/db/queries"
import { z } from "zod"

const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
})

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
    const parsed = chatSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { conversationId, message } = parsed.data
    const userId = user.id

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await getConversationById(conversationId)
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
      if (conversation.userId !== userId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    } else {
      conversation = await createConversation({
        userId,
        title: message.substring(0, 50),
      })
    }

    // Save user message
    await createMessage({
      conversationId: conversation.id,
      role: "user",
      content: message,
    })

    // Get conversation history
    const history = await getMessagesByConversationId(conversation.id)

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_completion_tokens: 8192,
    })

    const assistantRaw = completion.choices[0].message.content || ""
    const { text, recipes: recipeDataList } = extractRecipeData(assistantRaw)

    // Save assistant message (text only)
    await createMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: text,
    })

    // Save extracted recipes
    const savedRecipes = []
    for (const recipeData of recipeDataList) {
      try {
        const recipe = await createRecipe({
          userId,
          conversationId: conversation.id,
          name: recipeData.name,
          region: recipeData.region,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          cookingTime: recipeData.cookingTime,
          difficulty: recipeData.difficulty,
          servings: recipeData.servings,
          nutrition: recipeData.nutrition,
          isSaved: false,
        })
        savedRecipes.push(recipe)
      } catch (err) {
        console.error("Failed to save recipe:", err)
      }
    }

    return NextResponse.json({
      conversationId: conversation.id,
      message: text,
      recipes: savedRecipes,
    })
  } catch (error) {
    console.error("Chat completion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
