import type { Metadata } from "next";

import { Toaster } from "@/components/providers/toaster";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
