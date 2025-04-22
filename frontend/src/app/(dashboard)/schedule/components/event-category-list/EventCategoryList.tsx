import { DeleteDialog } from "@/components/crud/delete-dialog";
import { DataTableRowActionType } from "@/types";
import { useState } from "react";
import { EventCategoryListSkeleton } from "../skeletons";
import { CreateEventCategoryDialog } from "./CreateEventCategoryDialog";
import { EventCategoryActionButton } from "./EventCategoryActionButton";
import { EventCategoryBadge } from "./EventCategoryBadge";
import { EventCategory } from "./types";
import { UpdateEventCategoryDialog } from "./UpdateEventCategoryDialog";
import { useDeleteEventCategoryMutation } from "./useDeleteEventCategoryMutation";
import { useEventCategoriesQuery } from "./useEventCategoriesQuery";
import { Card } from "@/components/ui/card";

const EventCategoryList = () => {
    const [action, setAction] = useState<DataTableRowActionType | null>(null);
    const [category, setCategory] = useState<EventCategory | null>(null);

    const { categories, loading } = useEventCategoriesQuery();
    const { handleDeleteCategory } = useDeleteEventCategoryMutation();

    if (loading) {
        return <EventCategoryListSkeleton/>;
    }

    return (
        <Card className="p-4 h-min">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                        Categories
                    </h2>
                    <CreateEventCategoryDialog/>
                </div>

                {categories?.map((ctg: EventCategory) => (
                    <div className="grid gap-2" key={ctg.id}>
                        <div className="flex gap-4 items-center justify-between overflow-hidden w-full">
                            <EventCategoryActionButton
                                row={ctg}
                                setAction={(v) => {
                                    setAction(v);
                                    setCategory(ctg);
                                }}
                            >
                                <EventCategoryBadge
                                    category={{name: ctg.name, color: ctg.color}}
                                />
                            </EventCategoryActionButton>
                        </div>
                    </div>
                ))}

                {category && (
                    <>
                        <UpdateEventCategoryDialog
                            category={category}
                            open={action === DataTableRowActionType.UPDATE}
                            onOpenChange={() => setAction(null)}
                        />

                        <DeleteDialog
                            rows={[category]}
                            open={action === DataTableRowActionType.DELETE}
                            onOpenChange={() => setAction(null)}
                            onDelete={handleDeleteCategory(Number(category.id))}
                            showTrigger={false}
                        />
                    </>
                )}
            </div>
        </Card>
    );
};

export default EventCategoryList;