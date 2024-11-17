import { useCallback } from "react";
import moment from "moment";

export const useChartFormatter = () => {
    const timeFormatterForTooltip = useCallback(
        (time: string) =>
            moment(time).utcOffset("+00:00").format("MMMM Do YYYY, h:mm a"),
        [],
    );
    const balanceFormatter = useCallback(
        (balance: number) => `$${balance}`,
        [],
    );

    return { timeFormatterForTooltip, balanceFormatter };
};
