import { Link2 } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "skip-link-checker",
  slug: "skip-link-checker",
  title: "Skip Link Checker",
  description:
    "Inspect HTML for skip link patterns (href=\"#main\" etc.) and verify target presence.",
  category: "accessibility",
  tags: ["skip link", "accessibility", "a11y", "html", "keyboard", "wcag"],
  icon: Link2,
  seo: {
    title: "Skip Link Checker | utilities.dev",
    description:
      "Check HTML for skip links and their targets. Verifies href=\"#main\"-style links have matching id elements. Runs locally in your browser.",
  },
  content: {
    intro:
      "Inspect HTML for skip link patterns and verify that each skip link target exists in the document.",
    trustNote:
      "All HTML analysis runs in your browser; no content is sent to a server or stored.",
    howToSteps: [
      "Paste your HTML into the input area.",
      "Review detected skip links and their targets.",
      "Fix any orphaned skip links that point to missing id targets.",
    ],
    about:
      "This tool helps developers ensure skip links work correctly by verifying that href=\"#id\" targets exist. Skip links let keyboard users jump past repetitive navigation to main content.",
    useCases: [
      "Verifying skip-to-main and skip-to-nav links have matching targets",
      "Auditing HTML before deploy for broken in-page anchors",
      "Checking that new skip links point to existing id attributes",
    ],
    faqs: [
      {
        question: "What is a skip link?",
        answer:
          "A skip link is an in-page anchor (e.g. href=\"#main\") that lets keyboard users jump past repeated navigation to the main content. It improves accessibility for screen reader and keyboard users.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No, all analysis runs locally in your browser. Your HTML is never sent to a server or stored.",
      },
      {
        question: "What does orphaned skip link mean?",
        answer:
          "An orphaned skip link points to an id (e.g. #main) that does not exist in the HTML. The target element with that id is missing, so the skip link will not work.",
      },
      {
        question: "Can I check partial HTML snippets?",
        answer:
          "Yes, paste any HTML snippet. The checker will report skip links and targets found in that snippet. For full pages, paste the entire document to verify all targets exist.",
      },
    ],
  },
};

export default manifest;
