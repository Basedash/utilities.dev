import { Table } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "table-a11y-checker",
  slug: "table-a11y-checker",
  title: "Table Accessibility Checker",
  description:
    "Check caption presence, th usage, and scope/header associations in pasted HTML tables.",
  category: "accessibility",
  tags: ["table", "accessibility", "a11y", "caption", "th", "scope", "wcag"],
  icon: Table,
  seo: {
    title: "Table Accessibility Checker | utilities.dev",
    description:
      "Audit pasted HTML tables for caption, th, scope, and headers. Runs locally in your browser.",
  },
  content: {
    intro:
      "Find tables missing captions, header cells, or proper scope and header associations.",
    trustNote:
      "Analysis runs in your browser; no HTML is sent to a server. Results are heuristic and do not replace full accessibility testing.",
    howToSteps: [
      "Paste your HTML snippet containing tables into the input area.",
      "Review findings for missing captions, th usage, and scope/header associations.",
      "Update table markup and re-run to verify.",
    ],
    about:
      "This tool helps developers catch common table accessibility issues before they reach production. It uses static analysis and cannot evaluate table structure from visual layout or complex multi-level headers.",
    useCases: [
      "Auditing data tables in design systems or component libraries",
      "Quick checks on HTML snippets before code review",
      "Identifying tables that need caption or scope attributes for WCAG compliance",
    ],
    faqs: [
      {
        question: "What does the table accessibility checker detect?",
        answer:
          "It checks for missing captions, tables without th cells, th cells without scope attributes, and data cells without headers attributes. These patterns help screen readers associate data with headers.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No, all analysis runs locally in your browser. Your HTML is never transmitted to any server.",
      },
      {
        question: "When is the headers attribute needed on td?",
        answer:
          "For simple tables with one row or column of headers, scope on th is usually enough. For complex tables with multiple header levels, use headers on td to reference th ids for accurate association.",
      },
      {
        question: "Why does it warn about td without headers?",
        answer:
          "The checker suggests adding headers to td when a table has both th and td cells. For simple layouts this may be optional; for complex tables it improves screen reader navigation.",
      },
    ],
  },
};

export default manifest;
