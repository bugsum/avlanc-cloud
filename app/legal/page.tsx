"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Lock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { legalContent } from "@/data/legal";

const policies = [
  {
    title: "Terms of Service",
    slug: "terms-of-service",
    icon: FileText,
    description: "Our terms and conditions for using Avlanc Services",
    lastUpdated: "February 18th, 2025",
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    icon: Lock,
    description: "How we collect, use, and protect your personal information",
    lastUpdated: "February 18th, 2025",
  },
  {
    title: "Service Level Agreement",
    slug: "service-level-agreement",
    icon: Scale,
    description: "Our commitments to service availability and performance",
    lastUpdated: "February 18th, 2025",
  }, 
  {
    title: "Acceptable Usage Policy",
    slug: "acceptable-usage-policy",
    icon: Scale,
    description: "Our guidelines for acceptable use of Avlanc Services",
    lastUpdated: "February 18th, 2025",
  }, 
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24">
        <div className="container px-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Terms & Policies
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our commitment to transparency and legal compliance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <policy.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{policy.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {policy.lastUpdated}
                      </p>
                    </div>
                    <Button variant="ghost" asChild>
                      <Link
                        href={`/legal/${policy.slug}`}
                        className="flex items-center"
                      >
                        Read More
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-secondary/30">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="text-muted-foreground">
                For legal inquiries or questions about our policies, please
                contact our legal team at:
              </p>
              <p className="font-medium">legal@avlanc.com</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Policy Updates</h2>
              <p className="text-muted-foreground">
                We regularly update our policies to ensure compliance with
                regulations and to better serve our users. When we make
                significant changes, we will notify you via email.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Compliance</h2>
              <p className="text-muted-foreground">
                We are committed to maintaining compliance with international
                data protection regulations, including GDPR, CCPA, and other
                applicable laws.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
