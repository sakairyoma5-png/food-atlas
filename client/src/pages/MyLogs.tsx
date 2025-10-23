import FoodLogCard from "@/components/FoodLogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { FoodLog, Recipe } from "@shared/schema";

export default function MyLogs() {
  const { data: logs = [], isLoading: logsLoading } = useQuery<FoodLog[]>({
    queryKey: ["/api/logs"],
  });

  const { data: savedRecipes = [], isLoading: savedLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes/saved"],
  });

  if (logsLoading || savedLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-2">マイログ</h1>
        <p className="text-muted-foreground mb-6">
          料理の記録を管理しましょう
        </p>

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
                <p>まだ記録がありません</p>
                <p className="text-sm mt-2">
                  料理を作ったり食べたりしたら記録してみましょう
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <FoodLogCard
                  key={log.id}
                  id={log.id}
                  dishName={log.dishName}
                  country={log.region || ""}
                  date={new Date(log.date).toLocaleDateString("ja-JP")}
                  rating={log.rating || 0}
                  imageUrl={log.imageUrl || undefined}
                  notes={log.notes || undefined}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedRecipes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>保存されたレシピはありません</p>
              </div>
            ) : (
              savedRecipes.map((recipe) => (
                <FoodLogCard
                  key={recipe.id}
                  id={recipe.id}
                  dishName={recipe.name}
                  country={recipe.region}
                  date={`保存日: ${new Date(recipe.createdAt).toLocaleDateString("ja-JP")}`}
                  rating={0}
                  imageUrl={recipe.imageUrl || undefined}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="queue" className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <p>下書きに追加されたレシピはありません</p>
              <p className="text-sm mt-2">
                気になるレシピを下書きに追加して、週献立を計画しましょう
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
