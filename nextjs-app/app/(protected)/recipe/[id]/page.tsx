import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "レシピ詳細 | Food Atlas",
}

export default function RecipePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">レシピ詳細</h1>
      <p className="text-muted-foreground mb-4">Recipe ID: {params.id}</p>
      <div className="bg-muted/30 rounded-xl p-8 text-center text-muted-foreground">
        <p>レシピ詳細ページは次のフェーズで実装されます</p>
      </div>
    </div>
  )
}
