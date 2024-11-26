"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface FullPageLoadingProps {
  message?: string;
}

export default function FullPageLoading({
  message,
}: FullPageLoadingProps = {}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <Loader2 className="h-12 w-12 text-primary" aria-hidden="true" />
      </motion.div>
      {message && (
        <p
          className="mt-4 text-center text-sm text-muted-foreground sm:text-base"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
