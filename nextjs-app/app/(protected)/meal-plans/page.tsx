import type { Metadata } from "next"
import MealPlansView from "@/components/meal-plans-view"

export const metadata: Metadata = {
  title: "献立プラン | Food Atlas",
  description: "月間献立プランを作成しましょう（プレミアム機能）",
}

export default function MealPlansPage() {
  return <MealPlansView />
}
