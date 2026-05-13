import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";

import { Toaster } from "@/components/providers/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnAI — AI-powered course marketplace",
  description: "Lessons taught by experts, understood with AI. Browse teacher-created lessons with AI-generated summaries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerifDisplay.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
