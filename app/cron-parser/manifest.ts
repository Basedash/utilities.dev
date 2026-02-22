import { Clock } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "cron-parser",
  slug: "cron-parser",
  title: "Cron Expression Parser",
  description:
    "Parse and understand cron expressions with human-readable descriptions and upcoming execution times.",
  category: "Development",
  tags: ["cron", "schedule", "parser", "time", "automation", "unix"],
  icon: Clock,
  seo: {
    title: "Cron Expression Parser & Generator | utilities.dev",
    description:
      "Free online cron expression parser and generator. Parse cron expressions into human-readable descriptions and see upcoming execution times with detailed syntax help.",
  },
  content: {
    intro: "Understand cron expressions with human-readable scheduling output.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Enter a cron expression in the input field.",
      "Review parsed fields and schedule description.",
      "Inspect upcoming execution times to verify behavior.",
    ],
    about:
      "Cron Parser helps developers validate and explain cron schedules, reducing mistakes when configuring jobs and automations.",
    useCases: [
      "Verifying production job schedules",
      "Explaining cron syntax to teammates",
      "Checking next run times before deployment",
    ],
    faqs: [
      {
        question: "Does this support both 5 and 6 field cron formats?",
        answer:
          "Yes. It supports common 5-field syntax and compatible 6-field variants.",
      },
      {
        question: "Can I preview future run dates?",
        answer:
          "Yes. The tool lists upcoming executions so you can verify timing.",
      },
      {
        question: "Do cron implementations differ?",
        answer:
          "They can. Always confirm behavior against your exact scheduler runtime.",
      },
    ],
  },
};

export default manifest;
