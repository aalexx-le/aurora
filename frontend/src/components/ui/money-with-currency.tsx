import {useConvertCurrency} from "@/lib/hooks/use-convert-currency";

interface MoneyWithCurrencyProps {
    amount: number;
}

const MoneyWithCurrency = ({ amount }: MoneyWithCurrencyProps) => {
    const convertedAmount = useConvertCurrency(amount)

    return convertedAmount;
};

export default MoneyWithCurrency;