import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import RecipeCard from "@/components/RecipeCard";
import QuickActionChips from "@/components/QuickActionChips";
import CulturalFactToast from "@/components/CulturalFactToast";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "@shared/schema";
import heroImg from "@assets/generated_images/International_dishes_overhead_shot_05962886.png";

export default function Home() {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [showCulturalFact, setShowCulturalFact] = useState(true);
  const [showRecipes, setShowRecipes] = useState(false);

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: currentConversationId 
      ? ["/api/recipes", { conversationId: currentConversationId }] 
      : ["/api/recipes"],
    enabled: showRecipes && !!currentConversationId,
  });

  const handleNewMessage = (conversationId: string, message: string) => {
    console.log("New message:", { conversationId, message });
    setCurrentConversationId(conversationId);
    setShowRecipes(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showCulturalFact && (
        <CulturalFactToast
          fact="世界には数万種類もの料理があり、それぞれに独自の歴史と文化が込められています。"
          detailedFact="世界には数万種類もの料理があり、それぞれに独自の歴史と文化が込められています。地域の気候、利用可能な食材、宗教的・文化的背景などが料理の発展に大きく影響しています。"
          sourceLabel="Food Atlas編集部"
          onDismiss={() => setShowCulturalFact(false)}
        />
      )}

      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImg}
          alt="世界の料理"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            Food Atlas
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            会話で探す、世界中の料理
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/10 backdrop-blur border-white/30 text-white hover:bg-background/20"
            onClick={() => {
              const chatSection = document.getElementById("chat-section");
              chatSection?.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-start-exploring"
          >
            探索を始める
          </Button>
        </div>
      </section>

      <section id="chat-section" className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-semibold mb-4">
              今日はどんな料理を作りますか？
            </h2>
            <QuickActionChips />
          </div>

          <div className="bg-card border border-card-border rounded-lg h-[500px] mb-8">
            <ChatInterface onNewMessage={handleNewMessage} />
          </div>

          {showRecipes && recipes.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-semibold">
                  保存されたレシピ
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.slice(0, 6).map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.name}
                    country={recipe.region}
                    region={recipe.region}
                    timeMin={recipe.cookingTime || 30}
                    difficulty={(recipe.difficulty as "easy" | "medium" | "hard") || "medium"}
                    tags={[recipe.difficulty || "medium"]}
                    teaser={recipe.description || ""}
                    imageUrl={recipe.imageUrl || undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
