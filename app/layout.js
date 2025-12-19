import { Lexend_Deca } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "next-themes";

import ToasterProvider from "@/providers/ToasterProvider";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["variable"],
});

export const metadata = {
  title: "Chat | Deforge",
  description: "Chat with AI Agents, Powered by Deforge",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexendDeca.className} antialiased`}>
        <ThemeProvider attribute="class">
          <ToasterProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
