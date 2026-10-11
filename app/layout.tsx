import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Northline Rental | Car rental without the clutter",
    template: "%s | Northline Rental",
  },
  description: "Browse a focused Metro Manila car-rental fleet, compare clear daily sample prices, and reserve when you are ready.",
  keywords: ["car rental", "Metro Manila car rental", "car rental demo", "Next.js car rental"],
  openGraph: {
    title: "Northline Rental | Car rental without the clutter",
    description: "Browse a focused Metro Manila car-rental fleet and reserve when you are ready.",
    type: "website",
    siteName: "Northline Rental",
    locale: "en_PH",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
