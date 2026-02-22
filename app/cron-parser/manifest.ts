import { Clock } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "cron-parser",
  slug: "cron-parser",
  title: "Cron Expression Parser",
  description:
    "Parse cron expressions into human-readable schedules and preview upcoming run times before deployment.",
  category: "Development",
  tags: ["cron", "schedule", "parser", "time", "automation", "unix"],
  icon: Clock,
  seo: {
    title: "Cron Expression Parser | utilities.dev",
    description:
      "Understand cron syntax quickly by parsing expressions into readable schedules and next-run previews in your browser.",
  },
  content: {
    intro: "Translate cron expressions into readable schedules and verify run timing.",
    trustNote:
      "Cron parsing runs locally in your browser, but scheduler behavior can still vary by platform and timezone settings.",
    howToSteps: [
      "Enter a cron expression in the parser input.",
      "Check the field breakdown and human-readable schedule text.",
      "Review upcoming run times and validate against your target environment.",
    ],
    about:
      "This tool helps you validate cron syntax and explain schedule intent before shipping job configurations. It is especially useful for preventing production scheduling mistakes caused by ambiguous fields or timezone assumptions.",
    useCases: [
      "Verifying recurring job schedules before deploy",
      "Explaining cron expressions during reviews",
      "Checking next execution windows for automation tasks",
    ],
    faqs: [
      {
        question: "Can this parser handle both 5-field and 6-field cron expressions?",
        answer:
          "Yes, it supports common 5-field syntax and compatible 6-field variants used by some schedulers. Always confirm the exact format your runtime expects.",
      },
      {
        question: "How do I verify when a cron job will run next?",
        answer:
          "Enter the expression and review the upcoming execution list to confirm timing. This catches mistakes early before jobs are deployed.",
      },
      {
        question: "Why can the same cron expression behave differently across platforms?",
        answer:
          "Cron engines differ in supported fields, special characters, and timezone handling. Validate expressions against the exact scheduler implementation you run in production.",
      },
      {
        question: "What cron mistakes cause the most scheduling bugs?",
        answer:
          "Common issues include mixing day-of-month with day-of-week semantics and misunderstanding step intervals. Another frequent problem is assuming every platform supports the same special tokens.",
      },
    ],
  },
};

export default manifest;
