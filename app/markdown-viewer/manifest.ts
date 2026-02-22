import { Eye } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "markdown-viewer",
  slug: "markdown-viewer",
  title: "Markdown Viewer",
  description:
    "Preview and analyze Markdown with live rendering, formatting tools, and document statistics.",
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
    title: "Markdown Viewer and Formatter | utilities.dev",
    description:
      "Preview Markdown in real time, format source text, and inspect document metrics in your browser for faster documentation workflows.",
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
    intro: "Render Markdown live and refine docs before publishing or committing.",
    trustNote:
      "Markdown rendering and formatting run in your browser; final site output may still differ based on production plugins.",
    howToSteps: [
      "Paste Markdown text or load a Markdown file.",
      "Review the live preview and document statistics.",
      "Format the source and copy or download the updated output.",
    ],
    about:
      "This utility helps you author and review Markdown with immediate visual feedback and structure checks. It is useful for README editing, docs cleanup, and validating content before publishing.",
    useCases: [
      "Previewing README updates before pull requests",
      "Formatting technical docs for consistent structure",
      "Checking word count and reading time for knowledge base content",
    ],
    faqs: [
      {
        question: "Does this Markdown viewer support common GitHub-style syntax?",
        answer:
          "It supports widely used Markdown syntax such as headings, lists, links, and fenced code blocks. Rendering can still differ from a specific platform's custom extensions.",
      },
      {
        question: "Will preview output always match production rendering?",
        answer:
          "Not always, because production pipelines may apply custom plugins, transforms, or sanitization rules. Treat preview as an authoring reference, then verify in your deployment environment.",
      },
      {
        question: "Can I inspect YAML front matter in Markdown files?",
        answer:
          "Yes, the tool can extract front matter so you can review metadata fields alongside content. This is useful when validating docs used by static site generators.",
      },
      {
        question: "Is my Markdown content processed locally?",
        answer:
          "Yes, Markdown processing is handled in your browser session for fast local feedback. Follow internal policy before pasting sensitive internal documentation.",
      },
    ],
  },
};

export default manifest;
