import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {CreateCryptoPortfolioMutation, MutationCreateCryptoPortfolioArgs,} from "@/gql/graphql";
import {useMutation} from "@apollo/client";
import {CREATE_CRYPTO_PORTFOLIO} from "@/api/crypto";
import {useAppSelector} from "@/state/hooks";
import ButtonWithLoading from "@/components/ui/button-with-loading";
import {CreateCryptoPortfolioInput, createCryptoPortfolioSchema} from "@/lib/schema/cryptoPortfolio";

interface IProps {
    refresh: () => void;
}

export default function CreatePortfolioDialog({ refresh }: IProps) {
    const {
        state: { user },
    } = useAppSelector((state) => state.auth);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateCryptoPortfolioInput>({
        resolver: zodResolver(createCryptoPortfolioSchema),
    });
    const { setError } = form;
    const [createProfile] = useMutation<
        CreateCryptoPortfolioMutation,
        MutationCreateCryptoPortfolioArgs
    >(CREATE_CRYPTO_PORTFOLIO);

    async function onSubmit(createPortfolioDto: CreateCryptoPortfolioInput) {
        try {
            if (!user) return;
            setLoading(true);

            // TODO: check to connect to binance successfully
            // const client = new MainClient({
            //     api_key: createPortfolioDto.apiKey,
            //     api_secret: createPortfolioDto.secretKey
            // })
            // // const client = Binance({
            // //     apiKey: createPortfolioDto.apiKey,
            // //     apiSecret: createPortfolioDto.secretKey
            // // })
            // const transaction = await client.getAccountTradeList()
            // console.log({transaction})
            // const res = await login({ variables: { transaction: loginDto }});
            // if (!res.transaction) throw new Error("Login failed.");
            //
            // dispatch(authActions.loginWithPassword(loginDto));
            //
            // router.push(DASHBOARD_ROUTE.value)
            await createProfile({
                variables: {
                    data: {
                        ...createPortfolioDto,
                        userId: Number(user.id),
                    },
                },
            });
            setOpenDialog(false);
            refresh();
        } catch (error) {
            setError("apiKey", { message: "Cannot connect to your API" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenDialog(true)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Crypto Profile</DialogTitle>
                    <DialogDescription className="flex items-center">
                        How get API keys?
                        <Button asChild variant="link">
                            <a
                                target="_blank"
                                href={
                                    "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
                                }
                            >
                                binance
                            </a>
                        </Button>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        <FormField
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        API Key
                                        <span className="text-destructive"> (require)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="secretKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Secret Key
                                        <span className="text-destructive"> (require)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <ButtonWithLoading type="submit" loading={loading}>
                                Add
                            </ButtonWithLoading>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
