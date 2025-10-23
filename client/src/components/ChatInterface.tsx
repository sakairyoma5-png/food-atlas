import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  initialMessages?: Message[];
}

export default function ChatInterface({ onSendMessage, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    setMessages([...messages, newMessage]);
    onSendMessage?.(input);
    console.log("Message sent:", input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Globe className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-card-border"
              }`}
              data-testid={`message-${message.role}`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-secondary">
                  <span className="text-xs font-medium">You</span>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: イタリアで軽め、20分以内で作れる料理"
            className="flex-1"
            data-testid="input-chat"
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!input.trim()}
            data-testid="button-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
