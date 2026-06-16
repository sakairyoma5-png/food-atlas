import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "マイログ | Food Atlas",
  description: "あなたの食事ログを確認しましょう",
}

export default function LogsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">マイログ</h1>
      <p className="text-muted-foreground mb-8">記録した食事を振り返りましょう</p>
      <div className="bg-muted/30 rounded-xl p-8 text-center text-muted-foreground">
        <p>ログ機能は次のフェーズで実装されます</p>
      </div>
    </div>
  )
}
