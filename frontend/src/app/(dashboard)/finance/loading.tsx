import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-1 flex-col gap-4">
                <Skeleton className="h-8 w-full"/>
                <Skeleton className="h-8 w-full"/>
                <Skeleton className="h-4 w-3/4"/>
                <Skeleton className="w-full aspect-square"/>
                {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-8 rounded-full flex-1"/>
                        <Skeleton className="h-4 flex-1"/>
                        <Skeleton className="h-8 aspect-square"/>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4 col-span-2">
                <Skeleton className="h-8 w-full"/>
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 aspect-square rounded-full"/>
                        <Skeleton className="h-12 flex-1"/>
                        <Skeleton className="h-8 aspect-square"/>
                    </div>
                ))}
            </div>
        </div>
    )
}