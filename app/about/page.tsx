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

// const stats = [
//   { label: "Years of Excellence", value: "10+", icon: Building2 },
//   { label: "Global Customers", value: "1M+", icon: Globe },
//   { label: "Team Members", value: "100+", icon: Users2 },
//   { label: "Countries Served", value: "50+", icon: Globe },
//   { label: "Data Centers", value: "25+", icon: Shield },
//   { label: "Uptime SLA", value: "99.99%", icon: Rocket },
// ];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're committed to democratizing cloud hosting and making it accessible to everyone.",
  },
  {
    icon: Users2,
    title: "Customer First",
    description:
      "Our customers' success is our success. We go above and beyond to ensure satisfaction.",
  },
  {
    icon: Building2,
    title: "Innovation",
    description:
      "We continuously push boundaries to deliver cutting-edge solutions.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Quality is at the heart of everything we do, from code to customer service.",
  },
  {
    icon: HeartHandshake,
    title: "Partnership",
    description:
      "We build lasting relationships with our clients, growing together.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Your data's security is our top priority, with enterprise-grade protection.",
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
                We&apos;re on a mission to make cloud hosting accessible,
                reliable, and scalable for everyone. Join us in shaping the
                future of cloud technology.
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

      {/* Stats Section */}
      {/* <section className="py-12 md:py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center space-y-2 rounded-lg bg-card p-4 shadow-sm"
              >
                <stat.icon className="h-8 w-8 text-primary" />
                <div className="text-3xl font-bold md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission & Values Section */}
      <section className="py-12 md:py-24" ref={valuesSectionRef}>
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do
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
          Be part of our mission to revolutionize cloud hosting.
          We&apos;re always looking for talented individuals to join our
          team.
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
