"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import RecipeCard from "@/components/recipe-card"
import type { Recipe } from "@/lib/db/schema"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  recipes?: Recipe[]
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isPending])

  const handleSend = async () => {
    if (!input.trim() || isPending) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsPending(true)

    try {
      const res = await fetch("/api/chat/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: currentInput }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`)
      }

      const data = await res.json()
      setConversationId(data.conversationId)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        recipes: data.recipes,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      toast({
        title: "エラー",
        description: "メッセージの送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-display font-semibold mb-2">
              世界中の料理を探索しましょう
            </h2>
            <p className="text-muted-foreground">
              どんな料理を作りたいですか？国や地域、時間、材料などを教えてください。
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            <div
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <GlobeIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
                data-testid={`message-${message.role}`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-secondary">
                    <span className="text-xs font-medium">You</span>
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {message.role === "assistant" &&
              message.recipes &&
              message.recipes.length > 0 && (
                <div className="ml-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
          </div>
        ))}

        {isPending && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <GlobeIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例: イタリアで軽め、20分以内で作れる料理"
            className="flex-1"
            data-testid="input-chat"
            disabled={isPending}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!input.trim() || isPending}
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
