"use client";

import Link from "next/link";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {authActions} from "@/state/slices/auth.slice";
import ButtonWithLoading from "@/components/ui/button-with-loading";
import {useSubmitError} from "@/app/auth/components/signupForm/useSubmitError";
import {loginSchema, LoginSchemaType} from "@/lib/schema/login";


export function LoginForm() {
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const {
        formState: { errors },
        setError,
    } = form;
    const { loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useSubmitError(setError);
    async function onSubmit(loginDto: LoginSchemaType) {
        await dispatch(authActions.loginWithPassword(loginDto));
        await dispatch(authActions.loginWithToken());
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Welcome back! Please enter your email address and password
                    to login.
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
                                    {!errors.password && (
                                        <FormDescription>
                                            Enter your password
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonWithLoading
                            loading={loading}
                            type="submit"
                            className="w-full"
                        >
                            Login
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
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="#" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
