import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Star, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodLogCardProps {
  id: string;
  dishName: string;
  country: string;
  region?: string;
  date: string;
  rating: number;
  imageUrl?: string;
  notes?: string;
  onMakeAgain?: (id: string) => void;
  onFindSimilar?: (id: string) => void;
}

export default function FoodLogCard({
  id,
  dishName,
  country,
  region,
  date,
  rating,
  imageUrl,
  notes,
  onMakeAgain,
  onFindSimilar,
}: FoodLogCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-log-${id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {imageUrl ? (
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              <img src={imageUrl} alt={dishName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg mb-1">{dishName}</h3>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>{region ? `${country} - ${region}` : country}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < rating
                      ? "fill-chart-4 text-chart-4"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            {notes && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{notes}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onMakeAgain?.(id);
                  console.log(`Make again: ${id}`);
                }}
                data-testid="button-make-again"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                もう一度作る
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFindSimilar?.(id);
                  console.log(`Find similar: ${id}`);
                }}
                data-testid="button-find-similar"
              >
                <Search className="h-3 w-3 mr-1" />
                似た料理を探す
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
