import {useDateFilterContext} from "@/lib/context/date-range.context";
import {getCurrentMonthDateRange} from "@/lib/utils/date-time/get-currency-month-date-range";
import {Button} from "@/components/ui/button";

interface IProps {

}

export function ResetDateFilterButton({}: IProps) {
    const { setDateRange } = useDateFilterContext();

    return (
        <Button
            variant="secondary"
            onClick={() => setDateRange(getCurrentMonthDateRange())}
        >
            Reset
        </Button>
    );
}