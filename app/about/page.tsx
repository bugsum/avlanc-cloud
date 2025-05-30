"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Users2,
  Target,
  Award,
  Shield,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description:
      "We're on a mission to empower businesses through intuitive digital solutions.",
  },
  {
    icon: Users2,
    title: "Customer First",
    description:
      "We build with our clients, not just for them — your goals are our blueprint.",
  },
  {
    icon: Building2,
    title: "Innovation",
    description:
      "We leverage the latest tech to craft scalable, future-ready products.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Clean code, pixel-perfect design, and top-tier performance are our defaults.",
  },
  {
    icon: HeartHandshake,
    title: "Collaboration",
    description:
      "We form lasting partnerships that evolve with your vision and growth.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "From frontend to backend, we bake in security and trust at every step.",
  },
];

export default function AboutPage() {
  const valuesSectionRef = useRef<HTMLDivElement>(null);

  const handleLearnMoreClick = () => {
    if (valuesSectionRef.current) {
      valuesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24">
        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Our Story
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                At Avlanc, we&apos;re redefining digital experiences through custom-built apps, websites, and integrated systems. Whether you're a startup or an enterprise, we help you turn ideas into scalable digital products.
              </p>
            </div>

            <Button
              className="inline-flex h-11 items-center justify-center rounded-md border border-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 group"
              onClick={handleLearnMoreClick}
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-24" ref={valuesSectionRef}>
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              Principles that guide how we design, build, and deliver
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg flex items-center justify-center flex-col text-center hover:border-accent/50 hover:bg-secondary/50 transition-all duration-300"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-primary/10 transition-transform group-hover:scale-105" />
                  <value.icon className="relative h-12 w-12 text-primary transition-transform group-hover:scale-105" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Join Our Growing Team
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Passionate about tech, design, or product? Help us build digital tools that transform businesses across the globe.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScVtjmJ-S-YaxsYuug4mLKAybKzAVbSbeLXfzfaXkl2T6CPRA/viewform?usp=sf_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
