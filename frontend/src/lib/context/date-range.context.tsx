import {createContext, useContext, useState} from "react";
import {getCurrentMonthDateRange} from "@/lib/utils/date-time/get-currency-month-date-range";
import {DateRange} from "react-day-picker";

const DateFilterContext = createContext<{
    dateRange: DateRange;
    setDateRange: (dateRange: DateRange) => void;
}>({
    dateRange: getCurrentMonthDateRange(),
    setDateRange: () => {},
});

export const DateFilterProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [dateRange, setDateRange] = useState<DateRange>(
        getCurrentMonthDateRange(),
    );

    return (
        <DateFilterContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateFilterContext.Provider>
    );
};

export const useDateFilterContext = () => useContext(DateFilterContext);
