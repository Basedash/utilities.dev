import { ScanSearch } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "aria-attributes-validator",
  slug: "aria-attributes-validator",
  title: "ARIA Attributes Validator",
  description:
    "Validate HTML snippets for ARIA misuse: invalid attributes, malformed ID references, and role-label mismatches.",
  category: "accessibility",
  tags: ["aria", "accessibility", "a11y", "html", "validation", "wcag"],
  icon: ScanSearch,
  seo: {
    title: "ARIA Attributes Validator | utilities.dev",
    description:
      "Check HTML for invalid ARIA attributes, malformed aria-labelledby/aria-describedby references, and role-label mismatches. Runs locally in your browser.",
  },
  content: {
    intro:
      "Inspect HTML snippets for common ARIA misuse: invalid aria-* names, malformed ID references, and role+aria mismatches.",
    trustNote:
      "Validation runs entirely in your browser; no HTML is sent to a server or stored.",
    howToSteps: [
      "Paste your HTML snippet into the input area.",
      "Review the validation results for invalid attributes, malformed references, and role-label issues.",
      "Fix reported issues and re-run validation until the snippet passes.",
    ],
    about:
      "This tool helps developers catch ARIA mistakes before they reach production, reducing accessibility barriers for screen reader users. It uses heuristics and does not replace full accessibility testing with assistive technologies.",
    useCases: [
      "Auditing component markup for invalid or misspelled ARIA attributes",
      "Checking aria-labelledby and aria-describedby reference syntax before deploy",
      "Catching role elements that lack required accessible names",
    ],
    faqs: [
      {
        question: "What does this ARIA validator check for?",
        answer:
          "It checks for invalid aria-* attribute names, malformed ID references in aria-labelledby and aria-describedby, and roles that typically require aria-label or aria-labelledby but lack them.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No, all validation runs locally in your browser. Your HTML is never sent to a server or stored.",
      },
      {
        question: "What ARIA attributes are considered valid?",
        answer:
          "The validator uses the WAI-ARIA 1.2 attribute list. Custom or non-standard aria-* attributes will be flagged as invalid.",
      },
      {
        question: "Why does role=button without a label get flagged?",
        answer:
          "Interactive roles like button require an accessible name so screen readers can announce the control. Use aria-label or aria-labelledby to provide one.",
      },
    ],
  },
};

export default manifest;
