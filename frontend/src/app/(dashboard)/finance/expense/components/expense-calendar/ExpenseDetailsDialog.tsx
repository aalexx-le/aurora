"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import moment from "moment/moment";
import {MoneyTransferAmount} from "@/components/money/money-transfer-amount";
import {Expense} from "@/app/(dashboard)/finance/expense/components/expense-table/types";

interface ExpenseDetailsDialogProps {
  expense: Expense;
  onClose: () => void;
}

export function ExpenseDetailsDialog({ expense, onClose }: ExpenseDetailsDialogProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/finance/expense?id=${expense.id}`);
    onClose();
  };

  return (
    <Dialog open={!!expense} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: expense.category?.color || "#6B7280" }}
            />
            {expense.name}
          </DialogTitle>
          <DialogDescription>
            {expense.category?.name} • {moment(expense.createdAt).format("MMM DD, YYYY hh:mm A")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Amount</span>
            <MoneyTransferAmount number={expense.amount} />
          </div>
          {expense.description && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Description</span>
              <span className="text-sm">{expense.description}</span>
            </div>
          )}
          {expense.transaction && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Transaction</span>
              <span className="text-sm">{expense.transaction.description}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleViewDetails}>
            View Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 