import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

interface Region {
  key: string;
  name: string;
  country: string;
  sampleDishes: string[];
}

interface RegionSelectorProps {
  onRegionSelect?: (regionKey: string) => void;
}

const regions: Region[] = [
  { key: "IT-S", name: "南イタリア", country: "イタリア", sampleDishes: ["カポナータ", "アランチーニ"] },
  { key: "IT-N", name: "北イタリア", country: "イタリア", sampleDishes: ["リゾット", "ポレンタ"] },
  { key: "CHN-SC", name: "四川", country: "中国", sampleDishes: ["麻婆豆腐", "火鍋"] },
  { key: "JPN-KANSAI", name: "関西", country: "日本", sampleDishes: ["お好み焼き", "たこ焼き"] },
  { key: "IND-N", name: "北インド", country: "インド", sampleDishes: ["バターチキン", "チャパティ"] },
  { key: "TH", name: "タイ", country: "タイ", sampleDishes: ["ガパオ", "トムヤム"] },
  { key: "MEX", name: "メキシコ", country: "メキシコ", sampleDishes: ["タコス", "ポソレ"] },
  { key: "FRA-B", name: "バスク", country: "フランス", sampleDishes: ["ピペラード", "バスクチーズケーキ"] },
  { key: "VNM", name: "ベトナム", country: "ベトナム", sampleDishes: ["フォー", "バインセオ"] },
  { key: "KOR", name: "韓国", country: "韓国", sampleDishes: ["ビビンバ", "キムチチゲ"] },
];

export default function RegionSelector({ onRegionSelect }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [aiComment, setAiComment] = useState<string>("");

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region.key);
    onRegionSelect?.(region.key);
    
    const comment = `${region.name}ですね！代表的な料理は「${region.sampleDishes[0]}」と「${region.sampleDishes[1]}」です。調理時間は15〜35分程度です。`;
    setAiComment(comment);
    console.log(`Region selected: ${region.key}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold mb-2">世界の味を探索</h2>
        <p className="text-muted-foreground">気になる地域を選んでください</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {regions.map((region) => (
          <Card
            key={region.key}
            className={`cursor-pointer hover-elevate transition-all ${
              selectedRegion === region.key ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleRegionClick(region)}
            data-testid={`card-region-${region.key}`}
          >
            <CardContent className="p-4 text-center">
              <MapPin className={`h-8 w-8 mx-auto mb-2 ${
                selectedRegion === region.key ? "text-primary" : "text-muted-foreground"
              }`} />
              <p className="font-semibold text-sm">{region.name}</p>
              <p className="text-xs text-muted-foreground">{region.country}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {aiComment && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-accent text-lg leading-relaxed" data-testid="text-ai-comment">
                  {aiComment}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {selectedRegion &&
                    regions
                      .find((r) => r.key === selectedRegion)
                      ?.sampleDishes.map((dish) => (
                        <button
                          key={dish}
                          className="text-sm px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                          onClick={() => console.log(`Dish clicked: ${dish}`)}
                          data-testid={`button-dish-${dish}`}
                        >
                          {dish}
                        </button>
                      ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
