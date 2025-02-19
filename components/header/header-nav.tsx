import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { HeaderNavigationProps } from "@/types";
import Link from "next/link";
import React from "react";

export const HeaderNavigation = ({
  items,
  className,
}: HeaderNavigationProps) => {
  return (
    <NavigationMenu className={cn("hidden lg:flex", className)}>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items ? (
              <>
                <NavigationMenuTrigger className="bg-transparent">
                  <span className="flex items-center gap-2">
                    {item.triggerIcon && (
                      <item.triggerIcon className="h-4 w-4 text-primary" />
                    )}
                    {item.title}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "grid gap-3 p-4",
                      "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
                      //   item.featured
                      //     ? "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
                      //     : "w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[500px]"
                    )}
                  >
                    {item.featured && (
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={item.featured.href}
                          >
                            <item.featured.icon className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {item.featured.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {item.featured.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {item.items.map((subItem) => (
                      <ListItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.href || "/"} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  <span className="flex items-center gap-2">
                    {item.triggerIcon && (
                      <item.triggerIcon className="h-4 w-4 text-primary" />
                    )}
                    {item.title}
                  </span>
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
