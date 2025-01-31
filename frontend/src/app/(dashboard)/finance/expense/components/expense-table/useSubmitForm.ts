import {CreateExpenseInput} from "@/lib/schema/expense";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import {UseFormReturn} from "react-hook-form";
import {BankTransaction} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {useMutation} from "@apollo/client";
import {CreateExpenseMutation, MutationCreateExpenseArgs} from "@/gql/graphql";
import {CREATE_EXPENSE, GET_EXPENSES} from "@/api/script/expense";
import {useAppSelector} from "@/state/hooks";
import {useToast} from "@/hooks/use-toast";

export const useSubmitForm = (
    form: UseFormReturn<CreateExpenseInput>,
    reviewTransaction: BankTransaction | undefined,
    startTransition: React.TransitionStartFunction,
    onOpenChange?: (open: boolean) => void,
) => {
    const {setError} = form
    const {toast} = useToast();
    const {user} = useAppSelector((state) => state.auth.state);
    const [createExpense] = useMutation<
        CreateExpenseMutation,
        MutationCreateExpenseArgs
    >(CREATE_EXPENSE, {
        refetchQueries: [
            GET_EXPENSES,
            "GetExpenses",
            "GetExpenseCategories",
            "GetBanks",
        ],
        awaitRefetchQueries: true,
    });

    function onSubmit(input: CreateExpenseInput) {
        startTransition(async () => {
            try {
                if (!reviewTransaction) {
                    setError("amount", {
                        message: "Please specify a transaction",
                    });
                    return;
                }

                if (input.amount > Math.abs(reviewTransaction.spentAmount)) {
                    setError("amount", {
                        message:
                            "Expense amount cannot be greater than transaction amount",
                    });
                    return;
                }

                const {data} = await createExpense({
                    variables: {
                        data: {
                            ...input,
                            amount:
                                input.amount *
                                (reviewTransaction.amount /
                                    Math.abs(reviewTransaction.amount)),
                            userId: Number(user?.id),
                        },
                    },
                });

                if (data) {
                    form.reset();
                    onOpenChange?.(false);
                    toast({
                        title: "Created expense!",
                    });
                }
            } catch (e) {
                toast({
                    title: "Error creating expense",
                    description: getGraphqlErrorMessage(e),
                    variant: "destructive"
                });
            }
        });
    }

    return {onSubmit};
}