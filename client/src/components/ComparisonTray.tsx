import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock, ChefHat, ArrowRight } from "lucide-react";
import { useState } from "react";

interface CompareItem {
  id: string;
  title: string;
  timeMin: number;
  difficulty: string;
  country: string;
}

interface ComparisonTrayProps {
  items?: CompareItem[];
  onRemove?: (id: string) => void;
  onCompare?: () => void;
}

export default function ComparisonTray({ items = [], onRemove, onCompare }: ComparisonTrayProps) {
  const [isVisible, setIsVisible] = useState(items.length > 0);

  if (!isVisible || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">比較トレイ ({items.length}/5)</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            data-testid="button-close-tray"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <Card key={item.id} className="flex-shrink-0 w-64" data-testid={`tray-item-${item.id}`}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 -mr-1"
                    onClick={() => {
                      onRemove?.(item.id);
                      console.log(`Removed from comparison: ${item.id}`);
                    }}
                    data-testid="button-remove-item"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.timeMin}分</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    <span>{item.difficulty}</span>
                  </div>
                  <p>{item.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length >= 2 && (
            <Button
              variant="default"
              className="flex-shrink-0 h-full min-w-32"
              onClick={() => {
                onCompare?.();
                console.log("Compare button clicked");
              }}
              data-testid="button-compare"
            >
              比較する
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
