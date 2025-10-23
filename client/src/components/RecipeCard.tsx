import { Clock, ChefHat, MapPin, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface RecipeCardProps {
  id: string;
  title: string;
  country: string;
  region?: string;
  timeMin: number;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
  teaser?: string;
  imageUrl?: string;
  onSave?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

const difficultyConfig = {
  easy: { label: "簡単", color: "bg-chart-2 text-white" },
  medium: { label: "普通", color: "bg-chart-4 text-white" },
  hard: { label: "難しい", color: "bg-destructive text-destructive-foreground" },
};

export default function RecipeCard({
  id,
  title,
  country,
  region,
  timeMin,
  difficulty,
  tags = [],
  teaser,
  imageUrl,
  onSave,
  onViewDetail,
}: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(id);
    console.log(`Recipe ${id} ${!isSaved ? 'saved' : 'unsaved'}`);
  };

  const handleClick = () => {
    onViewDetail?.(id);
    console.log(`Viewing recipe details for ${id}`);
  };

  return (
    <Card className="overflow-hidden hover-elevate cursor-pointer group" data-testid={`card-recipe-${id}`}>
      <div className="relative aspect-[4/3] overflow-hidden" onClick={handleClick}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-display font-semibold mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{region ? `${country} - ${region}` : country}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {teaser && (
          <p className="text-sm text-muted-foreground line-clamp-2">{teaser}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeMin}分</span>
          </div>
          <Badge className={difficultyConfig[difficulty].color} data-testid={`badge-difficulty-${difficulty}`}>
            {difficultyConfig[difficulty].label}
          </Badge>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleClick}
            data-testid="button-view-detail"
          >
            詳細を見る
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="icon"
            onClick={handleSave}
            data-testid="button-save"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
