"use client";

import { Toaster } from "sonner";
import { Lexend_Deca } from "next/font/google";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["variable"],
});

export default function ToasterProvider() {
  return (
    <Toaster
      richColors
      position="bottom-right"
      toastOptions={{
        className: `flex items-center justify-center text-center border ${lexendDeca.className}`,
        style: {
          padding: "15px",
          fontSize: "12px",
          borderRadius: "6px",
          color: "var(--foreground)",
          backgroundColor: "var(--card)",
          borderColor: "var(--muted-foreground)",
        },
      }}
    />
  );
}
