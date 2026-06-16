import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getConversationsByUserId, createConversation } from "@/lib/db/queries"
import { insertConversationSchema } from "@/lib/db/schema"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = await getConversationsByUserId(user.id)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
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
    const parsed = insertConversationSchema.safeParse({ ...body, userId: user.id })
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const conversation = await createConversation(parsed.data)
    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
