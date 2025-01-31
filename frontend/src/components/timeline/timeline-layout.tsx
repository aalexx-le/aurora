import {
    Timeline,
    TimelineItem,
    TimelineTitle,
    TimelineDescription,
    TimelineTime,
    TimelineHeader,
} from '@/components/ui/timeline';

export type TimelineItemType = {
    id: number;
    title: string;
    description: string;
    time: string;
};



interface IProps {
    items: TimelineItemType[];
}

export const TimelineLayout = ({items}: IProps) => {
    return (
        <Timeline className='mt-8'>
            {items.map((item) => (
                <TimelineItem key={item.id}>
                    <TimelineHeader>
                        {/*<TimelineTime>{item.time}</TimelineTime>*/}
                        <TimelineTitle>{item.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>{item.description}</TimelineDescription>
                </TimelineItem>
            ))}
        </Timeline>
    );
};