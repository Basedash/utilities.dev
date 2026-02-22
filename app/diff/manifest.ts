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
};

export default manifest;
