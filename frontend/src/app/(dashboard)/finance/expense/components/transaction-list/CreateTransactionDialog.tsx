import {CREATE_BANK_TRANSACTION, GET_BANK_TRANSACTIONS} from "@/api/script/bank/transaction";
import {CreateDialog} from "@/components/create-dialog";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {CreateBankTransactionMutation, CreateBankTransactionMutationVariables} from "@/gql/graphql";
import {CreateBankTransactionInput, createBankTransactionSchema} from "@/lib/schema/bankTransaction";
import {useAppSelector} from "@/state/hooks";
import {useMutation} from '@apollo/client';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import BankAccountSelect from "@/app/(dashboard)/finance/bank/components/account-list/BankAccountSelect";
import {cn} from "@/lib/utils";
import CurrencyInput from "@/components/ui/currency-input";
import * as React from "react";
import {Switch} from "@/components/ui/switch";

interface IProps {
}

const CreateTransactionDialog = ({}: IProps) => {
    const defaultValues: CreateBankTransactionInput = {
        isTransfer: true,
        amount: 0,
        description: '',
        bankId: ''
    }
    const form = useForm<CreateBankTransactionInput>({
        resolver: zodResolver(createBankTransactionSchema),
        defaultValues
    });

    const isTransfer = form.watch('isTransfer');

    const [createTransaction, {loading}] = useMutation<CreateBankTransactionMutation, CreateBankTransactionMutationVariables>(CREATE_BANK_TRANSACTION, {
        refetchQueries: [GET_BANK_TRANSACTIONS, 'GetBankTransactions'],
        awaitRefetchQueries: true,
    });

    const handleSubmit = async (data: CreateBankTransactionInput) => {
        await createTransaction({
            variables: {
                data: {
                    bankId: data.bankId,
                    description: data.description,
                    amount: Number(data.amount)
                }
            }
        });
    };

    return (
        <CreateDialog<CreateBankTransactionInput>
            title="New Transaction"
            form={form}
            formSchema={createBankTransactionSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
        >
            {(form) => (
                <>
                    <FormField
                        control={form.control}
                        name="bankId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Bank</FormLabel>
                                <FormControl>
                                    <BankAccountSelect
                                        selectedAccountId={form.getValues('bankId')}
                                        setSelectedAccountId={(id) => form.setValue('bankId', id)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <CurrencyInput
                        form={form}
                        className={cn(
                            isTransfer
                                ? "text-chart-5"
                                : "text-chart-2",
                        )}
                        // maxValue={maxSpentAmount}
                        label="Amount"
                        name="amount"
                    />
                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="isTransfer"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem className="flex items-center gap-2">*/}
                    {/*            <FormLabel>Is Transfer</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Switch*/}
                    {/*                    checked={field.value}*/}
                    {/*                    onCheckedChange={field.onChange}*/}
                    {/*                />*/}
                    {/*            </FormControl>*/}
                    {/*            <FormMessage />*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    <FormField
                        control={form.control}
                        name="isTransfer"
                        render={({field}) => (
                            <FormItem>
                                <div className="flex flex-row gap-2 items-center">
                                    <FormControl>
                                        <Switch
                                            id="isTransfer"
                                            checked={form.getValues('isTransfer')}
                                            onCheckedChange={(value) => form.setValue('isTransfer', value)}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-xs text-muted-foreground">{form.getValues('isTransfer') ? "Transfer" : "Received"}</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Transaction description" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </>
            )}
        </CreateDialog>
    );
};

export default CreateTransactionDialog;