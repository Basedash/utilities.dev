import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "utilities.dev - Essential Developer Tools",
  description:
    "A collection of essential developer utilities including Base64 encoding, JSON formatting, regex testing, and more. Simple, fast, and free online tools.",
  keywords: [
    "developer tools",
    "utilities",
    "base64",
    "json formatter",
    "regex tester",
    "online tools",
    "free tools",
  ],
  authors: [{ name: "utilities.dev" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
