import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "献立プラン | Food Atlas",
  description: "月間献立プランを作成しましょう（プレミアム機能）",
}

export default function MealPlansPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">献立プラン</h1>
      <p className="text-muted-foreground mb-8">月間献立プランを自動生成します（プレミアム機能）</p>
      <div className="bg-muted/30 rounded-xl p-8 text-center text-muted-foreground">
        <p>献立プラン機能は次のフェーズで実装されます</p>
      </div>
    </div>
  )
}
