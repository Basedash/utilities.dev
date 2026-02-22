import { TestTube } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "regex-tester",
  slug: "regex-tester",
  title: "Regex Tester",
  description:
    "Test regular expressions with real-time matching, capture groups, and detailed results.",
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
      "Free online regular expression tester and debugger. Test regex patterns, view matches, capture groups, and validate regular expressions with real-time feedback.",
  },
  content: {
    intro: "Test regex patterns with real-time matching and group details.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Enter your regex pattern and flags.",
      "Paste sample text to test against.",
      "Review matches, groups, and highlighted results.",
    ],
    about:
      "Regex Tester helps you iterate quickly on regular expressions and understand exactly what your pattern matches before using it in production code.",
    useCases: [
      "Validating form input patterns",
      "Extracting values from logs or text files",
      "Debugging failing regex in app code",
    ],
    faqs: [
      {
        question: "Does this support regex flags?",
        answer:
          "Yes. You can test common flags such as global, case-insensitive, and multiline.",
      },
      {
        question: "Can I inspect capture groups?",
        answer:
          "Yes. The tool shows capture groups so you can verify extraction logic.",
      },
      {
        question: "Is regex behavior identical across all languages?",
        answer:
          "Not always. Syntax and behavior vary by runtime, so verify in your target environment.",
      },
    ],
  },
};

export default manifest;
