import { TestTube } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "regex-tester",
  slug: "regex-tester",
  title: "Regex Tester",
  description:
    "Test regular expressions with live match results, capture groups, and flag-aware debugging output.",
  category: "Testing",
  tags: [
    "regex",
    "regular expression",
    "pattern",
    "match",
    "test",
    "validation",
  ],
  icon: TestTube,
  seo: {
    title: "Regex Tester & Validator | utilities.dev",
    description:
      "Debug regex patterns with real-time matching, capture group inspection, and flag controls in your browser.",
  },
  content: {
    intro: "Validate regex behavior quickly with live highlights and match details.",
    trustNote:
      "Regex evaluation runs in your browser; final behavior can vary across languages and regex engines.",
    howToSteps: [
      "Enter your regex pattern and select any flags.",
      "Paste representative sample text to test against.",
      "Review matches and capture groups, then refine the pattern.",
    ],
    about:
      "This utility helps you iterate on regular expressions with immediate feedback, reducing trial-and-error in application code. It is ideal for validating parsing rules before they are shipped to production systems.",
    useCases: [
      "Validating form field patterns before implementation",
      "Extracting structured values from logs and text blobs",
      "Debugging mismatched patterns in backend or frontend code",
    ],
    faqs: [
      {
        question: "How does a regex tester help during development?",
        answer:
          "A regex tester lets you validate pattern behavior against real sample inputs before you ship code. This reduces false matches and missed captures in production.",
      },
      {
        question: "Can I test regex flags and capture groups?",
        answer:
          "Yes, you can apply common flags and inspect each capture group in the match results. That visibility makes it easier to confirm exactly what each subpattern extracts.",
      },
      {
        question: "Why can a regex work here but fail in another language?",
        answer:
          "Regex engines differ by runtime, so syntax support and matching behavior are not always identical. Always test final patterns in the exact language and framework you deploy.",
      },
      {
        question: "How can I reduce false matches in regex patterns?",
        answer:
          "Use anchors, tighter character classes, and realistic sample text to constrain matching. Iterative testing with highlighted output helps you catch overbroad patterns quickly.",
      },
    ],
  },
};

export default manifest;
