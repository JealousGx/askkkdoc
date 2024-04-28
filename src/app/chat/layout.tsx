import React from "react";

import { Toaster } from "@/components/ui/toaster";
import SidebarProvider from "@/hooks/SidebarProvider";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen flex max-h-screen overflow-scroll">
      <SidebarProvider>{children}</SidebarProvider>
      <Toaster />
    </main>
  );
}
