import {CREATE_BANK_MANAGER, GET_BANK_MANAGERS} from "@/api/script/bank/manager";
import {CreateDialog} from "@/components/create-dialog";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from '@/components/ui/input';
import {CreateBankManagerInput, createBankManagerSchema} from "@/lib/schema/bankManager";
import {useAppSelector} from "@/state/hooks";
import {useMutation} from '@apollo/client';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AutoBankManagerThirdParty, CreateBankManagerMutation, CreateBankManagerMutationVariables} from "@/gql/graphql";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ExchangeSelect} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";
import {ThirdPartySelect} from "@/app/(dashboard)/finance/components/third-party-select/ThirdPartySelect";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

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
        <CreateDialog<CreateBankManagerInput>
            title="New Bank Manager"
            form={form}
            formSchema={createBankManagerSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
            triggerButton={
                <Button
                    variant="outline"
                    size="icon"
                >
                    <Plus className="size-4"/>
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
        </CreateDialog>
    );
};

export default CreateBankManagerDialog; 