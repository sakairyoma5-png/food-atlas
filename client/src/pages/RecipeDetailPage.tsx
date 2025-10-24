import RecipeDetail from "@/components/RecipeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookMarked } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Recipe } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RecipeDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const recipeId = params.id;
  const { toast } = useToast();

  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logType, setLogType] = useState<"cooking" | "eating">("cooking");
  const [logNotes, setLogNotes] = useState("");
  const [logRating, setLogRating] = useState<string>("5");

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ["/api/recipes", recipeId],
    enabled: !!recipeId,
  });

  const createLogMutation = useMutation({
    mutationFn: async () => {
      if (!recipe) return;
      
      const response = await apiRequest(
        "POST",
        "/api/food-logs",
        {
          recipeId: recipe.id,
          dishName: recipe.name,
          region: recipe.region,
          type: logType,
          rating: parseInt(logRating),
          notes: logNotes || undefined,
          date: new Date().toISOString(),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "成功",
        description: "フードログに登録しました",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food-logs"] });
      setShowLogDialog(false);
      setLogNotes("");
      setLogRating("5");
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "フードログの登録に失敗しました",
        variant: "destructive",
      });
      console.error("Failed to create food log:", error);
    },
  });

  const handleCreateLog = () => {
    createLogMutation.mutate();
  };

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
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <Button
            variant="default"
            onClick={() => setShowLogDialog(true)}
            data-testid="button-add-to-log"
          >
            <BookMarked className="h-4 w-4 mr-2" />
            マイログに登録
          </Button>
        </div>

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

      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent data-testid="dialog-create-log">
          <DialogHeader>
            <DialogTitle>マイログに登録</DialogTitle>
            <DialogDescription>
              {recipe.name}の体験を記録しましょう
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="log-type">タイプ</Label>
              <Select value={logType} onValueChange={(value) => setLogType(value as "cooking" | "eating")}>
                <SelectTrigger id="log-type" data-testid="select-log-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cooking">調理した</SelectItem>
                  <SelectItem value="eating">食べた</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-rating">評価</Label>
              <Select value={logRating} onValueChange={setLogRating}>
                <SelectTrigger id="log-rating" data-testid="select-log-rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 最高</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 良い</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 普通</SelectItem>
                  <SelectItem value="2">⭐⭐ イマイチ</SelectItem>
                  <SelectItem value="1">⭐ 悪い</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-notes">メモ（オプション）</Label>
              <Textarea
                id="log-notes"
                placeholder="感想やメモを記録できます"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                rows={4}
                data-testid="textarea-log-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogDialog(false)}
              data-testid="button-cancel-log"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateLog}
              disabled={createLogMutation.isPending}
              data-testid="button-submit-log"
            >
              {createLogMutation.isPending ? "登録中..." : "登録"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
