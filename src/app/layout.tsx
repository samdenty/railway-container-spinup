import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RelayProvider } from "@/components/RelayProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deploy to Railway",
  description:
    "Search GitHub repos or Docker images and deploy them to Railway via the Railway GraphQL API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background flex flex-col">
        <RelayProvider>{children}</RelayProvider>
      </body>
    </html>
  );
}
