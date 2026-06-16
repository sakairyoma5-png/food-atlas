import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "世界地図 | Food Atlas",
  description: "世界の地図から地域の料理を探索しましょう",
}

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">世界地図</h1>
      <p className="text-muted-foreground mb-8">地図から地域の料理を探索できます</p>
      <div className="bg-muted/30 rounded-xl p-8 text-center text-muted-foreground">
        <p>地図機能は次のフェーズで実装されます</p>
      </div>
    </div>
  )
}
