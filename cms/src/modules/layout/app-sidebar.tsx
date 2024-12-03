import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CONFIG } from "@/config";
import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import type * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="p-2">
          <div className="flex items-center gap-2 ">
            <div className="flex items-center justify-center rounded aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
              <Layers className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 text-sm leading-none">
              <span className="font-semibold">{CONFIG.meta.repo}</span>
              <span className="text-muted-foreground">{CONFIG.meta.owner}</span>
            </div>
          </div>
        </div>
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {CONFIG.content.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ name, label, type }) => (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton asChild>
                      <Link to={`/${type}/${group.name}/${name}`}>{label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
