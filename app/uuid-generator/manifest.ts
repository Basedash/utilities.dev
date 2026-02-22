import { Hash } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "uuid-generator",
  slug: "uuid-generator",
  title: "UUID Generator and Validator",
  description:
    "Generate UUID v4 identifiers and validate UUID strings locally in your browser.",
  category: "Encoding",
  tags: ["uuid", "guid", "generate", "validate", "identifier", "v4"],
  icon: Hash,
  seo: {
    title: "UUID Generator and Validator | utilities.dev",
    description:
      "Generate UUID v4 and validate UUID strings in your browser. Batch generation and copy support. All processing is local.",
  },
  content: {
    intro: "Generate and validate UUIDs instantly for IDs, keys, and unique references.",
    trustNote:
      "UUID generation and validation run locally in your browser. Output is not cryptographically secure for tokens or secrets.",
    howToSteps: [
      "Enter a UUID to validate or set batch count for generation.",
      "Click Generate for one or more UUIDs, or paste a string to validate.",
      "Copy results or clear the output for a fresh start.",
    ],
    about:
      "This tool helps you create and verify UUID v4 identifiers for database keys, API IDs, and distributed systems. It is useful when prototyping, testing, or validating UUID format without external services.",
    useCases: [
      "Generating unique IDs for database records or API resources",
      "Validating UUID format in config files or environment variables",
      "Batch-creating test fixtures or mock data with unique identifiers",
    ],
    faqs: [
      {
        question: "What is a UUID and when should I use one?",
        answer:
          "A UUID (Universally Unique Identifier) is a 128-bit value that is practically unique across systems. Use UUIDs when you need globally unique IDs without a central authority, such as for distributed databases or API resource identifiers.",
      },
      {
        question: "Does this tool send my UUIDs to a server?",
        answer:
          "No, generation and validation run entirely in your browser. Your input and generated UUIDs never leave your device.",
      },
      {
        question: "What UUID versions does this support?",
        answer:
          "The generator produces UUID v4 (random), and the validator checks UUID v4 format. Other UUID versions are intentionally treated as invalid in this tool.",
      },
      {
        question: "Why does validation fail for a UUID that looks correct?",
        answer:
          "Check for extra spaces, wrong segment lengths (8-4-4-4-12), or invalid characters. Only hex digits (0-9, a-f) and hyphens are allowed. The version digit in the third segment must be 4 for v4.",
      },
    ],
  },
};

export default manifest;
