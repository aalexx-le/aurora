import { CREATE_BANK_MANAGER, GET_BANK_MANAGERS } from "@/api/scripts/bank/manager";
import { ThirdPartySelect } from "@/app/(dashboard)/finance/components/third-party-select/ThirdPartySelect";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { AutoBankManagerThirdParty, CreateBankManagerMutation, CreateBankManagerMutationVariables } from "@/gql/graphql";
import { CreateBankManagerInput, createBankManagerSchema } from "@/lib/schema/bankManager";
import { useMutation } from '@apollo/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

const defaultValues: CreateBankManagerInput = {
    name: "",
    isAuto: false,
    thirdParty: AutoBankManagerThirdParty.Casso,
};

const CreateBankManagerDialog = () => {
    const form = useForm<CreateBankManagerInput>({
        resolver: zodResolver(createBankManagerSchema),
        defaultValues
    });

    const [createManager, {loading}] = useMutation<CreateBankManagerMutation, CreateBankManagerMutationVariables>(CREATE_BANK_MANAGER, {
        refetchQueries: [GET_BANK_MANAGERS, 'GetBankManagers'],
        awaitRefetchQueries: true,
    });

    const handleSubmit = async (data: CreateBankManagerInput) => {
        await createManager({
            variables: {
                data: {
                    name: data.name,
                }
            }
        });
    };

    return (
        <CreateOrUpdateDialog<CreateBankManagerInput>
            title="New Bank Manager"
            form={form}
            formSchema={createBankManagerSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
            triggerButton={
                <Button
                    variant="outline"
                >
                    Bank Manager
                    <Plus className="size-4 ml-2"/>
                </Button>
            }
        >
            {(form) => (
                <>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Manager name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isAuto"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-y-0 gap-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="leading-none">
                                    <FormLabel>Auto Bank Manager</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    {form.watch('isAuto') && (
                        <>
                            <FormField
                                control={form.control}
                                name="thirdParty"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Third Party
                                        </FormLabel>
                                        <FormControl>
                                            <ThirdPartySelect
                                                selectedThirdParty={form.getValues("thirdParty")}
                                                setSelectedThirdParty={(v) =>
                                                    form.setValue("thirdParty", v)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="API Key" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </>
            )}
        </CreateOrUpdateDialog>
    );
};

export default CreateBankManagerDialog; 