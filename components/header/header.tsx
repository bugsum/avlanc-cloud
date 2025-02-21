"use client";

import Image from "next/image";
import Link from "next/link";
import { HeaderNavigation } from "./header-nav";
import {
  headerNavigationItems,
  headerNavigationMobileSections,
} from "@/data/header";
import { HeaderNavigationMobile } from "./header-nav-mobile";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { burbankbigcondensed } from "@/lib/fonts";

export const Header = () => {
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 w-full z-50">
      <div
        id="wrapper"
        className="flex items-center justify-center h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      >
        <div
          id="header-content"
          className="flex items-center justify-between w-full px-6"
        >
          <Link href={"/"} className="flex items-center space-x-2">
            <Image
              src={"/avlanc-transparent.png"}
              alt="Avlanc Logo"
              className="h-8 w-8 bg-transparent rounded-full"
              width={64}
              height={64}
            />
            <span
              className={cn(
                "text-2xl hidden md:flex tracking-widest",
                burbankbigcondensed.className
              )}
            >
              Avlanc Cloud
            </span>
          </Link>

          <HeaderNavigation items={headerNavigationItems} />

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="mr-2"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <HeaderNavigationMobile
              logo={{
                src: "/avlanc-transparent.png",
                alt: "Avlanc Logo",
              }}
              sections={headerNavigationMobileSections}
              actions={{
                primary: {
                  title: "Store",
                  href: "/store",
                },
                // secondary: {
                //   title: "Contact",
                //   href: "/contact",
                // },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
