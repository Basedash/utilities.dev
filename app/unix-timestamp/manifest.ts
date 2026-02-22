import { Timer } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "unix-timestamp",
  slug: "unix-timestamp",
  title: "Unix Timestamp Converter",
  description:
    "Convert Unix timestamps and human-readable dates with support for seconds and milliseconds.",
  category: "time-scheduling",
  tags: ["unix", "timestamp", "epoch", "date", "time", "converter", "posix"],
  icon: Timer,
  seo: {
    title: "Unix Timestamp Converter | utilities.dev",
    description:
      "Convert epoch values to readable dates and back, with quick seconds vs milliseconds checks for logs, APIs, and databases.",
  },
  content: {
    intro: "Translate Unix epoch values into readable dates and reverse conversions quickly.",
    trustNote:
      "Conversions run locally in your browser; displayed date strings depend on selected timezone context.",
    howToSteps: [
      "Choose timestamp mode: seconds or milliseconds.",
      "Enter a Unix timestamp or a readable date value.",
      "Copy converted output for logs, APIs, or database checks.",
    ],
    about:
      "This utility helps you move between epoch timestamps and readable date formats without manual calculations. It is useful for debugging logs, inspecting API payloads, and validating date handling in backend systems.",
    useCases: [
      "Inspecting event times in backend logs",
      "Converting API timestamps during integration testing",
      "Verifying seconds vs milliseconds storage formats",
    ],
    faqs: [
      {
        question: "What is a Unix timestamp?",
        answer:
          "A Unix timestamp is the elapsed time since 1970-01-01 00:00:00 UTC, typically represented in seconds or milliseconds. It is commonly used in logs, APIs, and databases.",
      },
      {
        question: "How can I tell whether a timestamp is in seconds or milliseconds?",
        answer:
          "A quick check is length: modern seconds timestamps are usually 10 digits, while milliseconds are usually 13 digits. Converting both forms is a reliable way to confirm ambiguous values.",
      },
      {
        question: "Do Unix timestamp conversions depend on timezone?",
        answer:
          "The numeric timestamp itself is timezone-neutral. Only the rendered date string changes based on whether you view it in UTC or local time.",
      },
      {
        question: "When should I use milliseconds instead of seconds?",
        answer:
          "Use milliseconds when your system needs sub-second precision for events or analytics. Seconds are often sufficient for coarse scheduling and simpler storage.",
      },
    ],
  },
};

export default manifest;
