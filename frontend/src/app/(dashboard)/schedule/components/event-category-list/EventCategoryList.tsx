import {
    GET_EVENT_CATEGORIES,
    REMOVE_EVENT_CATEGORY
} from "@/api/script/schedule/event-category";
import {DeleteDialog} from "@/app/(dashboard)/finance/expense/components/transaction-table/DeleteDialog";
import {
    GetEventCategoriesQuery,
    GetEventCategoriesQueryVariables,
    RemoveEventCategoryMutation,
    RemoveEventCategoryMutationVariables
} from "@/gql/graphql";
import {useToast} from "@/hooks/use-toast";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import {DataTableRowActionType} from "@/types";
import {useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import {EventCategoryListSkeleton} from "../skeletons";
import {CreateEventCategoryDialog} from "./CreateEventCategoryDialog";
import {EventCategoryActionButton} from "./EventCategoryActionButton";
import {EventCategoryBadge} from "./EventCategoryBadge";
import {EventCategory} from "./types";
import {UpdateEventCategoryDialog} from "./UpdateEventCategoryDialog";

const EventCategoryList = () => {
    const {toast} = useToast();
    const [action, setAction] = useState<DataTableRowActionType | null>(null);
    const [category, setCategory] = useState<EventCategory | null>(null);

    const {data, loading} = useQuery<GetEventCategoriesQuery, GetEventCategoriesQueryVariables>(GET_EVENT_CATEGORIES);
    const categories = data?.getEventCategories || [];

    const [removeCategory] = useMutation<RemoveEventCategoryMutation, RemoveEventCategoryMutationVariables>(REMOVE_EVENT_CATEGORY, {
        refetchQueries: [GET_EVENT_CATEGORIES],
        awaitRefetchQueries: true,
        onError: (error) => {
            toast({
                title: "Error",
                description: 'Cannot delete category because it is being used in expense',
                variant: "destructive",
                duration: 5000
            })
        }
    });

    const handleDeleteCategory = (id: number) => async () => {
        try {
            await removeCategory({
                variables: {id},
            });
            toast({title: "Category deleted successfully"});
        } catch (e) {
            toast({
                title: "Error",
                description: getGraphqlErrorMessage(e),
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return <EventCategoryListSkeleton/>;
    }

    return (
        <div className="col-span-1 mb-4 lg:mb-0 p-4 rounded-lg border shadow-sm h-min">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                        Categories
                    </h2>
                    <CreateEventCategoryDialog/>
                </div>

                {categories?.map((ctg: EventCategory) => (
                    <div className="grid gap-2" key={ctg.id}>
                        <div className="flex gap-4 items-center justify-between rounded-lg">
                            <EventCategoryBadge
                                category={{name: ctg.name, color: ctg.color}}
                            />
                            <div className="flex items-center gap-2">
                                <p className="text-sm">
                                    {/* Add count or other metric here */}
                                </p>
                                <EventCategoryActionButton
                                    row={ctg}
                                    setAction={(v) => {
                                        setAction(v);
                                        setCategory(ctg);
                                    }}
                                />
                            </div>
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
        </div>
    );
};

export default EventCategoryList;