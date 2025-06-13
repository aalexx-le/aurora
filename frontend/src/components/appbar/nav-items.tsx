"use client";

import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  external?: boolean;
  disabled?: boolean;
}

interface NavItemsProps {
  items: NavigationItem[];
  mobile?: boolean;
  onItemClick?: () => void;
}

export function NavItems({ items, mobile = false, onItemClick }: NavItemsProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {items.map((item) => {
        const isActive = isActiveLink(item.href);
        const linkClasses = cn(
          "flex items-center text-sm font-medium transition-colors",
          mobile
            ? "block px-3 py-2 rounded-md text-base"
            : "px-3 py-2",
          isActive
            ? mobile
              ? "bg-accent text-accent-foreground"
              : "text-foreground"
            : "text-muted-foreground hover:text-foreground",
          item.disabled && "opacity-50 cursor-not-allowed"
        );

        const content = (
          <>
            {item.title}
          </>
        );

        if (item.disabled) {
          return (
            <span key={item.id} className={linkClasses}>
              {content}
            </span>
          );
        }

        return (
          <Button key={item.id} asChild variant="ghost">
            {item.external ? (
              <a
                href={item.href}
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onItemClick}
              >
                {content}
              </a>
            ) : (
              <Link
                href={item.href}
                className={linkClasses}
                onClick={onItemClick}
              >
                {content}
              </Link>
            )}
          </Button>
        );
      })}
    </>
  );
} 