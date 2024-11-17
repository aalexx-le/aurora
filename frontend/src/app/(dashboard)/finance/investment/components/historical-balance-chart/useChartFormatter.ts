import { useCallback } from "react";
import moment from "moment";

export const useChartFormatter = () => {
    const timeFormatter = useCallback((time: string) => {
        return moment(time).format("DD/MM");
    }, []);

    const timeFormatterForTooltip = useCallback(
        (time: string) =>
            moment(time).utcOffset("+00:00").format("MMMM Do YYYY, H:mm a"),
        [],
    );
    const balanceFormatter = useCallback(
        (balance: number) => `$${balance.toFixed(2)}`,
        [],
    );

    return { timeFormatterForTooltip, balanceFormatter, timeFormatter };
};
