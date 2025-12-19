"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Runtime Application Error:", error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground gap-6 p-4">
      <div className="flex flex-col items-center gap-2 text-center max-w-125">
        <div className="p-3 bg-destructive/10 rounded-full mb-2">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>

        <p className="text-muted-foreground text-sm">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="min-w-30"
        >
          Reload Page
        </Button>

        <Button onClick={() => reset()} className="min-w-30 gap-2">
          <RotateCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
