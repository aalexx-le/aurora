import { cn } from "@/lib/utils";

interface EventCategoryBadgeProps {
  category: {
    name: string;
    color: string;
  };
}

export function EventCategoryBadge({ category }: EventCategoryBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full",
        )}
        style={{ backgroundColor: category.color }}
      >
      </div>
      <span className="text-sm font-medium">{category.name}</span>
    </div>
  );
} 