import { Badge } from "@/components/ui/badge";
import { PaymentTransaction } from "@/gql/graphql";
import { format } from "date-fns";
import { DollarSign } from "lucide-react";

type TransactionListProps = {
  transactions: PaymentTransaction[];
};

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Payment History</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex justify-between items-center px-3 py-2 bg-muted rounded-md text-sm"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                {Number(transaction.amount).toFixed(2)} {transaction.currency}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {transaction.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 