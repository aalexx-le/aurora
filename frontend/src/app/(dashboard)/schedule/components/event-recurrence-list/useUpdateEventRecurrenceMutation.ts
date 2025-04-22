import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { EventRecurrence, UpdateRecurrenceInput } from "./types";

interface UpdateEventRecurrenceInput {
    id: string;
    data: Omit<UpdateRecurrenceInput, "id">;
}

interface UpdateEventRecurrenceMutationResult {
    updateRecurrenceTemplate: EventRecurrence;
}

const UPDATE_EVENT_RECURRENCE = gql`
    mutation UpdateRecurrenceTemplate(
        $id: ID!
        $data: UpdateEventRecurrenceInput!
    ) {
        updateRecurrenceTemplate(id: $id, data: $data) {
            id
            name
            type
            interval
            byWeekDay
            byMonthDay
            byMonth
            count
            endDate
            createdAt
            updatedAt
        }
    }
`;

export const useUpdateEventRecurrenceMutation = () => {
    const [updateRecurrence, { loading }] = useMutation<
        UpdateEventRecurrenceMutationResult,
        UpdateEventRecurrenceInput
    >(UPDATE_EVENT_RECURRENCE, {
        refetchQueries: ["GetRecurrenceTemplates"],
        onCompleted: () => {
            toast.success("Recurrence template updated successfully");
        },
        onError: (error) => {
            toast.error(
                `Failed to update recurrence template: ${error.message}`,
            );
        },
    });

    const handleUpdateRecurrence = async (input: UpdateRecurrenceInput) => {
        const { id, ...data } = input;
        try {
            await updateRecurrence({
                variables: {
                    id,
                    data,
                },
            });
            return true;
        } catch {
            return false;
        }
    };

    return {
        handleUpdateRecurrence,
        loading,
    };
};
