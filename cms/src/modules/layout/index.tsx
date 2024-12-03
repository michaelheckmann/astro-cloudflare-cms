import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/layout/app-sidebar";
import type React from "react";
import { Breadcrumbs } from "./breadcrumbs";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex items-center h-16 gap-2 px-4 border-b bg-background shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumbs />
        </header>
        <main className="flex flex-col flex-1 min-h-screen gap-4 p-4 font-sans antialiased bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
