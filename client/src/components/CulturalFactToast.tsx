import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CulturalFactToastProps {
  fact: string;
  detailedFact?: string;
  sourceLabel?: string;
  onDismiss?: () => void;
}

export default function CulturalFactToast({
  fact,
  detailedFact = "",
  sourceLabel = "Food Atlas編集部",
  onDismiss,
}: CulturalFactToastProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-right duration-300">
        <Card className="bg-card shadow-lg border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2">豆知識</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{fact}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto mt-2 text-primary hover:text-primary/80"
                  onClick={() => setIsModalOpen(true)}
                  data-testid="button-learn-more"
                >
                  詳しく見る
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => {
                  setIsOpen(false);
                  onDismiss?.();
                }}
                data-testid="button-dismiss-toast"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent data-testid="modal-cultural-fact">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              食文化の豆知識
            </DialogTitle>
            <DialogDescription className="sr-only">
              食文化に関する詳しい情報
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="font-accent text-lg leading-relaxed">
              {detailedFact || fact}
            </p>
            <div className="text-sm text-muted-foreground border-t pt-3">
              <p>出典: {sourceLabel}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
