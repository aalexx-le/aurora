import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCategoryBadgeProps extends BadgeProps {
  category: {
    name: string;
    color: string;
  };
}

export function EventCategoryBadge({ category, className, ...props }: EventCategoryBadgeProps) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-md cursor-pointer">
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:bg-muted/50 px-1 py-1",
          className
        )}
        style={{ 
          borderColor: category.color,
          color: category.color 
        }}
        {...props}
      >
        <div 
          className={cn(
            "flex h-2 w-2 items-center justify-center rounded-full shrink-0",
          )}
          style={{ background: category.color }}
        >
        </div>
        <span className="text-xs font-medium truncate max-w-[200px]">{category.name}</span>
      </Badge>
    </div>
  );
} 