import { HeaderNavigationItems, HeaderNavigationMobileSection } from "@/types";
import {
  Briefcase,
  Gamepad,
  Globe,
  Globe2,
  Notebook,
  Server,
  // User,
  ServerCrash,
  ShoppingCart,
} from "lucide-react";

export const headerNavigationItems: HeaderNavigationItems[] = [
  {
    title: "Products",
    triggerIcon: Briefcase,
    featured: {
      title: "Game Server Hosting",
      icon: Gamepad,
      description: "Get the smoothest vibe of gaming with us!",
      href: "/store?category=Minecraft",
    },
    items: [
      {
        title: "Web Hosting",
        description: "The best web hosting solutions for the best web designs.",
        href: "/store?category=Web+Hosting",
      },
      {
        title: "VPS Hosting",
        description: "The most efficient private server solutions.",
        href: "/store?category=VPS",
      },
      {
        title: "Discord Bot Servers",
        description: "For the large scale communities.",
        href: "/store?category=Discord+Bots",
      },
    ],
  },
  {
    title: "About Us",
    triggerIcon: Globe,
    href: "/about",
  },
  // {
  //   title: "Careers",
  //   triggerIcon: User,
  //   href: "/careers",
  // },
  {
    title: "Blogs",
    triggerIcon: Notebook,
    href: "/blogs",
  },
  {
    title: "Store",
    triggerIcon: ShoppingCart,
    href: "/store",
  },
];

export const headerNavigationMobileSections: HeaderNavigationMobileSection[] = [
  {
    title: "Products",
    items: [
      {
        title: "Game Server Hosting",
        icon: Gamepad,
        href: "/store?category=Minecraft",
      },
      {
        title: "Web Hosting",
        icon: Globe2,
        href: "/store?category=Web+Hosting",
      },
      {
        title: "VPS Hosting",
        icon: Server,
        href: "/store?category=VPS",
      },
      {
        title: "Discord Bot Servers",
        icon: ServerCrash,
        href: "/store?category=Discord+Bots",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        title: "About Us",
        icon: Globe,
        href: "/about-us",
      },
      // {
      //   title: "Careers",
      //   icon: User,
      //   href: "/careers",
      // },
      {
        title: "Blogs",
        icon: Notebook,
        href: "/blogs",
      },
    ],
  },
];
