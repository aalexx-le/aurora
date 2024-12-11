import { useCallback } from "react";
import moment from "moment";
import { useConvertCurrencyContext } from "@/lib/context/convert-currency.context";

export const useChartFormatter = () => {
    const { formatCurrency } = useConvertCurrencyContext();
    const timeFormatter = useCallback((time: string) => {
        return moment(time).format("DD/MM");
    }, []);

    const timeFormatterForTooltip = useCallback(
        (time: string) =>
            moment(time).utcOffset("+00:00").format("MMMM Do YYYY, h:mm a"),
        [],
    );

    const balanceFormatter = useCallback(
        (balance: number | string) => formatCurrency(Number(balance)),
        [formatCurrency],
    );

    return { timeFormatterForTooltip, balanceFormatter, timeFormatter };
};
