import FoodLogCard from "@/components/FoodLogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";

//todo: remove mock functionality
const mockLogs = [
  {
    id: "log_1",
    dishName: "カポナータ",
    country: "イタリア",
    region: "南イタリア",
    date: "2025年10月20日",
    rating: 5,
    imageUrl: caponataImg,
    notes: "とても美味しかった！家族にも好評でした。",
  },
  {
    id: "log_2",
    dishName: "ガパオライス",
    country: "タイ",
    date: "2025年10月18日",
    rating: 4,
    imageUrl: thaiImg,
    notes: "辛さがちょうど良かった。次回はもう少しバジルを多めに。",
  },
];

const mockSaved = [
  {
    id: "save_1",
    dishName: "バターチキン",
    country: "インド",
    region: "北インド",
    date: "保存日: 2025年10月22日",
    rating: 0,
  },
];

export default function MyLogs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-2">マイログ</h1>
        <p className="text-muted-foreground mb-6">
          前回はタイ料理を作りましたね。今日はインド料理にしますか？
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
            {mockLogs.map((log) => (
              <FoodLogCard key={log.id} {...log} />
            ))}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {mockSaved.map((item) => (
              <FoodLogCard key={item.id} {...item} />
            ))}
            <div className="text-center py-12 text-muted-foreground">
              <p>他に保存されたレシピはありません</p>
            </div>
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
