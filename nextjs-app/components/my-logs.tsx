"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import FoodLogForm from "@/components/food-log-form"
import {
  MapPin,
  Star,
  Trash2,
  ChefHat,
  UtensilsCrossed,
  Bookmark,
  Loader2,
} from "lucide-react"
import type { FoodLog, Recipe } from "@/lib/db/schema"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? "fill-chart-4 text-chart-4" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  )
}

function LogCard({ log, onDelete }: { log: FoodLog; onDelete: (id: string) => void }) {
  return (
    <Card data-testid={`card-log-${log.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            {log.imageUrl ? (
              <img
                src={log.imageUrl}
                alt={log.dishName}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                {log.type === "cooked" ? (
                  <ChefHat className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="font-semibold text-base"
                  data-testid={`text-log-name-${log.id}`}
                >
                  {log.dishName}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {log.type === "cooked" ? "作った" : "食べた"}
                </Badge>
              </div>
              {log.region && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span data-testid={`text-log-region-${log.id}`}>{log.region}</span>
                </div>
              )}
              <p
                className="text-xs text-muted-foreground mt-1"
                data-testid={`text-log-date-${log.id}`}
              >
                {new Date(log.date).toLocaleDateString("ja-JP")}
              </p>
              {log.rating ? <StarRating rating={log.rating} /> : null}
              {log.notes && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{log.notes}</p>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(log.id)}
            className="flex-shrink-0"
            data-testid={`button-delete-log-${log.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SavedRecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card data-testid={`card-saved-${recipe.id}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <ChefHat className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{recipe.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{recipe.region}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              保存日: {new Date(recipe.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <Bookmark className="h-4 w-4 text-primary fill-primary flex-shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyLogs() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: logs = [], isLoading: logsLoading } = useQuery<FoodLog[]>({
    queryKey: ["/api/logs"],
    queryFn: () => fetch("/api/logs").then((r) => r.json()),
  })

  const { data: savedRecipes = [], isLoading: savedLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes/saved"],
    queryFn: () => fetch("/api/recipes/saved").then((r) => r.json()),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/logs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("削除に失敗しました")
      return res.json()
    },
    onSuccess: () => {
      toast({ title: "記録を削除しました" })
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] })
    },
    onError: () => {
      toast({ title: "エラー", description: "削除に失敗しました", variant: "destructive" })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("この記録を削除しますか？")) {
      deleteMutation.mutate(id)
    }
  }

  if (logsLoading || savedLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">マイログ</h1>
          <p className="text-muted-foreground">料理の記録を管理しましょう</p>
        </div>
        <FoodLogForm />
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="logs" data-testid="tab-logs">
            食べた・作った
          </TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved">
            保存済み
          </TabsTrigger>
          <TabsTrigger value="queue" data-testid="tab-queue">
            下書き
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">まだ記録がありません</p>
              <p className="text-sm mt-2">
                料理を作ったり食べたりしたら記録してみましょう
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <LogCard key={log.id} log={log} onDelete={handleDelete} />
            ))
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">保存されたレシピはありません</p>
              <p className="text-sm mt-2">
                チャットで気になるレシピを見つけたら保存しましょう
              </p>
            </div>
          ) : (
            savedRecipes.map((recipe) => (
              <SavedRecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">
            <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">下書きに追加されたレシピはありません</p>
            <p className="text-sm mt-2">
              気になるレシピを下書きに追加して、週献立を計画しましょう
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
