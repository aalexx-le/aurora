'use client';

import { Button } from "@/components/ui/button";
import MEMBERSHIP_ROUTE from "@/lib/routes/membership-plan.route";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

export function BrowsePlansButton() {
  return (
    <Button asChild variant="outline">
      <Link href={MEMBERSHIP_ROUTE.plan.value} className="flex items-center justify-center gap-2">
        <Crown className="h-4 w-4 text-yellow-500" />
        Membership Plans
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
} 