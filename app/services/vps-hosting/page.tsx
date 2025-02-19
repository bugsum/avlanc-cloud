"use client";

import { Hero } from "@/components/hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Lock, Shield } from "lucide-react";
import { useState } from "react";

export default function VPSHostingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  return (
    <div className="min-h-screen">
      <Hero
        badge={{ text: "VPS Hosting", variant: "magic" }}
        title="Virtual Private Servers"
        description="Deploy your applications on powerful VPS with dedicated resources and full root access"
        cards={[
          {
            title: "Dedicated Resources",
            description: "Guaranteed CPU and RAM allocation",
            icon: Cpu,
          },
          {
            title: "Enhanced Security",
            description: "Advanced firewall and DDoS protection",
            icon: Shield,
          },
          {
            title: "Root Access",
            description: "Full control over your server",
            icon: Lock,
          },
        ]}
        showCards={true}
      />

      <section className="py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground">
              Select the perfect VPS configuration for your needs
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant={billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly Billing
              </Button>
              <Button
                variant={billingCycle === "annual" ? "default" : "outline"}
                onClick={() => setBillingCycle("annual")}
              >
                Annual Billing
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
