"use client";

import { Hero } from "@/components/hero";
// import LocationMap from "@/components/location-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  CheckCircle,
  Code,
  Cpu,
  CreditCard,
  IndianRupee,
  Rocket,
  Shield,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  { icon: CreditCard, label: "Credit Card" },
  { icon: Banknote, label: "Bank Transfer" },
  { icon: IndianRupee, label: "UPI" },
];

const developmentServices = [
  {
    title: "App & Web Development",
    description: "Build scalable, high-performance apps and websites",
    features: [
      "Mobile & Web App Dev",
      "Backend/API Systems",
      "UI/UX Design",
    ],
    price: "Starting at ₹15,000",
    icon: Code,
    href: "/services/app-web-development",
  },
  {
    title: "E-Commerce Integration",
    description: "Launch or upgrade your online store with flexibility",
    features: [
      "Payment Gateway Integration",
      "Secure Checkout",
      "CMS & Inventory Systems",
    ],
    price: "Starting at ₹25,000",
    icon: ShoppingCart,
    popular: true,
    href: "/services/ecommerce",
  },
  {
    title: "Performance Optimization",
    description: "Speed up and improve your existing app or site",
    features: [
      "Speed & SEO Boosting",
      "Cloud & CDN Setup",
      "Responsive Fixes",
    ],
    price: "Starting at ₹12,000",
    icon: Rocket,
    href: "/services/performance",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        {/* <div className="gradient" /> */}
        <Hero
          cards={[
            {
              title: "Custom-Built Applications",
              description: "Tailored mobile and web apps that align with your business goals",
              icon: Code,
            },
            {
              title: "Secure Payment Integration",
              description:
                "Built-in Payment gateways and end-to-end security for peace of mind",
              icon: Shield,
            },
            {
              title: "Modern Tech Stack",
              description: "We use the latest frameworks and tools to build fast, scalable solutions",
              icon: Cpu,
            },
          ]}
          title={
            <>
              Next Gen{" "}
              <span className="text-primary">Development</span>
              {" "}Services
            </>
          }
          description="Launch powerful digital experiences with our full-stack development solutions. From mobile apps to scalable web platforms — we deliver performance, security, and seamless integration."
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
            text: "New Service launched!",
            // copyText: "New Service launched!",
            variant: "magic",
          }}
        />

        {/* ------------------ The Services Showcase for the website ----------------- */}

        <section className="py-24 bg-accent/20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4">Our Services</Badge>
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect development solution for your needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {developmentServices.map((service) => (
                <div
                  key={service.title}
                  className={`relative rounded-lg bg-card/20 hover:bg-card/10 border p-6 transition-colors duration-500 ${service.popular ? "border-primary shadow-lg" : ""
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
              <h2 className="text-4xl font-bold mb-4">Ready to Build Something Great?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join startups, creators, and businesses who trust Avlanc for their app and web development needs — now with seamless Payment integration.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/services">Explore Services</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Talk to Our Team</Link>
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
