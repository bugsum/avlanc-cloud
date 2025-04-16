"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaGithub, FaInstagram } from "react-icons/fa6";

const resources = [
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
  {
    title: "Store",
    href: "/store",
  },
  {
    title: "Status Page",
    href: "https://status.avlanc.com/",
  },
  {
    title: "Trustpilot Reviews",
    href: "https://www.trustpilot.com/review/avlanc.com",
  },
];

const socialIcons = [
  { icon: FaDiscord, title: "Discord", href: "https://discord.gg/N7CQBZhs" },
  { icon: FaGithub, title: "Github", href: "https://github.com" },
  {
    icon: FaInstagram,
    title: "Instagram",
    href: "https://www.instagram.com/avlancloud?igsh=bzN1bHZ6Nmwycjcz",
  },
];

const legal = [
  {
    title: "Privacy Policy",
    href: "/legal/privacy-policy",
  },
  {
    title: "Terms of Service",
    href: "/legal/terms-of-service",
  },
  {
    title: "Service Level Agreement",
    href: "/legal/service-level-agreement",
  },
  {
    title: "Acceptable Usage Policy",
    href: "/legal/acceptable-usage-policy",
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src={"/avlanc-transparent.png"}
                alt="Avlanc Logo"
                className="h-8 w-8 bg-transparent rounded-sm"
                width={64}
                height={64}
              />
              <span className="text-lg font-bold">Avlanc Cloud</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering businesses with next-generation cloud solutions.
              Experience the future of cloud computing with Avlanc.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((icons) => (
                <Button
                  key={icons.title}
                  variant="ghost"
                  size="icon"
                  className="hover:text-blue-500"
                >
                  <Link href={icons.href} target="_blank">
                    <icons.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resourceObj) => (
                <li key={resourceObj.title}>
                  <Link
                    key={resourceObj.title}
                    href={resourceObj.href}
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    {resourceObj.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {legal.map((legalObj) => (
                <li key={legalObj.title}>
                  <Link
                    key={legalObj.title}
                    href={legalObj.href}
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    {legalObj.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@avlanc.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 93026 87277</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Patel Nagar, Opp. BPCPS, Holkar Airport, Indore</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Avlanc. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with ❤️ by</span>
              <Link href="/" className="hover:text-blue-500">
                Avlanc Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
