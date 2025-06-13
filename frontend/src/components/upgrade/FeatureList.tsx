import { UPGRADE_CONSTANTS } from "@/lib/constants/upgrade";

interface FeatureListProps {
  features: string[];
  variant?: "locked" | "unlocked";
  title?: string;
}

export const FeatureList = ({ 
  features, 
  variant = "unlocked",
  title
}: FeatureListProps) => {
  const { icons } = UPGRADE_CONSTANTS;
  const LockIcon = icons.lock;
  const CheckIcon = icons.check;

  if (features.length === 0) return null;

  const isLocked = variant === "locked";
  const defaultTitle = isLocked 
    ? UPGRADE_CONSTANTS.premiumFeaturesAwaitingText 
    : UPGRADE_CONSTANTS.unlockFeaturesText;

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-center gap-2">
        <span className="font-semibold text-foreground text-sm">
          {title || defaultTitle}
        </span>
      </div> */}
      
      <div className="grid gap-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 dark:bg-gray-800/50 dark:border-gray-600 dark:hover:bg-gray-700/50 transition-colors duration-200 ${isLocked ? 'group' : ''}`}
          >
            {isLocked ? (
              <LockIcon className="size-5 text-muted-foreground dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200" />
            ) : (
              <CheckIcon className="size-5 text-primary dark:text-green-400" />
            )}
            <span className="text-sm font-medium text-card-foreground dark:text-gray-200">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 