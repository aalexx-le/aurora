import {Dispatch, SetStateAction} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";

interface IProps {
    timeframe: string;
    setTimeframe: Dispatch<SetStateAction<TimeframeEnum>>
}

const TIMEFRAMES = [
    {
        value: TimeframeEnum.ONE_MINUTE,
        label: "1m"
    },
    {
        value: TimeframeEnum.ONE_HOUR,
        label: "1h"
    },
    {
        value: TimeframeEnum.ONE_DAY,
        label: "1D"
    }
];

export const TimeframeSelect = ({timeframe, setTimeframe}: IProps) => {
    return (
        <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as TimeframeEnum)}>
            <TabsList className="h-8"> {/* Reduced height */}
                {TIMEFRAMES.map((timeframe) => (
                    <TabsTrigger key={timeframe.value} value={timeframe.value} className="text-xs">
                        {timeframe.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}