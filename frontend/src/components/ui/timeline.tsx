import * as React from 'react';
import {cn} from '@/lib/utils';
import moment from "moment/moment";
import CategoryAvatar from "@/app/(dashboard)/finance/expense/components/category-list/CategoryAvatar";

interface TimelineProps {
    statuses: string[];
    currentStatus: string;
    time: string;
}

const Timeline: React.FC<TimelineProps> = ({statuses, currentStatus, time}) => {
    const [current, setCurrent] = React.useState(currentStatus);
    const currentIndex = statuses.indexOf(currentStatus);

    const Circle = ({index}: { index: number }) => {
        if (index < currentIndex) {
            return (
                <div className="relative size-2">
                    <div
                        className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center bg-chart-2")}
                    >
                    </div>
                </div>
            );
        }
        else if (index === currentIndex) {
            return (
                <CategoryAvatar avatar="#499D81" className="size-3"/>
            );
        }
        else {
            return (
                <div className="relative size-2">
                    <div
                        className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center bg-muted-foreground")}
                    >
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="relative w-full">
            <div className="flex items-center">
                <p className="text-muted-foreground text-xs mr-6">{moment(time).format("DD/MM/YYYY, H:mm a")}</p>
                {statuses.map((status, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className={cn(
                                "relative flex items-center gap-1",
                            )}
                        >
                            <Circle index={index}/>
                            <div className="text-center">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        index <= currentIndex ? "text-chart-2" : "text-muted-foreground" // Conditional text color
                                    )}
                                >
                                  {status}
                                </span>
                            </div>
                        </div>
                        {index < statuses.length - 1 && (
                            <div
                                className={cn(
                                    "h-[2px] w-20 mr-3",
                                    index < currentIndex ? "bg-chart-2" : "bg-muted-foreground" //Conditional line color
                                )}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;