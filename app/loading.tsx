"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-lg font-semibold text-foreground"
        >
          Loading, please wait...
        </motion.p>
      </motion.div>
    </div>
  );
}
