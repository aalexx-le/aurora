import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,} from "@/components/ui/input-otp";
import {useEffect, useState} from "react";
import {OtpPurpose} from "@/gql/graphql";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {authActions} from "@/state/slices/auth.slice";
import {cn} from "@/lib/utils";

export function VerifyForm() {
    const [otp, setOTP] = useState<string>("");
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const isDone = isVerified && !error;

    const onInputOTP = async (inputValue: string) => {
        setOTP(inputValue);
        if (inputValue.length === 6) {
            await dispatch(
                authActions.verifyAccount({
                    otp: inputValue,
                    otpPurpose: OtpPurpose.VerifyAccount,
                }),
            );
            await dispatch(authActions.loginWithToken());
            setIsVerified(true);
        }
    };

    useEffect(() => {
        if (error) {
            setOTP("");
        }
    }, [error]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Activate your email</CardTitle>
                <CardDescription
                    className={cn(error ? "text-destructive" : "")}
                >
                    {error
                        ? error
                        : !isVerified
                          ? "Please check your input email to get OTP"
                          : "Verified successfully"}
                </CardDescription>
            </CardHeader>
            {!isDone ? (
                <CardContent className="space-y-2 flex flex-col items-center justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={onInputOTP}
                        disabled={loading}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {loading ? (
                        <CardDescription className="w-10 flex justify-evenly items-center dark:invert">
                            <span className="sr-only">Loading...</span>
                            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
                        </CardDescription>
                    ) : (
                        <div>
                            <span>Haven&apos;t received it?</span>
                            <Button variant="link" className="text-gray-500">
                                Resend a new code.
                            </Button>
                        </div>

                    )}
                </CardContent>
            ) : (
                <CardContent className="flex justify-end">
                    <Button className="ml-auto" variant="secondary">
                        <Link href={DASHBOARD_ROUTE.value}>
                            Go to your dashboard
                        </Link>
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
