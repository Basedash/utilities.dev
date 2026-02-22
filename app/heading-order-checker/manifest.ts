import { Heading1 } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "heading-order-checker",
  slug: "heading-order-checker",
  title: "Heading Order Checker",
  description:
    "Detect heading level jumps, multiple h1, and missing h1 in pasted HTML for accessibility audits.",
  category: "accessibility",
  tags: ["heading", "h1", "accessibility", "a11y", "wcag", "structure"],
  icon: Heading1,
  seo: {
    title: "Heading Order Checker | utilities.dev",
    description:
      "Check heading structure in HTML snippets. Detects level jumps, multiple h1, and missing h1. Runs locally in your browser.",
  },
  content: {
    intro:
      "Analyze heading structure in pasted HTML to find accessibility issues: level jumps, multiple h1, or missing h1.",
    trustNote:
      "Analysis runs locally in your browser. HTML is parsed in-memory and never sent to a server. Results are structural only and do not guarantee full WCAG compliance.",
    howToSteps: [
      "Paste an HTML snippet or full document into the input area.",
      "Review the extracted headings and any findings.",
      "Use the findings to fix heading structure in your source.",
    ],
    about:
      "This tool helps developers audit heading hierarchy for screen readers and document outline. It flags common issues like skipping levels (h2 to h4) or multiple h1. It works on static HTML snippets and does not execute scripts or fetch external content.",
    useCases: [
      "Auditing component markup before accessibility review",
      "Checking heading structure in CMS or static site output",
      "Quick validation of document outline during development",
    ],
    faqs: [
      {
        question: "What does the heading order checker detect?",
        answer:
          "It detects missing h1, multiple h1 headings, and heading level jumps (e.g. h2 followed by h4). These issues can confuse screen reader users and break the document outline.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No. All parsing and analysis runs in your browser. Your HTML never leaves your device.",
      },
      {
        question: "Can it parse React or Vue component output?",
        answer:
          "It parses static HTML only. Paste the rendered HTML output, not JSX or template syntax. Dynamic content must be captured after render.",
      },
      {
        question: "Why does a level jump matter?",
        answer:
          "Screen readers use headings to navigate. Skipping levels (h2 to h4) can make the outline confusing. Use sequential levels (h2, h3, h4) for nested sections.",
      },
    ],
  },
};

export default manifest;
