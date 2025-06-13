"use client";

import AppBar from "@/components/appbar";
import AuthGuard from "../AuthGuard";

export default function MembershipLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="container mx-auto px-4 py-8">
        <AuthGuard>
          {children}
        </AuthGuard>
      </main>
    </div>
  );
} 