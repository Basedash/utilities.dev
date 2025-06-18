import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Tool | utilities.dev",
  description:
    "Free online text diff tool to compare two text blocks and highlight differences. Perfect for code reviews, document comparisons, and spotting changes.",
};

export default function DiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
