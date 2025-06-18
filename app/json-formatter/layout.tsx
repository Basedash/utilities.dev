import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | utilities.dev",
  description:
    "Free online JSON formatter, prettifier, and validator. Format, minify, and validate JSON data with syntax highlighting and error detection.",
};

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
