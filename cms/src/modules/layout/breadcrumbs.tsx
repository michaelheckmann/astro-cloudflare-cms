import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CONFIG } from "@/config";
import { Link, useParams } from "@tanstack/react-router";
import React from "react";

export const Breadcrumbs = () => {
  const { group, name } = useParams({ strict: false });
  const crumbs = [group, name].filter((c) => c !== undefined);

  const contentItem = CONFIG.content
    .find((g) => group === g.name)
    ?.items.find((i) => name === i.name);

  if (crumbs.length === 0 || !contentItem) {
    return null;
  }

  return (
    <>
      <Separator orientation="vertical" className="h-4 mr-2" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            if (index === crumbs.length - 1) {
              return (
                <BreadcrumbItem key={crumb}>
                  <BreadcrumbPage>{crumb}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            }

            return (
              <React.Fragment key={crumb}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to={`/${contentItem.type}/${crumbs.slice(0, index + 1).join("/")}`}
                    >
                      {crumb}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
