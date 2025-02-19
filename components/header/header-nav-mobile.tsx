import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { HeaderNavigationMobileProps } from "@/types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const HeaderNavigationMobile = ({
  sections,
  logo,
  actions,
}: HeaderNavigationMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant={"ghost"} size={"icon"}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side={"left"} className="w-[300px] p-0">
        <div className="border-b p-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            {logo && (
              <Image src={logo.src} alt={logo.alt} width={24} height={24} />
            )}
            <span className="font-bold">ElightNodes</span>
          </Link>

          <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>

        <nav className="flex flex-col p-4">
          {sections.map((section, index) => (
            <div key={section.title} className="py-2">
              <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                {section.title}
              </h4>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              ))}
              {index < sections.length - 1 && <Separator className="my-2" />}
            </div>
          ))}

          {actions && (
            <div className="mt-4 space-y-2">
              {actions.primary && (
                <Button
                  asChild
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={actions.primary.href}>
                    {actions.primary.title}
                  </Link>
                </Button>
              )}
              {actions.secondary && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={actions.secondary.href}>
                    {actions.secondary.title}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
