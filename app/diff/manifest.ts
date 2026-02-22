import { GitCompare } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "diff",
  slug: "diff",
  title: "Text Diff Tool",
  description:
    "Compare two text blocks and highlight differences line by line. Perfect for code reviews and document comparisons.",
  category: "Development",
  tags: ["diff", "compare", "text", "changes", "review", "git", "patch"],
  icon: GitCompare,
  seo: {
    title: "Text Diff Tool | utilities.dev",
    description:
      "Free online text diff tool to compare two text blocks and highlight differences. Perfect for code reviews, document comparisons, and spotting changes.",
  },
  content: {
    intro: "Compare two text blocks and highlight line-by-line changes.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste the original text in the first panel.",
      "Paste the updated text in the second panel.",
      "Review additions, removals, and copied diff output.",
    ],
    about:
      "Text Diff Tool compares two versions of content and clearly marks changes. It helps with reviews, debugging, and checking edits before publishing.",
    useCases: [
      "Reviewing config file changes",
      "Comparing code snippets quickly",
      "Auditing document revisions",
    ],
    faqs: [
      {
        question: "Can I ignore whitespace and case differences?",
        answer:
          "Yes. You can toggle comparison options to ignore whitespace and case.",
      },
      {
        question: "Does this support copying unified diff output?",
        answer:
          "Yes. Use the copy action in the stats section to export diff text.",
      },
      {
        question: "Is this suitable for large files?",
        answer:
          "It works well for common text sizes. Very large inputs may be limited by browser performance.",
      },
    ],
  },
};

export default manifest;
