"use client";
import apolloClient from "@/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorProvider from "@/providers/ErrorProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { makeStore } from "@/state/store";
import { ApolloProvider } from "@apollo/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as ReduxProvider } from "react-redux";
import { MetaMaskProvider } from "./MetaMaskProvider";
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
                            <NuqsAdapter>{children}</NuqsAdapter>
                        </TooltipProvider>
                    </ThemeProvider>
                </ErrorProvider>
            </ApolloProvider>
        </ReduxProvider>
    );
}
