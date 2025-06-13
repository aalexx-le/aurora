import { MetaMaskProvider } from "@/providers/MetaMaskProvider";
import { PaddleProvider } from "@/providers/PaddleProvider";
import AuthGuard from "./AuthGuard";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <PaddleProvider>
            <MetaMaskProvider>
                {children}
            </MetaMaskProvider>
        </PaddleProvider>
    );
}