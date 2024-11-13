"use client";
import apolloClient from "@/api";
import {ApolloProvider} from "@apollo/client";
import {ThemeProvider} from "@/components/providers/theme.provider";
import {Provider as ReduxProvider} from "react-redux";
import {makeStore} from "@/state/store";
import {TooltipProvider} from "@/components/ui/tooltip";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <ReduxProvider store={makeStore()}>
            <ApolloProvider client={apolloClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    // enableSystem
                    // disableTransitionOnChange
                >
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </ThemeProvider>
            </ApolloProvider>
        </ReduxProvider>
    );
}
