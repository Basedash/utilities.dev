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
  content: {
    intro: "Render and analyze Markdown with live preview and document stats.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste Markdown content or upload a file.",
      "Review rendered preview and syntax-highlighted code blocks.",
      "Format content and copy or download the updated Markdown.",
    ],
    about:
      "Markdown Viewer is designed for editing and validating markdown documents with immediate preview, metadata extraction, and readability metrics.",
    useCases: [
      "Previewing README files before commits",
      "Formatting documentation quickly",
      "Checking document structure and reading time",
    ],
    faqs: [
      {
        question: "Does this support GitHub-flavored Markdown?",
        answer:
          "Yes. Common markdown constructs, including code blocks, are supported for preview.",
      },
      {
        question: "Can I extract front matter metadata?",
        answer:
          "Yes. YAML front matter fields are parsed and displayed in the metadata section.",
      },
      {
        question: "Will this convert Markdown to final production HTML?",
        answer:
          "It provides preview rendering for authoring, but production pipelines may apply additional processing.",
      },
    ],
  },
};

export default manifest;
