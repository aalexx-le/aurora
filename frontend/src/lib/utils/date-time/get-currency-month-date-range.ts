import { DateRange } from "react-day-picker";
import {
    AbbreviatedTimeFrameEnum,
    TimeframeEnum,
} from "@/lib/utils/date-time/timeframe.enum";

export function getCurrentMonthDateRange(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        from: start,
        to: end,
    };
}

export const getAbbreviatedTimeFrame = (
    timeFrame: TimeframeEnum,
): AbbreviatedTimeFrameEnum => {
    const [time, unit] = timeFrame.split(" ");
    return (time + unit.charAt(0)) as AbbreviatedTimeFrameEnum;
};
