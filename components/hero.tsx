"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyableBadge } from "@/components/copyable-badge";
import Link from "next/link";
import { HeroProps } from "@/types";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { ubuntu } from "@/lib/fonts";
// import { Spotlight } from "./ui/spotlight-new";

export function Hero({
  title,
  description,
  showCards = false,
  showTrustedBy = false,
  showCTA = false,
  ctaText = "Get Started",
  ctaLink = "#",
  secondaryCTA,
  cards = [],
  badge,
  trustedBy,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-24 min-h-screen pt-16 flex items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[0%] left-[33%] w-[700px] h-[300px] rounded-lg bg-accent/20 blur-[100px] hidden md:flex" />
        {/* <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[100px]" /> */}
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
        {/* <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-background" /> */}
      </div>
      {/* <Spotlight /> */}
      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {badge && (
              <div className="mb-6">
                <CopyableBadge
                  text={badge.text}
                  copyText={badge.copyText}
                  variant={badge.variant}
                  className={cn("text-sm cursor-copy", ubuntu.className)}
                />
              </div>
            )}
            <h1
              className={cn(
                "text-4xl font-bold tracking-tighter sm:text-5xl md:text-4xl lg:text-6xl"
              )}
            >
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {description}
            </p>
          </div>

          {showCTA && (
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild className="bg-primary">
                <Link href={ctaLink} className="group">
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              {secondaryCTA && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryCTA.link}>{secondaryCTA.text}</Link>
                </Button>
              )}
            </div>
          )}

          {showCards && cards.length > 0 && (
            <div className="mt-8 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="relative group overflow-hidden rounded-lg border bg-card p-8 text-start hover:border-secondary/90 transition-colors duration-300"
                >
                  <card.icon className="relative h-12 w-12 text-primary" />

                  <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showTrustedBy && trustedBy && (
            <div className="mt-12">
              {trustedBy.title && (
                <p className="mb-6 text-sm text-muted-foreground">
                  {trustedBy.title}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {trustedBy.items.map((item) => (
                  <>
                    {"src" in item ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        className="h-8 w-auto dark:brightness-0 dark:invert"
                        width={item.width}
                        height={item.height}
                      />
                    ) : (
                      <span className="text-md text-muted-foreground font-bold flex items-center">
                        {item.text}
                        <Separator orientation="vertical" />
                      </span>
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
