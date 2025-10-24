import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { useLocation } from "wouter";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";
import indianImg from "@assets/generated_images/Indian_butter_chicken_curry_792b4e83.png";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 世界の代表的な料理データ（国別）
const dishesbyCountry: Record<string, Array<{
  id: string;
  name: string;
  region: string;
  description: string;
  cookingTime: number;
  calories: number;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}>> = {
  "Italy": [
    {
      id: "caponata-1",
      name: "カポナータ",
      region: "イタリア - 南イタリア",
      description: "シチリアの伝統的な野菜料理",
      cookingTime: 15,
      calories: 180,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
    {
      id: "carbonara-1",
      name: "カルボナーラ",
      region: "イタリア - ローマ",
      description: "クリーミーなパスタの定番",
      cookingTime: 20,
      calories: 520,
      imageUrl: caponataImg,
      difficulty: "medium",
    },
  ],
  "Thailand": [
    {
      id: "gapao-1",
      name: "ガパオライス",
      region: "タイ",
      description: "バジルの香りが食欲をそそる",
      cookingTime: 20,
      calories: 420,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
    {
      id: "tom-yum-1",
      name: "トムヤムクン",
      region: "タイ",
      description: "辛酸っぱいスープの代表格",
      cookingTime: 30,
      calories: 150,
      imageUrl: thaiImg,
      difficulty: "medium",
    },
  ],
  "India": [
    {
      id: "butter-chicken-1",
      name: "バターチキン",
      region: "インド - 北インド",
      description: "まろやかなトマトクリームソース",
      cookingTime: 30,
      calories: 510,
      imageUrl: indianImg,
      difficulty: "medium",
    },
    {
      id: "biryani-1",
      name: "ビリヤニ",
      region: "インド",
      description: "スパイス香る炊き込みご飯",
      cookingTime: 45,
      calories: 450,
      imageUrl: indianImg,
      difficulty: "hard",
    },
  ],
  "Japan": [
    {
      id: "ramen-1",
      name: "ラーメン",
      region: "日本",
      description: "日本の国民食",
      cookingTime: 40,
      calories: 480,
      imageUrl: thaiImg,
      difficulty: "hard",
    },
  ],
  "France": [
    {
      id: "ratatouille-1",
      name: "ラタトゥイユ",
      region: "フランス - プロヴァンス",
      description: "夏野菜の煮込み料理",
      cookingTime: 35,
      calories: 200,
      imageUrl: caponataImg,
      difficulty: "easy",
    },
  ],
  "Mexico": [
    {
      id: "tacos-1",
      name: "タコス",
      region: "メキシコ",
      description: "手軽に楽しめる伝統料理",
      cookingTime: 25,
      calories: 350,
      imageUrl: thaiImg,
      difficulty: "easy",
    },
  ],
};

// デフォルトで表示する世界の代表的な料理
const defaultDishes = [
  dishesbyCountry["Italy"][0],
  dishesbyCountry["Thailand"][0],
  dishesbyCountry["India"][0],
  dishesbyCountry["Japan"][0],
  dishesbyCountry["France"][0],
  dishesbyCountry["Mexico"][0],
];

export default function MapView() {
  const [, setLocation] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const displayedDishes = selectedCountry && dishesbyCountry[selectedCountry]
    ? dishesbyCountry[selectedCountry]
    : defaultDishes;

  const handleCountryClick = (geo: { properties: { name: string } }) => {
    const countryName = geo.properties.name;
    setSelectedCountry(countryName);
  };

  const handleCardClick = (dishId: string) => {
    // Note: Currently using mock dish IDs. In production, these should map to actual recipe IDs
    // For now, navigate to home page and suggest using chat to find similar dishes
    setLocation("/");
    console.log("Navigate to dish:", dishId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">世界の味を探索</h2>
          <p className="text-muted-foreground">
            {selectedCountry
              ? `${selectedCountry}の料理を見る`
              : "地球儀をクリックして地域の料理を発見しましょう"}
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-lg overflow-hidden mb-8">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 150,
            }}
            style={{
              width: "100%",
              height: "auto",
            }}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const countryName = geo.properties.name;
                    const hasDeishes = !!dishesbyCountry[countryName];
                    const isSelected = selectedCountry === countryName;
                    const isHovered = hoveredCountry === countryName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredCountry(countryName)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleCountryClick(geo)}
                        style={{
                          default: {
                            fill: isSelected
                              ? "hsl(var(--primary))"
                              : hasDeishes
                              ? "hsl(var(--chart-2))"
                              : "hsl(var(--muted))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: hasDeishes
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: hasDeishes ? "pointer" : "default",
                          },
                          pressed: {
                            fill: "hsl(var(--primary))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                        }}
                        data-testid={`geography-${countryName}`}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-semibold">
              {selectedCountry ? `${selectedCountry}の料理` : "世界の代表的な料理"}
            </h3>
            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-sm text-primary hover:underline"
                data-testid="button-clear-selection"
              >
                すべて表示
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDishes.map((dish) => (
              <Card
                key={dish.id}
                className="overflow-hidden hover-elevate cursor-pointer"
                onClick={() => handleCardClick(dish.id)}
                data-testid={`card-dish-${dish.id}`}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-display font-semibold" data-testid={`text-dish-name-${dish.id}`}>
                      {dish.name}
                    </h3>
                    <p className="text-sm" data-testid={`text-dish-region-${dish.id}`}>
                      {dish.region}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span data-testid={`text-dish-time-${dish.id}`}>{dish.cookingTime}分</span>
                    </div>
                    <Badge
                      className={
                        dish.difficulty === "easy"
                          ? "bg-chart-2 text-white"
                          : dish.difficulty === "medium"
                          ? "bg-chart-4 text-white"
                          : "bg-destructive text-destructive-foreground"
                      }
                      data-testid={`badge-dish-difficulty-${dish.id}`}
                    >
                      {dish.difficulty === "easy"
                        ? "簡単"
                        : dish.difficulty === "medium"
                        ? "普通"
                        : "難しい"}
                    </Badge>
                    <span className="text-muted-foreground" data-testid={`text-dish-calories-${dish.id}`}>
                      {dish.calories}kcal
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-dish-description-${dish.id}`}>
                    {dish.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
