import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CalendarTabSkeleton,
    ExpenseTabSkeleton,
    TransactionTabSkeleton
} from "./components/skeletons";

/**
 * Loading state component for the Expense page
 * Displays skeleton UI while the page is loading
 */
export default function ExpenseLoading() {
  return (
    <Tabs defaultValue="Transaction">
      <TabsList className="mb-2">
        <TabsTrigger value="Transaction">Transaction</TabsTrigger>
        <TabsTrigger value="Expense">Expense</TabsTrigger>
        <TabsTrigger value="Calendar">Calendar</TabsTrigger>
      </TabsList>
      <div>
        <TabsContent value="Transaction">
          <TransactionTabSkeleton />
        </TabsContent>
        <TabsContent value="Expense">
          <ExpenseTabSkeleton />
        </TabsContent>
        <TabsContent value="Calendar">
          <CalendarTabSkeleton />
        </TabsContent>
      </div>
    </Tabs>
  );
} 