import { Button } from "@/components/ui/button";
import { Flame, Clock, Users, Leaf } from "lucide-react";

interface QuickActionChipsProps {
  onActionClick?: (action: string) => void;
}

const quickActions = [
  { id: "spicy", label: "もっと辛く", icon: Flame },
  { id: "quick", label: "15分以内", icon: Clock },
  { id: "servings", label: "4人分", icon: Users },
  { id: "no-herbs", label: "香草なし", icon: Leaf },
];

export default function QuickActionChips({ onActionClick }: QuickActionChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {quickActions.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant="secondary"
          size="sm"
          className="flex-shrink-0"
          onClick={() => {
            onActionClick?.(id);
            console.log(`Quick action: ${id}`);
          }}
          data-testid={`button-quick-${id}`}
        >
          <Icon className="h-3 w-3 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
}
