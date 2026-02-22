import { Eye } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "markdown-viewer",
  slug: "markdown-viewer",
  title: "Markdown Viewer",
  description:
    "Preview, format, and analyze Markdown files with real-time HTML output. Extract metadata, calculate reading time, and validate syntax.",
  category: "Formatting",
  tags: [
    "markdown",
    "md",
    "preview",
    "html",
    "viewer",
    "format",
    "analyze",
    "documentation",
    "readme",
  ],
  icon: Eye,
  seo: {
    title:
      "Markdown Viewer - Preview, Format, and Analyze Markdown Files | utilities.dev",
    description:
      "View, format, and analyze Markdown files with real-time HTML preview. Validate Markdown syntax, extract metadata, and count words, characters, and reading time. Free online Markdown viewer and editor tool.",
    keywords: [
      "markdown viewer",
      "markdown editor",
      "markdown formatter",
      "markdown preview",
      "markdown parser",
      "markdown to HTML",
      "md viewer",
      "markdown analyzer",
      "markdown validator",
      "markdown statistics",
    ],
  },
};

export default manifest;
