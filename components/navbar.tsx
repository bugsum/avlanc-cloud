"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Bot,
  BoxIcon,
  Gamepad,
  Moon,
  Server,
  ShoppingCart,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const solutions = [
  {
    title: "Game Server Hosting",
    href: "/game-servers",
    description: "Performance friendly game server solutions",
    icon: <Gamepad />,
  },
  {
    title: "VPS Hosting",
    href: "/vps-hosting",
    description: "Dedicated Resources fully manageable",
    icon: <Server />,
  },
  {
    title: "Discord Bot Hosting",
    href: "/discord-bot-hosting",
    description: "Specialized hosting for discord bots",
    icon: <Bot />,
  },
];

export function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full rounded-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* Brand Name & Logo */}
        <Link href={"/"} className="flex items-center space-x-2">
          <Image
            src={"/avlanc-transparent.png"}
            alt="ElightNodes Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Avlanc</span>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex gap-2 bg-transparent">
                <BoxIcon className="text-primary" width={18} />
                <span>Services</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  {solutions.map((solution) => (
                    <ListItem
                      key={solution.title}
                      title={solution.title}
                      icon={solution.icon}
                      href={solution.href}
                    >
                      {solution.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/store" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} flex gap-2 bg-transparent`}
                >
                  <ShoppingCart width={18} className="text-primary" />
                  <span>Store</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle Button */}
        <div className="flex items-center gap-4">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="mr-2"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: React.ReactNode;
  }
>(({ className, title, icon, children, ...props }, ref) => {
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
          <div className="text-sm font-medium leading-none flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
