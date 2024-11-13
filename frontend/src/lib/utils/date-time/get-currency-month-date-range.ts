import { DateRange } from "react-day-picker";

export function getCurrentMonthDateRange(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        from: start,
        to: end,
    };
}
