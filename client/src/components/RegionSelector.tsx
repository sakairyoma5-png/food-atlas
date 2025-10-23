import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Region as RegionType } from "@shared/schema";

interface RegionSelectorProps {
  onRegionSelect?: (regionKey: string) => void;
}

export default function RegionSelector({ onRegionSelect }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [aiComment, setAiComment] = useState<string>("");

  const { data: regions = [], isLoading } = useQuery<RegionType[]>({
    queryKey: ["/api/regions"],
  });

  const handleRegionClick = (region: RegionType) => {
    setSelectedRegion(region.id);
    onRegionSelect?.(region.id);
    
    const sampleDishes = (region.sampleDishes || []) as string[];
    if (sampleDishes.length >= 2) {
      const comment = `${region.name}ですね！代表的な料理は「${sampleDishes[0]}」と「${sampleDishes[1]}」です。`;
      setAiComment(comment);
    } else if (sampleDishes.length === 1) {
      const comment = `${region.name}ですね！代表的な料理は「${sampleDishes[0]}」です。`;
      setAiComment(comment);
    } else {
      const comment = `${region.name}ですね！興味深い料理文化があります。`;
      setAiComment(comment);
    }
    console.log(`Region selected: ${region.id}`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">地域情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold mb-2">世界の味を探索</h2>
        <p className="text-muted-foreground">気になる地域を選んでください</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {regions.map((region) => (
          <Card
            key={region.id}
            className={`cursor-pointer hover-elevate transition-all ${
              selectedRegion === region.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleRegionClick(region)}
            data-testid={`card-region-${region.id}`}
          >
            <CardContent className="p-4 text-center">
              <MapPin className={`h-8 w-8 mx-auto mb-2 ${
                selectedRegion === region.id ? "text-primary" : "text-muted-foreground"
              }`} />
              <p className="font-semibold text-sm">{region.name}</p>
              <p className="text-xs text-muted-foreground">{region.country}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {aiComment && selectedRegion && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-accent text-lg leading-relaxed" data-testid="text-ai-comment">
                  {aiComment}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {regions
                    .find((r) => r.id === selectedRegion)
                    ?.sampleDishes?.map((dish) => (
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
