import { useState } from "react";
import { useLocation } from "wouter";
import ChatInterface from "@/components/ChatInterface";
import RecipeCard from "@/components/RecipeCard";
import CulturalFactToast from "@/components/CulturalFactToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "@shared/schema";
import { MessageSquare, Map, Clock } from "lucide-react";
import heroImg from "@assets/generated_images/International_dishes_overhead_shot_05962886.png";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";
import indianImg from "@assets/generated_images/Indian_butter_chicken_curry_792b4e83.png";

type ExploreMode = 'none' | 'chat' | 'map';

export default function Home() {
  const [, setLocation] = useLocation();
  const [exploreMode, setExploreMode] = useState<ExploreMode>('none');
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

  const handleExploreChat = () => {
    setExploreMode('chat');
    setTimeout(() => {
      const chatSection = document.getElementById("chat-section");
      chatSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExploreMap = () => {
    setLocation("/map");
  };

  // おすすめ料理のモックデータ
  const recommendedDishes = [
    {
      id: "1",
      name: "カポナータ",
      region: "イタリア - 南イタリア",
      description: "シチリアの伝統的な野菜料理",
      cookingTime: 15,
      calories: 180,
      imageUrl: caponataImg,
      difficulty: "easy" as const,
    },
    {
      id: "2",
      name: "ガパオライス",
      region: "タイ",
      description: "バジルの香りが食欲をそそる",
      cookingTime: 20,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "medium" as const,
    },
    {
      id: "3",
      name: "バターチキン",
      region: "インド - 北インド",
      description: "まろやかなトマトクリームソース",
      cookingTime: 30,
      calories: 510,
      imageUrl: indianImg,
      difficulty: "medium" as const,
    },
  ];

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
              const exploreSection = document.getElementById("explore-section");
              exploreSection?.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-start-exploring"
          >
            探索を始める
          </Button>
        </div>
      </section>

      {exploreMode === 'none' ? (
        <>
          {/* 探索方法選択セクション */}
          <section id="explore-section" className="py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  どのように探しますか？
                </h2>
                <p className="text-lg text-muted-foreground">
                  あなたに合った方法で世界の料理を発見しましょう
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden hover-elevate cursor-pointer" onClick={handleExploreChat} data-testid="card-explore-chat">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3">
                      チャットで探す
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      AIと会話しながら、あなたの好みや条件にぴったりの料理を見つけます
                    </p>
                    <Button variant="default" className="w-full" data-testid="button-chat-explore">
                      チャットを始める
                    </Button>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover-elevate cursor-pointer" onClick={handleExploreMap} data-testid="card-explore-map">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Map className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3">
                      地図から探す
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      世界地図から地域を選んで、その土地の伝統料理を探索します
                    </p>
                    <Button variant="default" className="w-full" data-testid="button-map-explore">
                      地図を見る
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* おすすめ料理セクション */}
          <section className="py-20 bg-background">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  今日のおすすめ料理
                </h2>
                <p className="text-lg text-muted-foreground">
                  人気の料理から始めてみませんか？
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedDishes.map((dish) => (
                  <Card key={dish.id} className="overflow-hidden hover-elevate" data-testid={`card-recipe-${dish.id}`}>
                    <div className="relative aspect-[4/3]">
                      <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-xl font-display font-semibold" data-testid={`text-recipe-name-${dish.id}`}>
                          {dish.name}
                        </h3>
                        <p className="text-sm" data-testid={`text-recipe-region-${dish.id}`}>
                          {dish.region}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span data-testid={`text-recipe-time-${dish.id}`}>{dish.cookingTime}分</span>
                        </div>
                        <Badge 
                          className={
                            dish.difficulty === 'easy' 
                              ? 'bg-chart-2 text-white' 
                              : 'bg-chart-4 text-white'
                          }
                          data-testid={`badge-recipe-difficulty-${dish.id}`}
                        >
                          {dish.difficulty === 'easy' ? '簡単' : '普通'}
                        </Badge>
                        <span className="text-muted-foreground" data-testid={`text-recipe-calories-${dish.id}`}>
                          {dish.calories}kcal
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-recipe-description-${dish.id}`}>
                        {dish.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : exploreMode === 'chat' ? (
        <section id="chat-section" className="flex-1 bg-background">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-display font-semibold">
                今日はどんな料理を作りますか？
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setExploreMode('none')}
                data-testid="button-back-to-explore"
              >
                探索方法に戻る
              </Button>
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
      ) : null}
    </div>
  );
}
