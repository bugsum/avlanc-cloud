"use client";

import { Hero } from "@/components/hero";
// import LocationMap from "@/components/location-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bitcoin,
  CheckCircle,
  Cpu,
  CreditCard,
  DollarSign,
  Globe,
  Server,
  Shield,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  { icon: CreditCard, label: "Credit Card" },
  { icon: Bitcoin, label: "Cryptocurrency" },
  { icon: DollarSign, label: "Bank Transfer" },
];

const hostingServices = [
  {
    title: "Web Hosting",
    description: "Perfect for websites and applications",
    features: ["Unlimited Bandwidth", "Free SSL", "24/7 Support"],
    price: "$0.69",
    icon: Globe,
    href: "/store?category=Web+Hosting",
  },
  {
    title: "VPS Hosting",
    description: "Full control and dedicated resources",
    features: ["Root Access", "SSD Storage", "Instant Scaling"],
    price: "$9.99",
    icon: Server,
    popular: true,
    href: "/store?category=VPS",
  },
  {
    title: "Game Servers",
    description: "Maximum performance and security",
    features: ["Enterprise Hardware", "DDoS Protection", "24/7 Support"],
    price: "$3.50",
    icon: Cpu,
    href: "/store?category=Minecraft",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        <Hero
          cards={[
            {
              title: "High-Performance Servers",
              description: "Enterprise-grade hardware for optimal performance",
              icon: Server,
            },
            {
              title: "DDoS Protection",
              description:
                "Advanced security measures to keep your servers safe",
              icon: Shield,
            },
            {
              title: "Latest Technology",
              description: "Cutting-edge infrastructure for maximum efficiency",
              icon: Cpu,
            },
          ]}
          title={
            <>
              High-Performance{" "}
              <span className="text-primary">Hosting Solutions</span>
            </>
          }
          description="Deploy your applications in seconds with our reliable and scalable cloud infrastructure. Experience the perfect balance of performance, security, and simplicity."
          showCards={true}
          showCTA={true}
          ctaText="Get Started"
          ctaLink="/store"
          secondaryCTA={{
            text: "Learn More",
            link: "/store#pricing",
          }}
          // cards={features}
          badge={{
            text: "Use code Avlanc2025 for a 30% Discount!",
            copyText: "Avlanc2025",
            variant: "warning",
          }}
        />

        {/* ------------------ The Services Showcase for the website ----------------- */}

        <section className="py-24 bg-accent/20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4">Our Services</Badge>
              <h2 className="text-3xl font-bold mb-4">Hosting Solutions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect hosting solution for your needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hostingServices.map((service) => (
                <div
                  key={service.title}
                  className={`relative rounded-lg bg-card/20 hover:bg-card/10 border p-6 transition-colors duration-500 ${
                    service.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {service.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold">{service.price}</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <Button className="w-full " asChild>
                    <Link href={service.href}>Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------- The Location Map for the website -------------------- */}

        {/* <LocationMap /> */}

        {/* --------------------- The CTA Section for the website -------------------- */}

        <section className="py-24 bg-background">
          <div className="container px-4">
            <div className="rounded-lg border bg-gradient-to-r from-accent/10 via-accent/20 to-accent/10 p-12 text-center shadow-lg">
              <Badge className="mb-4">Get Started</Badge>
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join our satisfied customers who trust Avlanc for their hosting
                needs
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/store">Visit Store</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Accepted Payment Methods
                </p>
                <div className="flex justify-center gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.label} className="flex items-center gap-2">
                      <method.icon className="h-5 w-5" />
                      <span className="text-sm">{method.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
