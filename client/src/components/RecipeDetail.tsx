import { Clock, ChefHat, Users, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Ingredient {
  name: string;
  qty: string;
  alt?: string;
}

interface NutritionEstimate {
  kcal_per_serv: number;
  p: number;
  f: number;
  c: number;
}

interface RecipeDetailProps {
  title: string;
  country: string;
  region?: string;
  timeMin: number;
  difficulty: "easy" | "medium" | "hard";
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  nutritionEstimate: NutritionEstimate;
  imageUrl?: string;
}

const difficultyConfig = {
  easy: { label: "簡単", color: "bg-chart-2 text-white" },
  medium: { label: "普通", color: "bg-chart-4 text-white" },
  hard: { label: "難しい", color: "bg-destructive text-destructive-foreground" },
};

export default function RecipeDetail({
  title,
  country,
  region,
  timeMin,
  difficulty,
  servings: initialServings,
  ingredients,
  steps,
  nutritionEstimate,
  imageUrl,
}: RecipeDetailProps) {
  const [servings, setServings] = useState(initialServings);
  const servingMultiplier = servings / initialServings;

  const adjustedNutrition = {
    kcal: Math.round(nutritionEstimate.kcal_per_serv * servingMultiplier),
    p: Math.round(nutritionEstimate.p * servingMultiplier),
    f: Math.round(nutritionEstimate.f * servingMultiplier),
    c: Math.round(nutritionEstimate.c * servingMultiplier),
  };

  const totalMacros = adjustedNutrition.p + adjustedNutrition.f + adjustedNutrition.c;

  return (
    <div className="space-y-6">
      {imageUrl && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-display font-bold mb-2">{title}</h1>
            <p className="text-lg">
              {region ? `${country} - ${region}` : country}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[200px]">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">調理時間</p>
              <p className="text-xl font-semibold">{timeMin}分</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[200px]">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">人数</p>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  data-testid="button-decrease-servings"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center" data-testid="text-servings">
                  {servings}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => setServings(servings + 1)}
                  data-testid="button-increase-servings"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[200px]">
          <CardContent className="p-4 flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">難易度</p>
              <Badge className={difficultyConfig[difficulty].color}>
                {difficultyConfig[difficulty].label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">材料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.map((ingredient, idx) => (
            <div key={idx} className="flex justify-between items-start border-b pb-2 last:border-0">
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
                {ingredient.alt && (
                  <p className="text-xs text-muted-foreground mt-1">代替: {ingredient.alt}</p>
                )}
              </div>
              <p className="text-sm font-medium ml-4">{ingredient.qty}</p>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4" data-testid="button-shopping-list">
            <ShoppingCart className="h-4 w-4 mr-2" />
            買い物リストを作成
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">作り方</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                {idx + 1}
              </div>
              <p className="flex-1 pt-1">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">栄養成分（{servings}人前）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{adjustedNutrition.kcal}</p>
            <p className="text-sm text-muted-foreground">カロリー (kcal)</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>タンパク質</span>
                <span className="font-medium">{adjustedNutrition.p}g</span>
              </div>
              <Progress value={(adjustedNutrition.p / totalMacros) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>脂質</span>
                <span className="font-medium">{adjustedNutrition.f}g</span>
              </div>
              <Progress value={(adjustedNutrition.f / totalMacros) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>炭水化物</span>
                <span className="font-medium">{adjustedNutrition.c}g</span>
              </div>
              <Progress value={(adjustedNutrition.c / totalMacros) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
