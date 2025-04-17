'use client';

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  iconClassName?: string;
}

export const DashboardCard = ({
  title,
  description,
  icon: Icon,
  href,
  className,
  iconClassName,
}: DashboardCardProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col p-6 bg-card backdrop-blur-sm rounded-xl border shadow-lg transition-all duration-300 hover:bg-accent h-full",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
        <div className={cn("p-2 rounded-full bg-muted text-muted-foreground", iconClassName)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full h-24 flex items-center justify-center">
          <Icon className={cn("h-16 w-16 text-muted-foreground/50 group-hover:text-accent-foreground transition-all duration-300", iconClassName)} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">{description}</p>
    </Link>
  );
};
