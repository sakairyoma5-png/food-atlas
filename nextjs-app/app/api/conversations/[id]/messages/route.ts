import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getConversationById, getMessagesByConversationId } from "@/lib/db/queries"

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

    const conversation = await getConversationById(id)
    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (conversation.userId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const messages = await getMessagesByConversationId(id)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
