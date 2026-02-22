import { FormInput } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "form-label-checker",
  slug: "form-label-checker",
  title: "Form Label Checker",
  description:
    "Detect form controls missing associated labels, duplicate IDs, and unlabeled buttons in pasted HTML.",
  category: "accessibility",
  tags: ["form", "label", "accessibility", "a11y", "input", "wcag"],
  icon: FormInput,
  seo: {
    title: "Form Label Checker | utilities.dev",
    description:
      "Audit pasted HTML for form label issues: missing labels, duplicate IDs, unlabeled buttons. Runs locally in your browser.",
  },
  content: {
    intro:
      "Find form controls without proper labels, duplicate IDs, and buttons without accessible names in HTML snippets.",
    trustNote:
      "Analysis runs in your browser; no HTML is sent to a server. Results are heuristic and do not replace full accessibility testing.",
    howToSteps: [
      "Paste your HTML snippet containing forms into the input area.",
      "Review the findings for missing labels, duplicate IDs, and unlabeled buttons.",
      "Fix issues in your markup and re-run to verify.",
    ],
    about:
      "This tool helps developers catch common form accessibility problems before they reach production. It uses static analysis of HTML structure and cannot detect dynamically injected labels or ARIA added by JavaScript.",
    useCases: [
      "Auditing form markup in design systems or component libraries",
      "Quick checks on HTML snippets before code review",
      "Identifying duplicate IDs that break label associations",
    ],
    faqs: [
      {
        question: "What does the form label checker detect?",
        answer:
          "It finds form controls (input, select, textarea) without associated labels, duplicate id attributes, and buttons with no visible text or aria-label. It recognizes label-for, aria-label, and aria-labelledby as valid associations.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No, all analysis runs locally in your browser. Your HTML is never transmitted to any server.",
      },
      {
        question: "Why might it report a control as unlabeled when I have a label?",
        answer:
          "The checker matches labels by the for attribute and the control's id. If the for and id do not match exactly, or the label is nested differently, the association may not be detected. Ensure for and id values are identical.",
      },
      {
        question: "Does it check checkbox and radio inputs?",
        answer:
          "Yes. Checkbox and radio inputs are labelable controls. The checker expects them to have an associated label, aria-label, or aria-labelledby.",
      },
    ],
  },
};

export default manifest;
