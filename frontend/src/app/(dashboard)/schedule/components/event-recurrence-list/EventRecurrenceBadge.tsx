import { Badge } from "@/components/ui/badge";
import { RecurrenceType } from "@/gql/graphql";
import { Calendar, CalendarDays, Clock, Repeat } from "lucide-react";
import { EventRecurrence } from "./types";

interface EventRecurrenceBadgeProps {
    recurrence: EventRecurrence;
}

export const EventRecurrenceBadge = ({
    recurrence,
}: EventRecurrenceBadgeProps) => {
    // Function to get recurrence pattern text
    const getRecurrenceText = () => {
        const { type, interval } = recurrence;
        
        const intervalText = interval === 1 ? '' : `Every ${interval} `;
        
        switch (type) {
            case RecurrenceType.Daily:
                return `${intervalText}day${interval !== 1 ? 's' : ''}`;
            case RecurrenceType.Weekly:
                return `${intervalText}week${interval !== 1 ? 's' : ''}`;
            case RecurrenceType.Monthly:
                return `${intervalText}month${interval !== 1 ? 's' : ''}`;
            case RecurrenceType.Yearly:
                return `${intervalText}year${interval !== 1 ? 's' : ''}`;
            default:
                return 'Custom';
        }
    };

    // Function to get the appropriate icon
    const getIcon = () => {
        switch (recurrence.type) {
            case RecurrenceType.Daily:
                return <Repeat className="h-4 w-4 flex-shrink-0" />;
            case RecurrenceType.Weekly:
                return <CalendarDays className="h-4 w-4 flex-shrink-0" />;
            case RecurrenceType.Monthly:
            case RecurrenceType.Yearly:
                return <Calendar className="h-4 w-4 flex-shrink-0" />;
            default:
                return <Repeat className="h-4 w-4 flex-shrink-0" />;
        }
    };

    // Get end date or count display text
    const getEndText = () => {
        if (recurrence.endDate) {
            return `until ${new Date(recurrence.endDate).toLocaleDateString()}`;
        } else if (recurrence.endCount) {
            return `${recurrence.endCount} time${recurrence.endCount !== 1 ? 's' : ''}`;
        }
        return '';
    };

    // Get first event information
    const getFirstEventInfo = () => {
        if (recurrence.events && recurrence.events.length > 0) {
            const firstEvent = recurrence.events[0];
            return {
                name: firstEvent.name,
                startDate: firstEvent.startDate,
                hasCategory: !!firstEvent.category,
                categoryName: firstEvent.category?.name,
                categoryColor: firstEvent.category?.color
            };
        }
        return null;
    };

    const endText = getEndText();
    const firstEventInfo = getFirstEventInfo();
    const recurrenceText = getRecurrenceText();

    // Get accent color from category or default
    const accentColor = firstEventInfo?.categoryColor || undefined;

    return (
        <div className="inline-flex max-w-full">
            <div className="flex items-stretch overflow-hidden rounded-md border shadow-sm cursor-pointer hover:bg-muted/50 transition-all duration-200 w-full">
                <Badge 
                    variant="outline" 
                    className="flex items-center gap-1.5 py-1.5 px-3 font-medium rounded-r-none border-r-0 min-w-0 max-w-[50%]"
                    style={accentColor ? {
                        borderColor: accentColor,
                        borderRightColor: 'transparent',
                    } : undefined}
                >
                    {getIcon()}
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="truncate">
                            {recurrenceText}
                            {endText && <span className="text-muted-foreground ml-1">{endText}</span>}
                        </div>
                    </div>
                </Badge>
                
                {firstEventInfo && (
                    <Badge 
                        variant="outline" 
                        className="flex items-center gap-1.5 py-1.5 px-3 font-medium rounded-l-none min-w-0 flex-1"
                        style={accentColor ? {
                            borderColor: accentColor,
                            color: accentColor
                        } : undefined}
                    >
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="truncate">
                                {firstEventInfo.name}
                                <span className="text-muted-foreground ml-1">
                                    {new Date(firstEventInfo.startDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Badge>
                )}
            </div>
        </div>
    );
}; 