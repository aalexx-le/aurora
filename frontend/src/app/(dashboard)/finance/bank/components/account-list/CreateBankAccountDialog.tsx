import { CREATE_BANK_ACCOUNT } from "@/api/script/bank/account";
import { CreateDialog } from "@/components/create-dialog";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { CreateBankAccountInput, createBankAccountSchema } from "@/lib/schema/bankAccount";
import { useMutation } from '@apollo/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import BankManagerSelect from "@/app/(dashboard)/finance/components/bank-manager-select/BankManagerSelect";
import BankAccountSelect from "./BankAccountSelect";

interface CreateBankAccountDialogProps {
}

const defaultValues: CreateBankAccountInput = {
    name: "",
    fullName: "",
    accountName: "",
    accountNumber: "",
    balance: 0,
    bankManagerId: "",
};

const CreateBankAccountDialog = ({ }: CreateBankAccountDialogProps) => {
    const form = useForm<CreateBankAccountInput>({
        resolver: zodResolver(createBankAccountSchema),
        defaultValues: {
            ...defaultValues,
        }
    });

    const [createAccount, { loading }] = useMutation(CREATE_BANK_ACCOUNT, {
        // refetchQueries: [{
        //     query: GET_BANK_ACCOUNTS,
        //     variables: { bankManagerId }
        // }],
        awaitRefetchQueries: true,
    });

    const handleSubmit = async (data: CreateBankAccountInput) => {
        await createAccount({
            variables: {
                data: {
                    ...data,
                    balance: Number(data.balance),
                }
            }
        });
    };

    return (
        <CreateDialog<CreateBankAccountInput>
            title="New Bank Account"
            form={form}
            formSchema={createBankAccountSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
            triggerButton={
                <Button
                    variant="outline"
                    size="icon"
                >
                    <Plus className="size-4" />
                </Button>
            }
        >
            {(form) => (
                <>
                    <FormField
                        control={form.control}
                        name="bankManagerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Manager</FormLabel>
                                <FormControl>
                                    <BankManagerSelect
                                        buttonClassName="w-full"
                                        selectedBankManagerId={form.getValues("bankManagerId")}
                                        setSelectedBankManager={(bankManager) => form.setValue("bankManagerId", bankManager.id)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Vietin" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Bank Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ngân hàng TMCP Công Thương Việt Nam" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accountName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Alex Le" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="balance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Initial Balance</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </CreateDialog>
    );
};

export default CreateBankAccountDialog; 