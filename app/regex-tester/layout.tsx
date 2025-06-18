import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester & Validator | utilities.dev",
  description:
    "Free online regular expression tester and debugger. Test regex patterns, view matches, capture groups, and validate regular expressions with real-time feedback.",
};

export default function RegexTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
