import { Timer } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "unix-timestamp",
  slug: "unix-timestamp",
  title: "Unix Timestamp Converter",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Support for seconds and milliseconds.",
  category: "Development",
  tags: ["unix", "timestamp", "epoch", "date", "time", "converter", "posix"],
  icon: Timer,
  seo: {
    title: "Unix Timestamp Converter | utilities.dev",
    description:
      "Free online tool to convert Unix timestamps to human-readable dates and vice versa. Support for milliseconds and various date formats.",
  },
  content: {
    intro: "Convert Unix timestamps to dates and back in seconds or milliseconds.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Choose whether values are seconds or milliseconds.",
      "Enter a timestamp or date value.",
      "Copy the converted result for logs, APIs, or databases.",
    ],
    about:
      "Unix Timestamp Converter helps you move between epoch-based values and readable dates quickly when debugging systems, APIs, and logs.",
    useCases: [
      "Debugging backend and database timestamps",
      "Converting API response times",
      "Validating date handling in application code",
    ],
    faqs: [
      {
        question: "What is the Unix epoch?",
        answer:
          "The Unix epoch starts at 1970-01-01 00:00:00 UTC and timestamps count from that point.",
      },
      {
        question: "How do I know if a value is seconds or milliseconds?",
        answer:
          "Millisecond timestamps are usually 13 digits, while seconds are typically 10 digits.",
      },
      {
        question: "Are conversions timezone aware?",
        answer:
          "Yes. Display output is human-readable and based on standard date parsing/rendering behavior.",
      },
    ],
  },
};

export default manifest;
