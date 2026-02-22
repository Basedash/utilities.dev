import { Link } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "link-text-auditor",
  slug: "link-text-auditor",
  title: "Link Text Auditor",
  description:
    "Flag generic link text, empty links, and duplicate link names pointing to different URLs in pasted HTML.",
  category: "accessibility",
  tags: ["link", "accessibility", "a11y", "anchor", "wcag"],
  icon: Link,
  seo: {
    title: "Link Text Auditor | utilities.dev",
    description:
      "Audit pasted HTML for link accessibility: generic text, empty links, duplicate names. Runs locally in your browser.",
  },
  content: {
    intro:
      "Find links with generic text, missing content, or duplicate names that point to different destinations.",
    trustNote:
      "Analysis runs in your browser; no HTML is sent to a server. Results are heuristic and do not replace full accessibility testing.",
    howToSteps: [
      "Paste your HTML snippet containing links into the input area.",
      "Review findings for generic text, empty links, and duplicate names.",
      "Update link text to be descriptive and unique where needed.",
    ],
    about:
      "This tool helps developers improve link accessibility by catching common issues that confuse screen reader users. It uses static analysis and cannot evaluate link purpose from surrounding context.",
    useCases: [
      "Auditing navigation and content links in component libraries",
      "Quick checks on HTML snippets before code review",
      "Identifying links that need more descriptive text for WCAG compliance",
    ],
    faqs: [
      {
        question: "What does the link text auditor flag?",
        answer:
          "It flags links with empty or generic text (e.g. click here, read more), and links that share the same visible text but point to different URLs. These patterns make navigation difficult for screen reader users.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No, all analysis runs locally in your browser. Your HTML is never transmitted to any server.",
      },
      {
        question: "Why is 'read more' considered generic?",
        answer:
          "When multiple links say 'read more' on a page, screen reader users cannot distinguish them without additional context. WCAG recommends link text that describes the destination or purpose.",
      },
      {
        question: "How do I fix duplicate link names?",
        answer:
          "Make each link's text unique and descriptive, or add visually hidden context (e.g. aria-label or sr-only text) so screen readers announce the destination distinctly.",
      },
    ],
  },
};

export default manifest;
