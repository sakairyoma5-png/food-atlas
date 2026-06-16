"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  DollarSign,
  ShoppingCart,
  Trash2,
  Loader2,
  Plus,
  Lock,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { MealPlan, UserSubscription } from "@/lib/db/schema"

const BUDGET_THRESHOLDS = {
  MIN: 10000,
  VERY_TIGHT: 15000,
  TIGHT: 20000,
}

export default function MealPlansView() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [budget, setBudget] = useState("")
  const [preferences, setPreferences] = useState("")

  const { data: subscription } = useQuery<UserSubscription>({
    queryKey: ["/api/subscription"],
    queryFn: () => fetch("/api/subscription").then((r) => r.json()),
  })

  const { data: mealPlans, isLoading } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
    queryFn: () => fetch("/api/meal-plans").then((r) => r.json()),
  })

  const isPremium =
    subscription?.plan === "premium" &&
    (subscription?.status === "active" || subscription?.status === "past_due")
  const isUnpaid = subscription?.status === "unpaid"
  const isPastDue = subscription?.status === "past_due"

  const budgetStatus = useMemo(() => {
    const budgetNum = parseFloat(budget)
    if (!budget || isNaN(budgetNum)) return { valid: false, level: "empty", message: null }
    if (budgetNum < BUDGET_THRESHOLDS.MIN) {
      return {
        valid: false,
        level: "error",
        message: `最低${BUDGET_THRESHOLDS.MIN.toLocaleString()}円以上の予算が必要です`,
        dailyBudget: Math.round(budgetNum / 30),
      }
    }
    if (budgetNum < BUDGET_THRESHOLDS.VERY_TIGHT) {
      return {
        valid: true,
        level: "warning",
        message: `この予算は非常に厳しいです（1日約${Math.round(budgetNum / 30).toLocaleString()}円）。実際の食費が超過する可能性があります。`,
        dailyBudget: Math.round(budgetNum / 30),
      }
    }
    if (budgetNum < BUDGET_THRESHOLDS.TIGHT) {
      return {
        valid: true,
        level: "info",
        message: `節約を意識したプランになります（1日約${Math.round(budgetNum / 30).toLocaleString()}円）`,
        dailyBudget: Math.round(budgetNum / 30),
      }
    }
    return {
      valid: true,
      level: "ok",
      message: null,
      dailyBudget: Math.round(budgetNum / 30),
    }
  }, [budget])

  const createMutation = useMutation({
    mutationFn: async () => {
      const budgetNum = parseFloat(budget)
      if (!budgetStatus.valid) throw new Error(budgetStatus.message || "有効な予算を入力してください")

      const res = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: budgetNum, preferences: preferences || undefined }),
      })

      if (res.status === 403) {
        const data = await res.json()
        const err: any = new Error(data.message || "この機能はプレミアムプラン限定です")
        err.requiresPremium = data.requiresPremium
        throw err
      }
      if (!res.ok) {
        const data = await res.json()
        const err: any = new Error(data.message || "献立プランの作成に失敗しました")
        err.code = data.code
        throw err
      }
      return res.json()
    },
    onSuccess: () => {
      toast({ title: "成功", description: "献立プランが作成されました" })
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] })
      setShowCreateDialog(false)
      setBudget("")
      setPreferences("")
    },
    onError: (error: any) => {
      if (error.requiresPremium) {
        toast({
          title: "プレミアムプラン限定機能",
          description: "献立プラン生成機能を使用するにはプレミアムプランへのアップグレードが必要です",
          variant: "destructive",
        })
        setShowCreateDialog(false)
      } else if (error.code === "BUDGET_TOO_LOW") {
        toast({ title: "予算が不足しています", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "エラー", description: error.message || "献立プランの作成に失敗しました", variant: "destructive" })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("削除に失敗しました")
      return res.json()
    },
    onSuccess: () => {
      toast({ title: "成功", description: "献立プランを削除しました" })
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] })
    },
    onError: () => {
      toast({ title: "エラー", description: "献立プランの削除に失敗しました", variant: "destructive" })
    },
  })

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscription/upgrade", { method: "POST" })
      if (!res.ok) throw new Error("プレミアムプランへのアップグレードに失敗しました")
      return res.json()
    },
    onSuccess: () => {
      toast({ title: "成功", description: "プレミアムプランにアップグレードしました" })
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] })
    },
    onError: (error: any) => {
      toast({ title: "エラー", description: error.message, variant: "destructive" })
    },
  })

  const handleCreate = () => {
    if (!budgetStatus.valid) {
      toast({ title: "入力エラー", description: budgetStatus.message || "有効な予算を入力してください", variant: "destructive" })
      return
    }
    createMutation.mutate()
  }

  const handleDelete = (id: string) => {
    if (confirm("この献立プランを削除しますか？")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">献立プラン</h1>
          <p className="text-muted-foreground">予算に合わせた月間献立を自動生成</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          disabled={isUnpaid}
          data-testid="button-create-meal-plan"
        >
          <Plus className="h-4 w-4 mr-2" />
          新しいプラン作成
        </Button>
      </div>

      {isUnpaid && (
        <Alert variant="destructive" className="mb-6" data-testid="alert-payment-unpaid">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>お支払いが完了していません</AlertTitle>
          <AlertDescription>
            猶予期間が終了したため、プレミアム機能をご利用いただけません。
            お支払いを完了すると、すぐにプレミアム機能が再開されます。
          </AlertDescription>
        </Alert>
      )}

      {isPastDue && subscription?.gracePeriodEnd && (
        <Alert
          className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20"
          data-testid="alert-payment-past-due"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            お支払いの確認ができていません
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {format(new Date(subscription.gracePeriodEnd), "M月d日", { locale: ja })}
            までにお支払いをお願いします。期限を過ぎるとプレミアム機能がご利用いただけなくなります。
          </AlertDescription>
        </Alert>
      )}

      {!isPremium && !isUnpaid && (
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-chart-2/5">
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
            <Button
              onClick={() => upgradeMutation.mutate()}
              disabled={upgradeMutation.isPending}
              data-testid="button-upgrade-premium"
            >
              {upgradeMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />アップグレード中...</>
              ) : "プレミアムプランにアップグレード"}
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
            <Card key={plan.id} className="hover-elevate" data-testid={`card-meal-plan-${plan.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 truncate">{plan.title}</CardTitle>
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
                    <span data-testid={`text-budget-${plan.id}`}>{plan.budget.toLocaleString()}円</span>
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
                {plan.isPremium && <Badge variant="default">プレミアム</Badge>}
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
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground mb-4">まだ献立プランがありません</p>
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-first-plan">
              最初のプランを作成
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent data-testid="dialog-create-meal-plan">
          <form onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <DialogHeader>
              <DialogTitle>新しい献立プランを作成</DialogTitle>
              <DialogDescription>
                予算と好みを入力して、世界中の料理から月間献立を自動生成します
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="budget">月間予算（円）</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="例: 30000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min={BUDGET_THRESHOLDS.MIN}
                  data-testid="input-budget"
                />
                {budgetStatus.dailyBudget && budgetStatus.level !== "error" && (
                  <p className="text-xs text-muted-foreground">
                    1日あたり約{budgetStatus.dailyBudget.toLocaleString()}円
                  </p>
                )}
              </div>

              {budget === "" && (
                <p className="text-xs text-muted-foreground" data-testid="helper-budget-empty">
                  月額10,000円以上の予算を入力してください
                </p>
              )}

              {budgetStatus.level === "error" && budgetStatus.message && (
                <Alert variant="destructive" data-testid="alert-budget-error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{budgetStatus.message}</AlertDescription>
                </Alert>
              )}

              {budgetStatus.level === "warning" && budgetStatus.message && (
                <Alert
                  className="border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                  data-testid="alert-budget-warning"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    {budgetStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {budgetStatus.level === "info" && budgetStatus.message && (
                <Alert
                  className="border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  data-testid="alert-budget-info"
                >
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    {budgetStatus.message}
                  </AlertDescription>
                </Alert>
              )}

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
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                data-testid="button-cancel"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !budgetStatus.valid}
                data-testid="button-generate"
              >
                {createMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />生成中...</>
                ) : "生成"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
