import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "../providers";
import "./globals.css";
import { ReactScan } from "@/components/react-scan";
// import Header from "@/app/home/components/header";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aurora",
  icons: {
    icon: [
    //   { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo/logo-white.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-theme="light" suppressHydrationWarning={true}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased w-full h-screen flex flex-col box-border`}
                suppressHydrationWarning={true}
            >
                <Providers>
                  <ScrollArea>
                      {/*<Header/>*/}
                      <ReactScan />
                      {children}
                      <Toaster />
                  </ScrollArea>
                </Providers>
            </body>
        </html>
    );
}
