import type { Metadata } from "next"
import ChatInterface from "@/components/chat-interface"

export const metadata: Metadata = {
  title: "ホーム | Food Atlas",
  description: "AIと会話して世界中の料理を探索しましょう",
}

export default function HomePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatInterface />
    </div>
  )
}
