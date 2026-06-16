import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getUserSubscription,
  createUserSubscription,
  updateUserSubscription,
} from "@/lib/db/queries"
import type { UserSubscription } from "@/lib/db/schema"

async function computeSubscriptionStatus(
  userId: string,
  subscription: UserSubscription | null
): Promise<UserSubscription | null> {
  if (!subscription || subscription.plan !== "premium" || !subscription.currentPeriodEnd) {
    return subscription
  }

  const now = new Date()
  const periodEnd = new Date(subscription.currentPeriodEnd)

  if (now <= periodEnd) return subscription

  if (subscription.status === "active") {
    const gracePeriodEnd = new Date(periodEnd)
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 10)
    const updated = await updateUserSubscription(userId, { status: "past_due", gracePeriodEnd })
    return updated ?? subscription
  }

  if (subscription.status === "past_due" && subscription.gracePeriodEnd) {
    const graceEnd = new Date(subscription.gracePeriodEnd)
    if (now > graceEnd) {
      const updated = await updateUserSubscription(userId, { status: "unpaid" })
      return updated ?? subscription
    }
  }

  return subscription
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let subscription = await getUserSubscription(user.id)

    if (!subscription) {
      subscription = await createUserSubscription({
        userId: user.id,
        plan: "free",
        status: "active",
      })
    }

    const updatedSub = await computeSubscriptionStatus(user.id, subscription)
    if (updatedSub) subscription = updatedSub

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
