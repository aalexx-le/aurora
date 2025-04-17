"use client";

import { MoneyTransferAmount } from "@/components/money/money-transfer-amount";
import { EventContentArg } from "@fullcalendar/core/index.js";
import {Expense} from "@/app/(dashboard)/finance/expense/components/expense-table/types";
import { CategoryBadge } from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";

type ExpenseEventItemProps = {
  info: EventContentArg;
};

export default function ExpenseEventItem({ info }: ExpenseEventItemProps) {
  const { event, view } = info;
  const { amount, category } = event.extendedProps.backup as Expense;
  const isMonthView = view.type === "dayGridMonth";

  return (
    <div className="overflow-hidden w-full relative group">
      {isMonthView ? (
        <div
          className="flex flex-col rounded-md w-full p-2 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs"
        >
          <div className="flex justify-between items-start gap-2">
            <p className="font-semibold truncate max-w-[55%] text-gray-950">
              {event.title} 
            </p>
            <p className="text-xs text-gray-800 truncate max-w-[45%]">({category.name})</p>
          </div>
          <div className="flex items-center gap-1">
            <MoneyTransferAmount number={amount} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs">
          <div className="flex justify-between items-start">
            <p className="font-semibold w-full text-gray-950">
              {event.title}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MoneyTransferAmount number={amount} />
          </div>
        </div>
      )}
    </div>
  );
} 