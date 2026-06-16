import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "ホーム | Food Atlas",
  description: "AIと会話して世界中の料理を探索しましょう",
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "ユーザー"

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">
        こんにちは、{displayName}さん
      </h1>
      <p className="text-muted-foreground mb-8">
        今日はどんな料理を探しますか？
      </p>
      <div className="bg-muted/30 rounded-xl p-8 text-center text-muted-foreground">
        <p>チャット機能は次のフェーズで実装されます</p>
      </div>
    </div>
  )
}
