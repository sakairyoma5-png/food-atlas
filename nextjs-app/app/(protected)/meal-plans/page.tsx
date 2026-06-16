import type { Metadata } from "next"
import MealPlansView from "@/components/meal-plans-view"

export const metadata: Metadata = {
  title: "献立プラン",
  description: "月間献立プランを作成しましょう（プレミアム機能）",
  openGraph: {
    title: "献立プラン | Food Atlas",
    description: "予算と好みに合わせた1ヶ月分の献立を自動生成。買い物リストも同時に作成できるプレミアム機能。",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "献立プラン | Food Atlas",
    description: "予算と好みに合わせた1ヶ月分の献立を自動生成。買い物リストも同時に作成できるプレミアム機能。",
  },
}

export default function MealPlansPage() {
  return <MealPlansView />
}
