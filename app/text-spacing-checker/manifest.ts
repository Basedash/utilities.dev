import { Type } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "text-spacing-checker",
  slug: "text-spacing-checker",
  title: "Text Spacing Checker",
  description:
    "Evaluate CSS declarations against WCAG 1.4.12 text spacing minimums for line height, paragraph, letter, and word spacing.",
  category: "accessibility",
  tags: ["text-spacing", "wcag", "accessibility", "css", "line-height"],
  icon: Type,
  seo: {
    title: "Text Spacing Checker | utilities.dev",
    description:
      "Check CSS line-height, letter-spacing, and word-spacing against WCAG 1.4.12 minimums. Pass/fail guidance for accessibility. Runs locally in your browser.",
  },
  content: {
    intro:
      "Evaluate CSS declarations against WCAG 1.4.12 text spacing minimums for line height, paragraph spacing, letter spacing, and word spacing.",
    trustNote:
      "Analysis runs locally in your browser. Results compare parsed values to WCAG 1.4.12 minimums; they do not guarantee full accessibility compliance.",
    howToSteps: [
      "Enter or paste CSS declarations (font-size, line-height, etc.).",
      "Review pass/fail for each spacing property against WCAG minimums.",
      "Copy compliant values or adjust until all pass.",
    ],
    about:
      "This tool helps developers verify that text spacing meets WCAG 1.4.12 (Level AA): line-height ≥1.5×, paragraph spacing ≥2×, letter-spacing ≥0.12×, word-spacing ≥0.16× font size. It parses common CSS units and reports guidance.",
    useCases: [
      "Verifying typography meets WCAG text spacing before release",
      "Auditing design tokens or CSS variables for accessibility",
      "Checking existing stylesheets for spacing compliance",
    ],
    faqs: [
      {
        question: "What does this text spacing checker evaluate?",
        answer:
          "It parses font-size, line-height, letter-spacing, and word-spacing from CSS and checks them against WCAG 1.4.12 minimums: line-height ≥1.5×, letter-spacing ≥0.12×, word-spacing ≥0.16× font size.",
      },
      {
        question: "Does this tool send my CSS to a server?",
        answer:
          "No. All parsing and comparison runs locally in your browser. Your CSS is never sent to a server or stored.",
      },
      {
        question: "What CSS units are supported?",
        answer:
          "The checker supports px, em, rem, and unitless values. It normalizes to a base font size (16px) when needed. Complex calc() or var() may not parse correctly.",
      },
      {
        question: "Why does my line-height show fail?",
        answer:
          "WCAG 1.4.12 requires line-height of at least 1.5 times font size. A unitless 1.5 or 24px for 16px font passes; 1.2 or 18px fails.",
      },
    ],
  },
};

export default manifest;
