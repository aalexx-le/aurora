import { CREATE_BANK_ACCOUNT, GET_BANK_ACCOUNTS } from "@/api/bank/account";
import { GET_BANK_MANAGERS } from "@/api/bank/manager";
import { BankInfo, VietNamBankSelect } from "@/app/(dashboard)/finance/bank/components/bank-select/BankSelect";
import BankManagerSelect from "@/app/(dashboard)/finance/components/bank-manager-select/BankManagerSelect";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { CreateBankAccountMutation, CreateBankAccountMutationVariables } from "@/gql/graphql";
import { CreateBankAccountInput, createBankAccountSchema } from "@/lib/schema/bankAccount";
import { useMutation } from '@apollo/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

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

    const [createAccount, { loading }] = useMutation<CreateBankAccountMutation, CreateBankAccountMutationVariables>(CREATE_BANK_ACCOUNT, {
        refetchQueries: [GET_BANK_MANAGERS, GET_BANK_ACCOUNTS],
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

    const handleBankSelect = (bankInfo: BankInfo) => {
        form.setValue("name", bankInfo.name);
        form.setValue("fullName", bankInfo.fullName);
    };

    return (
        <CreateOrUpdateDialog<CreateBankAccountInput>
            title="New Bank Account"
            form={form}
            formSchema={createBankAccountSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
            triggerButton={
                <Button
                    variant="outline"
                >
                    Bank Account
                    <Plus className="size-4 ml-2" />
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
                                <FormLabel>Bank</FormLabel>
                                <FormControl>
                                    <VietNamBankSelect
                                        selectedBank={form.getValues("name")}
                                        setSelectedBank={handleBankSelect}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        disabled
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
        </CreateOrUpdateDialog>
    );
};

export default CreateBankAccountDialog;