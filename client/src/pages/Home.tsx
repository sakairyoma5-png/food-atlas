import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import RecipeCard from "@/components/RecipeCard";
import QuickActionChips from "@/components/QuickActionChips";
import CulturalFactToast from "@/components/CulturalFactToast";
import { Button } from "@/components/ui/button";
import heroImg from "@assets/generated_images/International_dishes_overhead_shot_05962886.png";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";
import indianImg from "@assets/generated_images/Indian_butter_chicken_curry_792b4e83.png";

//todo: remove mock functionality
const mockRecipes = [
  {
    id: "r_790",
    title: "カポナータ",
    country: "イタリア",
    region: "南イタリア",
    timeMin: 15,
    difficulty: "easy" as const,
    tags: ["野菜", "甘酸っぱい"],
    teaser: "シチリアの伝統的な野菜料理。ナスとトマトの甘酸っぱい味わいが特徴です。",
    imageUrl: caponataImg,
  },
  {
    id: "r_791",
    title: "ガパオライス",
    country: "タイ",
    timeMin: 20,
    difficulty: "medium" as const,
    tags: ["スパイシー", "炒め物"],
    teaser: "タイの定番料理。バジルの香りと辛みが食欲をそそります。",
    imageUrl: thaiImg,
  },
  {
    id: "r_792",
    title: "バターチキン",
    country: "インド",
    region: "北インド",
    timeMin: 30,
    difficulty: "medium" as const,
    tags: ["カレー", "クリーミー"],
    teaser: "北インドの人気カレー。まろやかなトマトクリームソースが特徴。",
    imageUrl: indianImg,
  },
];

export default function Home() {
  const [showRecipes, setShowRecipes] = useState(false);
  const [showCulturalFact, setShowCulturalFact] = useState(true);

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    setShowRecipes(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showCulturalFact && (
        <CulturalFactToast
          fact="カポナータは揚げ焼き野菜に甘酸っぱい味付けをする郷土料理。地方により砂糖や松の実を加えることも。"
          detailedFact="カポナータは揚げ焼き野菜に甘酸っぱい味付けをする郷土料理。地方により砂糖や松の実を加えることも。シチリアの夏の定番料理で、冷やして食べるのが一般的です。ナスを主役に、トマト、セロリ、オリーブ、ケッパーなどが入り、ビネガーと砂糖で甘酸っぱく仕上げます。"
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
            <ChatInterface onSendMessage={handleSendMessage} />
          </div>

          {showRecipes && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-semibold">
                  おすすめレシピ
                </h3>
                <Button variant="outline" data-testid="button-more-recipes">
                  さらに3件
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
