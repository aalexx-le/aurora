import { useCallback } from "react";
import moment from "moment";

export const useChartFormatter = () => {
    const timeFormatter = useCallback((time: string) => {
        return moment(time).format("DD/MM");
    }, []);

    const timeFormatterForTooltip = useCallback(
        (time: string) =>
            moment(time).utcOffset("+00:00").format("MMMM Do YYYY, h:mm a"),
        [],
    );
    const balanceFormatter = useCallback(
        (balance: number) => `$${balance}`,
        [],
    );

    return { timeFormatterForTooltip, balanceFormatter, timeFormatter };
};
