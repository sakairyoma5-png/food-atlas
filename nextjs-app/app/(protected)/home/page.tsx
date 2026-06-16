import type { Metadata } from "next"
import ChatInterface from "@/components/chat-interface"

export const metadata: Metadata = {
  title: "ホーム",
  description: "AIと会話して世界中の料理を探索しましょう",
  openGraph: {
    title: "ホーム | Food Atlas",
    description: "AIと会話するだけで世界中の料理を発見。好みや時間・食材を伝えると最適なレシピを提案します。",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ホーム | Food Atlas",
    description: "AIと会話するだけで世界中の料理を発見。好みや時間・食材を伝えると最適なレシピを提案します。",
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatInterface />
    </div>
  )
}
