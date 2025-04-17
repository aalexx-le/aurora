"use client";

import { GET_EXPENSES, UPDATE_EXPENSE } from "@/api/script/expense/expense";
import { GET_EXPENSE_CATEGORIES } from "@/api/script/expense/expense-category";
import ExpenseCategoryList from "@/app/(dashboard)/finance/expense/components/category-list/ExpenseCategoryList";
import CategoryPieChart from "@/app/(dashboard)/finance/expense/components/category-pie-chart/CategoryPieChart";
import DayHeader from "@/app/(dashboard)/schedule/components/event-calendar/DayHeader";
import DayRender from "@/app/(dashboard)/schedule/components/event-calendar/DayRender";
import { Card } from "@/components/ui/card";
import { GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables, GetExpensesQuery, GetExpensesQueryVariables, UpdateExpenseMutation, UpdateExpenseMutationVariables } from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { ExpenseCalendarProvider, useExpenseCalendar } from "@/lib/context/calendar-context";
import { CalendarView } from "@/lib/utils/calendar/data";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { DataTableRowActionType } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import {
  EventChangeArg,
  EventClickArg
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMemo, useRef } from "react";
import { Expense } from "../../components/expense-table/types";
import { CreateExpenseSheet } from "../expense-table/CreateExpenseSheet";
import { UpdateExpenseSheet } from "../expense-table/UpdateExpenseSheet";
import ExpenseCalendarNav from "./expense-calendar-nav";
import "./expense-calendar.css";
import ExpenseEventItem from "./ExpenseEventItem";
import { mapExpenseToEventInput } from "./mapExpenseToEventInput";

// Main component that uses the context
function ExpenseCalendarContent() {
  const { toast } = useToast();
  const calendarRef = useRef<FullCalendar | null>(null);
  
  const { 
    viewedDate, 
    setViewedDate,
    selectedDate,
    setSelectedDate,
    selectedExpense,
    setSelectedExpense,
    action,
    setAction,
    getDateRangeForView
  } = useExpenseCalendar();
  
  // Get date range from context
  const dateRange = useMemo(() => getDateRangeForView(), [getDateRangeForView]);

  // Fetch expenses for the current date range
  const { data: expenseData, refetch } = useQuery<GetExpensesQuery, GetExpensesQueryVariables>(
    GET_EXPENSES,
    {
      variables: dateRange,
      fetchPolicy: 'network-only',
    }
  );

  // Fetch expense categories
  const { data: categoryData } = useQuery<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>(
    GET_EXPENSE_CATEGORIES,
    {
      variables: dateRange,
      fetchPolicy: 'network-only',
    }
  );

  // Extract categories
  const categories = categoryData?.getExpenseCategories || [];

  // Set up the update expense mutation
  const [updateExpense] = useMutation<UpdateExpenseMutation, UpdateExpenseMutationVariables>(
    UPDATE_EXPENSE,
    {
      refetchQueries: [GET_EXPENSES],
      onError: (error) => {
        toast({
          title: "Failed to update expense date",
          description: getGraphqlErrorMessage(error),
          variant: "destructive",
        });
      }
    }
  );

  // Map expenses to calendar format
  const expenses = useMemo(() => 
    mapExpenseToEventInput(expenseData?.getExpenses ?? []), 
    [expenseData]
  );

  const handleEventClick = (info: EventClickArg) => {
    setSelectedExpense(info.event.extendedProps.backup as Expense);
    setAction(DataTableRowActionType.UPDATE);
  };

  const handleEventContent = (eventInfo: any) => {
    return <ExpenseEventItem info={eventInfo} />;
  };
  
  const handleDatesSet = ({ view }: any) => {
    setViewedDate(new Date(view.currentStart));
    refetch();
  };

  const handleEventChange = async (info: EventChangeArg) => {
    const newDate = info.event.start;
    
    if (!newDate) {
      info.revert();
      return;
    }

    try {
      await updateExpense({
        variables: {
          id: info.event.id,
          data: { createdAt: newDate }
        }
      });
      
      toast({
        title: "Expense updated",
        description: "The expense date has been updated successfully.",
      });
    } catch (error) {
      info.revert();
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.date);
    setAction(DataTableRowActionType.CREATE);
  };

  const handleCloseAction = () => {
    setAction(null);
    setSelectedExpense(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <ExpenseCalendarNav calendarRef={calendarRef} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
        <div className="col-span-1 lg:sticky lg:top-4 self-start h-min p-4 rounded-lg border shadow-sm mb-4 lg:mb-0">
          <CategoryPieChart categories={categories} />
          <ExpenseCategoryList categories={categories} />
        </div>
        
        <div className="col-span-2">
          <Card className="overflow-hidden">
            <FullCalendar
              events={expenses}
              ref={calendarRef}
              timeZone="local"
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              weekends={true}
              firstDay={1}
              initialView={CalendarView.DayGridMonth}
              headerToolbar={false}
              allDaySlot={true}
              displayEventEnd={true}
              windowResizeDelay={0}
              eventTimeFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
              contentHeight="auto"
              expandRows={true}
              dayCellContent={dayInfo => <DayRender info={dayInfo} />}
              eventContent={handleEventContent}
              dayHeaderContent={headerInfo => <DayHeader info={headerInfo} />}
              eventClick={handleEventClick}
              eventChange={handleEventChange}
              datesSet={handleDatesSet}
              dateClick={handleDateClick}
              nowIndicator
              droppable
              editable
              eventStartEditable
              selectable
            />
          </Card>
        </div>
      </div>

      {/* Create expense sheet when clicking on a date */}
      <CreateExpenseSheet
        initTransactionId={0}
        open={action === DataTableRowActionType.CREATE}
        onOpenChange={handleCloseAction}
        showTrigger={false}
        selectedDate={selectedDate}
      />
      
      {/* Update expense sheet when clicking on an event */}
      {selectedExpense && (
        <UpdateExpenseSheet
          open={action === DataTableRowActionType.UPDATE}
          onOpenChange={handleCloseAction}
          expense={selectedExpense}
        />
      )}
    </div>
  );
}

// Wrapper component that provides the context
export default function ExpenseCalendar() {
  return (
    <ExpenseCalendarProvider>
      <ExpenseCalendarContent />
    </ExpenseCalendarProvider>
  );
} 