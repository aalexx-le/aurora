import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { CreateRecurrenceInput, EventRecurrence } from "./types";

interface CreateEventRecurrenceInput {
    data: CreateRecurrenceInput;
}

interface CreateEventRecurrenceMutationResult {
    createRecurrenceTemplate: EventRecurrence;
}

const CREATE_EVENT_RECURRENCE = gql`
    mutation CreateRecurrenceTemplate($data: CreateEventRecurrenceInput!) {
        createRecurrenceTemplate(data: $data) {
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

export const useCreateEventRecurrenceMutation = () => {
    const [createRecurrence, { loading }] = useMutation<
        CreateEventRecurrenceMutationResult,
        CreateEventRecurrenceInput
    >(CREATE_EVENT_RECURRENCE, {
        refetchQueries: ["GetRecurrenceTemplates"],
        onCompleted: () => {
            toast.success("Recurrence template created successfully");
        },
        onError: (error) => {
            toast.error(
                `Failed to create recurrence template: ${error.message}`,
            );
        },
    });

    const handleCreateRecurrence = async (input: CreateRecurrenceInput) => {
        try {
            await createRecurrence({
                variables: {
                    data: input,
                },
            });
            return true;
        } catch {
            return false;
        }
    };

    return {
        handleCreateRecurrence,
        loading,
    };
};
