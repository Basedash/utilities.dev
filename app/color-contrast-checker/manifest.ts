import { Contrast } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "color-contrast-checker",
  slug: "color-contrast-checker",
  title: "Color Contrast Checker",
  description:
    "Check text and background color contrast with WCAG AA and AAA pass/fail for normal and large text.",
  category: "color-design",
  tags: ["color", "contrast", "wcag", "accessibility", "aa", "aaa", "design"],
  icon: Contrast,
  seo: {
    title: "Color Contrast Checker | utilities.dev",
    description:
      "Check text and background color contrast against WCAG AA and AAA. Instant pass/fail for normal and large text, computed locally in your browser.",
  },
  content: {
    intro:
      "Verify that text and background color combinations meet WCAG contrast requirements for accessibility.",
    trustNote:
      "Contrast is computed locally in your browser; results follow WCAG 2.1 formulas but do not guarantee full accessibility compliance.",
    howToSteps: [
      "Enter text and background colors in HEX format.",
      "Review the contrast ratio and WCAG AA/AAA pass/fail for normal and large text.",
      "Copy values or adjust colors until your combination meets the required level.",
    ],
    about:
      "This tool helps designers and developers ensure text is readable against its background by WCAG 2.1 standards. It applies to UI design, design systems, and accessibility audits where contrast ratios matter.",
    useCases: [
      "Validating brand color combinations for body and heading text",
      "Checking contrast before shipping UI components or design tokens",
      "Auditing existing interfaces for WCAG AA or AAA compliance",
    ],
    faqs: [
      {
        question: "What does this color contrast checker do?",
        answer:
          "It computes the contrast ratio between a text color and a background color using the WCAG 2.1 formula, then reports pass or fail for WCAG AA and AAA at normal and large text sizes.",
      },
      {
        question: "Does this tool send my colors to a server?",
        answer:
          "No, all contrast calculations run in your browser. Colors are never sent to a server or stored.",
      },
      {
        question: "What color formats are supported?",
        answer:
          "The checker accepts HEX colors only, including shorthand forms like #fff. Use a color converter first if you have RGB or HSL values.",
      },
      {
        question: "Why does my ratio show pass for large text but fail for normal?",
        answer:
          "WCAG allows a lower ratio for large text (18pt+ or 14pt+ bold). If your ratio is between 3:1 and 4.5:1, it passes AA for large text but fails for normal body text.",
      },
    ],
  },
};

export default manifest;
