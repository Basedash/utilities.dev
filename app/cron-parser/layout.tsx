import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Parser & Generator | utilities.dev",
  description:
    "Free online cron expression parser and generator. Parse cron expressions into human-readable descriptions and see upcoming execution times with detailed syntax help.",
};

export default function CronParserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
