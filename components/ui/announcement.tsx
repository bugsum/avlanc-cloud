"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  message: string;
  link?: {
    text: string;
    href: string;
  };
  variant?: "default" | "success" | "info" | "warning";
  copyText?: string;
  classname?: string;
}

export function Announcement({
  message,
  link,
  variant = "default",
  classname,
}: //   copyText,
AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getBgColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-500/10";
      case "info":
        return "bg-blue-500/10";
      case "warning":
        return "bg-yellow-500/10";
      default:
        return "bg-primary/10";
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
      default:
        return "text-primary";
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={cn("relative w-full", getBgColor(), classname)}
    >
      <div className="container">
        <div className="flex h-auto flex-wrap items-center justify-center gap-2 px-4 py-2 text-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </span>
            {link && (
              <Badge variant={"default"}>
                <a
                  href={link.href}
                  className="text-sm font-medium hover:underline"
                >
                  {link.text}
                </a>
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
