"use client"

import { Clock, ChefHat, Users, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import type { Recipe } from "@/lib/db/schema"

interface RecipeDetailProps {
  recipe: Recipe
}

const difficultyConfig = {
  easy: { label: "簡単", color: "bg-chart-2 text-white" },
  medium: { label: "普通", color: "bg-chart-4 text-white" },
  hard: { label: "難しい", color: "bg-destructive text-destructive-foreground" },
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const initialServings = recipe.servings || 2
  const [servings, setServings] = useState(initialServings)
  const servingMultiplier = servings / initialServings

  const difficulty = (recipe.difficulty as "easy" | "medium" | "hard") || "medium"
  const nutrition = recipe.nutrition as any

  const adjustedNutrition = nutrition
    ? {
        kcal: Math.round((nutrition.calories || 0) * servingMultiplier),
        p: Math.round((nutrition.protein || 0) * servingMultiplier),
        f: Math.round((nutrition.fat || 0) * servingMultiplier),
        c: Math.round((nutrition.carbs || 0) * servingMultiplier),
      }
    : { kcal: 0, p: 0, f: 0, c: 0 }

  const totalMacros = adjustedNutrition.p + adjustedNutrition.f + adjustedNutrition.c

  return (
    <div className="space-y-6">
      {recipe.imageUrl && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-display font-bold mb-2">{recipe.name}</h1>
            <p className="text-lg">{recipe.region}</p>
          </div>
        </div>
      )}

      {!recipe.imageUrl && (
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">{recipe.name}</h1>
          <p className="text-muted-foreground">{recipe.region}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[200px]">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">調理時間</p>
              <p className="text-xl font-semibold">{recipe.cookingTime || 30}分</p>
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
                <span
                  className="text-xl font-semibold w-12 text-center"
                  data-testid="text-servings"
                >
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
          {recipe.ingredients.map((ingredient, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start border-b pb-2 last:border-0"
            >
              <p className="font-medium">{ingredient}</p>
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
          {recipe.instructions.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                {idx + 1}
              </div>
              <p className="flex-1 pt-1">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {nutrition && (
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
                <Progress
                  value={totalMacros > 0 ? (adjustedNutrition.p / totalMacros) * 100 : 0}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>脂質</span>
                  <span className="font-medium">{adjustedNutrition.f}g</span>
                </div>
                <Progress
                  value={totalMacros > 0 ? (adjustedNutrition.f / totalMacros) * 100 : 0}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>炭水化物</span>
                  <span className="font-medium">{adjustedNutrition.c}g</span>
                </div>
                <Progress
                  value={totalMacros > 0 ? (adjustedNutrition.c / totalMacros) * 100 : 0}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
