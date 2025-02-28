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
    const [dateRange, _setDateRange] = useState<DateRange>(
        getCurrentMonthDateRange(),
    );

    const setDateRange = (newDateRange: DateRange) => {
        if (newDateRange.to) {
            newDateRange.to.setTime(newDateRange.to.getTime() - 1)
            _setDateRange(newDateRange)
        }
    }

    return (
        <DateFilterContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateFilterContext.Provider>
    );
};

export const useDateFilterContext = () => useContext(DateFilterContext);
