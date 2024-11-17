import {Dispatch, SetStateAction} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface IProps {
    timeframe: string;
    setTimeframe: Dispatch<SetStateAction<string>>
}

const TIMEFRAMES = [
    {
        value: "1 min",
        label: "1m"
    },
    {
        value: "1 hour",
        label: "1h"
    },
    {
        value: "1 day",
        label: "1D"
    }
];

export const TimeframeSelect = ({timeframe, setTimeframe}: IProps) => {
    return (
        <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
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