"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { renderMarkdown } from "@/lib/utils";
import type { LegalPolicy as LegalPolicyType } from "@/types";

export function LegalPolicy({
  policy,
}: {
  policy: LegalPolicyType | undefined;
}) {
  if (!policy) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Policy not found</h1>
          <Button asChild className="mt-4">
            <Link href="/legal">Back to Legal</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderedContent = renderMarkdown(policy.content);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/legal" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Legal
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">{policy.title}</h1>
                <p className="mt-2 text-muted-foreground">
                  Last updated: {policy.lastUpdated}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          <Separator className="my-8" />

          {/* Footer */}
          <div className="mt-8 rounded-lg bg-muted p-6">
            <h2 className="text-lg font-semibold">
              Questions about this policy?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Contact our legal team at legal@avlanc.com for clarification or
              concerns about this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
