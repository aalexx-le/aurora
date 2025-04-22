"use client";
import apolloClient from "@/api";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorProvider from "@/providers/ErrorProvider";
import { makeStore } from "@/state/store";
import { ApolloProvider } from "@apollo/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as ReduxProvider } from "react-redux";
import { PaddleProvider } from "./PaddleProvider";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <ReduxProvider store={makeStore()}>
            <ApolloProvider client={apolloClient}>
                <ErrorProvider initGlobalHandler={true} logErrors={true}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        // enableSystem
                        // disableTransitionOnChange
                    >
                        <TooltipProvider>
                            <PaddleProvider>
                                <NuqsAdapter>{children}</NuqsAdapter>
                            </PaddleProvider>
                        </TooltipProvider>
                    </ThemeProvider>
                </ErrorProvider>
            </ApolloProvider>
        </ReduxProvider>
    );
}
