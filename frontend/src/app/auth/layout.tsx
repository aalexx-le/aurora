import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import Logo from "@/components/ui/logo";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <section className="w-min mx-auto my-auto mt-20">
                <div className="space-y-10 flex flex-col">
                    <AnimatedShinyText className="text-4xl inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 space-x-2">
                        <Logo className="h-10 w-10" />
                        <span>Aurora</span>
                    </AnimatedShinyText>
                    {children}
                </div>
            </section>
        </main>
    );
}
