"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function CTASection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-primary/90 px-6 py-20 shadow-2xl">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="bg-gradient-to-br from-white to-white/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Transform Your Digital Experience Today
        </h2>
        <p className="mt-6 text-lg leading-8 text-white/90">
          Join thousands of satisfied customers who have already taken their
          business to the next level. Start your journey with our powerful
          platform today.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10"
          >
            Schedule Demo
          </Button>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Enterprise-grade security
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Lightning-fast performance
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 24/7 Premium support
          </div>
        </div>
      </div>
    </div>
  );
}
