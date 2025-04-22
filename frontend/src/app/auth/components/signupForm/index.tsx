import Link from "next/link";

import { SIGNUP_MUTATION } from "@/api/scripts/auth/auth";
import { TABS } from "@/app/auth/page";
import ButtonWithLoading from "@/components/ui/button-with-loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupMutation, SignupMutationVariables, } from "@/gql/graphql";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import { signupSchema, SignupSchemaType } from "@/lib/schema/signup";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { authActions } from "@/state/slices/auth.slice";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraphQLError } from "graphql/error";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GoogleButton } from "../GoogleButton";

interface SignupFormProps {
    setActiveTab: (tab: string) => void;
}

export function SignupForm({ setActiveTab }: SignupFormProps) {
    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const {
        setError,
        formState: { errors },
    } = form;
    const { loading } = useAppSelector((state) => state.auth);
    const [signup] = useMutation<SignupMutation, SignupMutationVariables>(
        SIGNUP_MUTATION,
    );
    const dispatch = useAppDispatch();
    const router = useRouter();

    async function onSubmit(signupFormData: SignupSchemaType) {
        try {
            const { confirmPassword, ...signupDto } = signupFormData;
            await signup({ variables: { data: signupDto } });
            await dispatch(
                authActions.loginWithPassword({
                    email: signupDto.email,
                    password: signupDto.password,
                }),
            );
            await dispatch(authActions.loginWithToken());
            router.push(AUTH_ROUTE.verifyAccount.value);
        } catch (error: unknown) {
            if (error instanceof GraphQLError && error?.message === "Account already exists") {
                setError("email", {
                    type: "manual",
                    message: "Account already exists",
                });
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>
                    Ready to join? Please enter your details and start journey
                    with us.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your full name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="example@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    {!errors.email && (
                                        <FormDescription>
                                            This is your login account.
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your password
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormDescription>
                                        Confirm your password
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonWithLoading
                            loading={loading}
                            type="submit"
                            className="w-full"
                        >
                            Signup
                        </ButtonWithLoading>
                        <div
                            className="
                                flex items-center
                                text-sm
                                before:flex-1 before:border-t after:border-t
                                before:border-t-border after:border-t-border
                                before:me-6 after:flex-1
                                after:ms-6 dark:text-white"
                        >
                            OR
                        </div>
                        <GoogleButton 
                            className="mt-2"
                        >
                            Sign up with Google
                        </GoogleButton>


                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="#" className="underline" onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(TABS.LOGIN);
                            }}>
                                Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
