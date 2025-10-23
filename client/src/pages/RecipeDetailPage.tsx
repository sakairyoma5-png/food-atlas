import RecipeDetail from "@/components/RecipeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "@shared/schema";

export default function RecipeDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const recipeId = params.id;

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", recipeId],
    enabled: !!recipeId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <p className="text-muted-foreground">レシピが見つかりませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>

        <RecipeDetail
          title={recipe.name}
          country={recipe.region}
          region={recipe.region}
          timeMin={recipe.cookingTime || 30}
          difficulty={(recipe.difficulty as "easy" | "medium" | "hard") || "medium"}
          servings={recipe.servings || 2}
          ingredients={recipe.ingredients.map((ing, idx) => ({
            name: ing,
            qty: "",
            alt: recipe.alternatives?.[idx]?.alternatives?.[0],
          }))}
          steps={recipe.instructions}
          nutritionEstimate={recipe.nutrition ? {
            kcal_per_serv: recipe.nutrition.calories || 0,
            p: recipe.nutrition.protein || 0,
            f: recipe.nutrition.fat || 0,
            c: recipe.nutrition.carbs || 0,
          } : {
            kcal_per_serv: 0,
            p: 0,
            f: 0,
            c: 0,
          }}
          imageUrl={recipe.imageUrl || undefined}
        />
      </div>
    </div>
  );
}
