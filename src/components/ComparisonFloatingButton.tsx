import { BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonFloatingButtonProps {
  count: number;
  onOpen: () => void;
  onClear: () => void;
}

export const ComparisonFloatingButton = ({ 
  count, 
  onOpen, 
  onClear 
}: ComparisonFloatingButtonProps) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-card border border-border rounded-lg shadow-elegant p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Compare</span>
            <Badge variant="secondary">{count}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <Button 
          className="w-full btn-hero" 
          size="sm"
          onClick={onOpen}
        >
          Compare Products
        </Button>
      </div>
    </div>
  );
};