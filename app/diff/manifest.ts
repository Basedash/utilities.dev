import { GitCompare } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "diff",
  slug: "diff",
  title: "Text Diff Tool",
  description:
    "Compare two text blocks line by line to spot additions, removals, and edits during reviews.",
  category: "dev-productivity",
  tags: ["diff", "compare", "text", "changes", "review", "git", "patch"],
  icon: GitCompare,
  seo: {
    title: "Text Diff Tool | utilities.dev",
    description:
      "Compare original and updated text side by side, highlight changed lines, and copy diff output for code reviews and document checks.",
  },
  content: {
    intro: "Find exact line-level changes between two versions of text.",
    trustNote:
      "Diff processing happens locally in your browser; very large inputs can be slower depending on device memory and CPU.",
    howToSteps: [
      "Paste the original text into the left input panel.",
      "Paste the updated text into the right input panel.",
      "Review highlighted differences and copy the output for sharing.",
    ],
    about:
      "This utility shows what changed between two text versions so you can review edits with less guesswork. It works well for code snippets, configuration files, and document revisions where precise differences matter.",
    useCases: [
      "Checking code changes before opening a pull request",
      "Comparing configuration updates between environments",
      "Auditing edits in policy or documentation text",
    ],
    faqs: [
      {
        question: "When should I use a text diff tool?",
        answer:
          "Use a text diff tool when you need to compare two versions and identify exactly what changed. It is especially helpful for code reviews, config checks, and document revisions.",
      },
      {
        question: "Can I ignore whitespace or letter case differences?",
        answer:
          "Yes, those options help reduce noise from formatting-only edits. Ignoring non-semantic changes makes functional differences easier to review.",
      },
      {
        question: "Can I copy diff output for pull requests or reviews?",
        answer:
          "Yes, you can copy generated diff output and paste it into reviews, issues, or team chat. This is useful when you need to discuss changes outside a full Git workflow.",
      },
      {
        question: "Will this tool handle very large files?",
        answer:
          "It handles typical code and document sizes well, but extremely large inputs may feel slower. Performance depends on browser resources because comparison runs client-side.",
      },
    ],
  },
};

export default manifest;
