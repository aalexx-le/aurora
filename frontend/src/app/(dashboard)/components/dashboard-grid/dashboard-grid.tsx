'use client';

import { useState, useEffect } from "react";
import { DashboardCard } from "./dashboard-card";
import { DashboardCardSkeleton } from "./skeleton";
import { BarChart3, Bitcoin, Calendar, CreditCard, LucideIcon } from "lucide-react";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";

type DashboardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  iconClassName?: string;
};

const dashboardItems: DashboardItem[] = [
  {
    title: "Finance",
    description: "Track your financial activities and manage your accounts",
    icon: BarChart3,
    href: DASHBOARD_ROUTE.finance.value,
    className: "border-primary/20",
    iconClassName: "text-primary"
  },
  {
    title: "Investment",
    description: "Monitor your investments and explore new opportunities",
    icon: Bitcoin,
    href: DASHBOARD_ROUTE.finance.investment.value,
    className: "border-primary/20",
    iconClassName: "text-primary"
  },
  {
    title: "Expense",
    description: "Track and categorize your expenses to manage your budget",
    icon: CreditCard,
    href: DASHBOARD_ROUTE.finance.expense.value,
    className: "border-primary/20",
    iconClassName: "text-primary"
  },
  {
    title: "Schedule",
    description: "Organize your appointments and manage your calendar",
    icon: Calendar,
    href: DASHBOARD_ROUTE.schedule.value,
    className: "border-primary/20",
    iconClassName: "text-primary"
  }
];

export const DashboardGrid = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {[...Array(4)].map((_, i) => (
          <DashboardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {dashboardItems.map((item, index) => (
        <DashboardCard
          key={index + item.title}
          title={item.title}
          description={item.description}
          icon={item.icon}
          href={item.href}
          className={item.className}
          iconClassName={item.iconClassName}
        />
      ))}
    </div>
  );
};
