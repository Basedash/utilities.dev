import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter | utilities.dev",
  description:
    "Free online tool to convert Unix timestamps to human-readable dates and vice versa. Support for milliseconds and various date formats.",
};

export default function UnixTimestampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
