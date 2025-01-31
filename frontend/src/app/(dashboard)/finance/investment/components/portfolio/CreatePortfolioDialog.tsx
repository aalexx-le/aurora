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
import {CexExchanges, CreateCryptoPortfolioMutation, MutationCreateCryptoPortfolioArgs,} from "@/gql/graphql";
import {useMutation} from "@apollo/client";
import {CREATE_CRYPTO_PORTFOLIO, GET_CRYPTO_PORTFOLIOS} from "@/api/script/crypto/crypto";
import {useAppSelector} from "@/state/hooks";
import ButtonWithLoading from "@/components/ui/button-with-loading";
import {CreateCryptoPortfolioInput, createCryptoPortfolioSchema} from "@/lib/schema/cryptoPortfolio";
import {ExchangeSelect} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";
import {GET_CREATE_PORTFOLIO_EXECUTIONS} from "@/api/script/crypto/execution";
import {useCreatePortfolio} from "@/app/(dashboard)/finance/investment/components/portfolio/useCreatePortfolio";

interface IProps {
}

export default function CreatePortfolioDialog({}: IProps) {
    const {
        state: {user},
    } = useAppSelector((state) => state.auth);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateCryptoPortfolioInput>({
        defaultValues: {
            exchanges: CexExchanges.Binance,
        },
        resolver: zodResolver(createCryptoPortfolioSchema),
    });
    const {setError, getValues, setValue, watch} = form;
    const reviewExchanges = watch("exchanges");
    const {createPortfolio, createOKXPortfolio} = useCreatePortfolio()

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
            console.log({createPortfolioDto})
            if (createPortfolioDto.exchanges == CexExchanges.Okx) {
                await createOKXPortfolio({
                    variables: {
                        data: {
                            ...createPortfolioDto,
                            exchanges: createPortfolioDto.exchanges as CexExchanges,
                            userId: Number(user.id),
                            passphrase: createPortfolioDto.passphrase as string,
                        },
                    },
                });
            }
            else {
                await createPortfolio({
                    variables: {
                        data: {
                            ...createPortfolioDto,
                            exchanges: createPortfolioDto.exchanges as CexExchanges,
                            userId: Number(user.id),
                        },
                    },
                });
            }

            setOpenDialog(false);
        } catch (error) {
            setError("apiKey", {message: "Cannot connect to your API"});
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
                    <Plus className="h-4 w-4"/>
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
                            name="exchanges"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Exchanges
                                    </FormLabel>
                                    <FormControl>
                                        <ExchangeSelect
                                            selectedExchanges={getValues("exchanges")}
                                            setSelectedExchanges={(v) =>
                                                setValue("exchanges", v)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Portfolio Name
                                        <span className="text-muted-foreground"> (optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                    <FormLabel>
                                        API Key
                                        <span className="text-destructive"> (require)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="secretKey"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Secret Key
                                        <span className="text-destructive"> (require)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {reviewExchanges == CexExchanges.Okx && <FormField
                            control={form.control}
                            name="passphrase"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Passphrase
                                        <span className="text-destructive"> (require)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />}
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
