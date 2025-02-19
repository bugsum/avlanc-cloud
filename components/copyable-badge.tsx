"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CopyableBadgeProps {
  text: string;
  copyText?: string;
  variant?: "default" | "success" | "info" | "warning" | "magic";
  className?: string;
}

export function CopyableBadge({
  text,
  variant = "default",
  copyText = "",
  className,
}: CopyableBadgeProps) {
  const [copied, setCopied] = useState(false);

  const getBgColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-500/20 hover:bg-green-500/30";
      case "info":
        return "bg-blue-500/20 hover:bg-blue-500/30";
      case "warning":
        return "bg-secondary/40 hover:bg-secondary/60";
      case "magic":
        return "bg-blue-600/30 hover:bg-blue-500/30";
      default:
        return "bg-primary/20 hover:bg-primary/30";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "success":
        return "text-green-500";
      case "info":
        return "text-blue-500";
      case "warning":
        return "text-yellow-500";
      case "magic":
        return "text-foreground";
      default:
        return "text-primary";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-pointer gap-1 transition-colors py-2 px-4 rounded-full",
        getBgColor(),
        getTextColor(),
        className
      )}
      onClick={handleCopy}
    >
      <span className="font-mono">{text}</span>
      {copyText ? (
        copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )
      ) : null}
    </Badge>
  );
}
