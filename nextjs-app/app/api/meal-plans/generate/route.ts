import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateMealPlan } from "@/lib/openai"
import {
  getUserSubscription,
  createUserSubscription,
  updateUserSubscription,
  createMealPlan,
} from "@/lib/db/queries"
import { insertMealPlanSchema } from "@/lib/db/schema"
import type { UserSubscription } from "@/lib/db/schema"
import { z } from "zod"

const MIN_MONTHLY_BUDGET = 10000

const generateSchema = z.object({
  budget: z.number().positive(),
  preferences: z.string().optional(),
})

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
    if (now > new Date(subscription.gracePeriodEnd)) {
      const updated = await updateUserSubscription(userId, { status: "unpaid" })
      return updated ?? subscription
    }
  }
  return subscription
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const parsed = generateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { budget, preferences } = parsed.data

    if (budget < MIN_MONTHLY_BUDGET) {
      return NextResponse.json({
        message: `月間予算は最低${MIN_MONTHLY_BUDGET.toLocaleString()}円以上が必要です。`,
        code: "BUDGET_TOO_LOW",
        minBudget: MIN_MONTHLY_BUDGET,
      }, { status: 400 })
    }

    // Fetch and update subscription status
    let subscription = await getUserSubscription(user.id)
    if (!subscription) {
      subscription = await createUserSubscription({ userId: user.id, plan: "free", status: "active" })
    }
    const updatedSub = await computeSubscriptionStatus(user.id, subscription)
    subscription = updatedSub ?? subscription

    const isPremium =
      subscription?.plan === "premium" &&
      (subscription?.status === "active" || subscription?.status === "past_due")

    if (!isPremium || subscription?.status === "unpaid") {
      const message =
        subscription?.status === "unpaid"
          ? "お支払いが完了していないため、プレミアム機能をご利用いただけません"
          : "この機能はプレミアムプラン限定です"
      return NextResponse.json({ message, requiresPremium: true, status: subscription?.status }, { status: 403 })
    }

    const generatedPlan = await generateMealPlan(budget, preferences)

    const start = new Date()
    const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000)

    const mealPlanData = {
      userId: user.id,
      title: `${budget.toLocaleString()}円の月間献立プラン`,
      budget,
      startDate: start,
      endDate: end,
      recipes: generatedPlan.recipes || [],
      shoppingList: generatedPlan.shoppingList || [],
      totalEstimatedCost: generatedPlan.estimatedCost || budget,
      notes: generatedPlan.tips || "",
      isPremium: true,
    }

    const validation = insertMealPlanSchema.safeParse(mealPlanData)
    if (!validation.success) {
      console.error("Meal plan validation failed:", validation.error.errors)
      return NextResponse.json({
        message: "献立プランの生成に失敗しました。もう一度お試しください。",
        errors: validation.error.errors,
      }, { status: 400 })
    }

    const mealPlan = await createMealPlan(validation.data)
    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error("Error generating meal plan:", error)
    return NextResponse.json({ error: "献立プランの生成に失敗しました" }, { status: 500 })
  }
}
