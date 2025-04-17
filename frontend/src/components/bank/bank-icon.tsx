"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BANK_INFOS } from "@/app/(dashboard)/finance/bank/components/bank-select/BankSelect";

interface BankIconProps {
  bankName: string;
  showName?: boolean;
  className?: string;
  avatarClassName?: string;
}

export function BankIcon({ bankName, showName = false, className, avatarClassName }: BankIconProps) {
  const bankInfo = BANK_INFOS.find(bank => bank.name === bankName);
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Avatar className={cn("h-4 w-4", avatarClassName)}>
        <AvatarImage src={bankInfo?.logo} alt={bankName} />
        <AvatarFallback>
          {bankName[0]}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="truncate">{bankName}</span>
      )}
    </div>
  );
} 