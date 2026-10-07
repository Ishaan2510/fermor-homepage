import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// All fonts are self-hosted: the page makes no third-party requests.
const newsreader = localFont({
  src: [
    { path: "./fonts/Newsreader.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/Newsreader-Italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fermor · Smart financial decisions, built for India",
  description:
    "Free personal finance calculators built for India that show the full math, not just the answer. EMI, SIP, FD and income tax, with no login wall.",
};

export const viewport: Viewport = {
  themeColor: "#f5f2ea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
