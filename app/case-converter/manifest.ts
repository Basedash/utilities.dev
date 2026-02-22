import { CaseSensitive } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "case-converter",
  slug: "case-converter",
  title: "Case Converter",
  description:
    "Convert text between camelCase, PascalCase, snake_case, kebab-case, and UPPER_SNAKE_CASE with readable word splitting.",
  category: "data-formatting",
  tags: ["case", "camel", "snake", "kebab", "pascal", "naming"],
  icon: CaseSensitive,
  seo: {
    title: "Case Converter | utilities.dev",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and more in your browser. Preserves word boundaries from spaces, underscores, and mixed case.",
  },
  content: {
    intro: "Convert identifiers and labels between common naming conventions in one click.",
    trustNote:
      "Processing runs locally in your browser; ambiguous input may tokenize differently than expected.",
    howToSteps: [
      "Paste or type text into the input (spaces, underscores, hyphens, or mixed case).",
      "Select the target case format or use quick actions to convert.",
      "Copy the result or clear to start over.",
    ],
    about:
      "This tool helps you switch between naming styles when refactoring code, defining API fields, or normalizing identifiers. Ambiguous inputs like consecutive capitals may split in ways that require manual adjustment.",
    useCases: [
      "Converting API field names between JSON (camelCase) and database (snake_case)",
      "Refactoring variable names across different language conventions",
      "Normalizing slugs and identifiers for URLs or config keys",
    ],
    faqs: [
      {
        question: "What case formats does this tool support?",
        answer:
          "It supports camelCase, PascalCase, snake_case, kebab-case, and UPPER_SNAKE_CASE. Input can use spaces, underscores, hyphens, or mixed case; the tool splits words and reformats accordingly.",
      },
      {
        question: "Does this tool send my text to a server?",
        answer:
          "No, all conversion runs in your browser. Your input never leaves your device.",
      },
      {
        question: "Why does my acronym or mixed input split unexpectedly?",
        answer:
          "Tokenization uses heuristics for camelCase and acronym boundaries. Ambiguous sequences like HTTPAPI or XMLParser may split differently than you expect; adjust the input or result manually when needed.",
      },
      {
        question: "How do I convert from UPPER_SNAKE to camelCase?",
        answer:
          "Paste the UPPER_SNAKE text, then click camelCase or use the quick action. The tool treats underscores as word separators and reformats to the selected case.",
      },
    ],
  },
};

export default manifest;
