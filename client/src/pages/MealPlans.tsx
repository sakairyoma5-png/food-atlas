import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MealPlan, UserSubscription } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign, ShoppingCart, Trash2, Loader2, Plus, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function MealPlans() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");

  // Fetch user subscription
  const { data: subscription } = useQuery<UserSubscription>({
    queryKey: ["/api/subscription"],
  });

  const isPremium = subscription?.plan === "premium" && subscription?.status === "active";

  // Fetch meal plans
  const { data: mealPlans, isLoading } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  // Create meal plan mutation
  const createMealPlanMutation = useMutation({
    mutationFn: async () => {
      if (!budget || parseFloat(budget) <= 0) {
        throw new Error("有効な予算を入力してください");
      }

      const response = await apiRequest("POST", "/api/meal-plans/generate", {
        budget: parseFloat(budget),
        preferences: preferences || undefined,
      });

      if (response.status === 403) {
        const data = await response.json();
        const error: any = new Error(data.message || "この機能はプレミアムプラン限定です");
        error.requiresPremium = data.requiresPremium;
        throw error;
      }

      if (!response.ok) {
        throw new Error("献立プランの作成に失敗しました");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "成功",
        description: "献立プランが作成されました",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      setShowCreateDialog(false);
      setBudget("");
      setPreferences("");
    },
    onError: (error: any) => {
      if (error.requiresPremium) {
        toast({
          title: "プレミアムプラン限定機能",
          description: "献立プラン生成機能を使用するにはプレミアムプランへのアップグレードが必要です",
          variant: "destructive",
        });
        setShowCreateDialog(false);
      } else {
        toast({
          title: "エラー",
          description: error.message || "献立プランの作成に失敗しました",
          variant: "destructive",
        });
      }
    },
  });

  // Delete meal plan mutation
  const deleteMealPlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/meal-plans/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "成功",
        description: "献立プランを削除しました",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "献立プランの削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    createMealPlanMutation.mutate();
  };

  const handleDelete = (id: string) => {
    if (confirm("この献立プランを削除しますか？")) {
      deleteMealPlanMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">献立プラン</h2>
            <p className="text-muted-foreground">
              予算に合わせた月間献立を自動生成
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            data-testid="button-create-meal-plan"
          >
            <Plus className="h-4 w-4 mr-2" />
            新しいプラン作成
          </Button>
        </div>

        {!isPremium && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>プレミアムプランで月間献立を自動生成</CardTitle>
              </div>
              <CardDescription>
                予算に応じた栄養バランスの良い月間献立を、世界中の料理から自動生成します。
                買い物リストも自動作成されるので、節約しながら多様な料理を楽しめます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" data-testid="button-upgrade-premium">
                プレミアムプランにアップグレード
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : mealPlans && mealPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <Card
                key={plan.id}
                className="hover-elevate"
                data-testid={`card-meal-plan-${plan.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{plan.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(plan.startDate), "M月d日", { locale: ja })} 〜{" "}
                        {format(new Date(plan.endDate), "M月d日", { locale: ja })}
                      </CardDescription>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(plan.id)}
                      data-testid={`button-delete-${plan.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">予算:</span>
                      <span>{plan.budget.toLocaleString()}円</span>
                    </div>
                    {plan.totalEstimatedCost && (
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">見積:</span>
                        <span>{plan.totalEstimatedCost.toLocaleString()}円</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">献立数:</span>
                      <span>{plan.recipes.length}食</span>
                    </div>
                  </div>

                  {plan.isPremium && (
                    <Badge variant="default">プレミアム</Badge>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid={`button-view-${plan.id}`}
                  >
                    詳細を見る
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                まだ献立プランがありません
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                data-testid="button-create-first-plan"
              >
                最初のプランを作成
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent data-testid="dialog-create-meal-plan">
            <DialogHeader>
              <DialogTitle>新しい献立プランを作成</DialogTitle>
              <DialogDescription>
                予算と好みを入力して、世界中の料理から月間献立を自動生成します
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">月間予算（円）</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="例: 30000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  data-testid="input-budget"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferences">好みや制約（オプション）</Label>
                <Textarea
                  id="preferences"
                  placeholder="例: ベジタリアン、辛い料理が好き、アレルギー: 卵"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  rows={3}
                  data-testid="textarea-preferences"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                data-testid="button-cancel"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMealPlanMutation.isPending}
                data-testid="button-generate"
              >
                {createMealPlanMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "生成"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
