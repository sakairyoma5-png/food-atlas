import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getConversationById } from "@/lib/db/queries"

export async function GET(
  _request: NextRequest,
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

    const conversation = await getConversationById(params.id)
    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (conversation.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
