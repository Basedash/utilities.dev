import { Focus } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "focus-style-checker",
  slug: "focus-style-checker",
  title: "Focus Style Checker",
  description:
    "Inspect CSS for :focus/:focus-visible declarations and flag patterns that remove outlines without visible replacement.",
  category: "accessibility",
  tags: ["focus", "css", "accessibility", "a11y", "outline", "keyboard"],
  icon: Focus,
  seo: {
    title: "Focus Style Checker | utilities.dev",
    description:
      "Check CSS for focus styles that remove outlines without replacement. Catches patterns that harm keyboard accessibility. Runs locally in your browser.",
  },
  content: {
    intro:
      "Inspect CSS for :focus and :focus-visible declarations and flag patterns that remove outlines without a visible replacement.",
    trustNote:
      "All CSS analysis runs in your browser; no stylesheets are sent to a server or stored.",
    howToSteps: [
      "Paste your CSS into the input area.",
      "Review the checker output for outline removal without visible replacement.",
      "Add border, box-shadow, or another visible focus indicator where flagged.",
    ],
    about:
      "This tool helps developers avoid removing focus outlines without providing an alternative, which harms keyboard users. It uses heuristics and does not replace testing with actual keyboard navigation.",
    useCases: [
      "Auditing CSS for outline: none or outline-width: 0 in focus rules",
      "Ensuring :focus-visible has a visible indicator before shipping",
      "Catching global outline removal that affects all focusable elements",
    ],
    faqs: [
      {
        question: "What does this focus style checker do?",
        answer:
          "It scans CSS for :focus and :focus-visible rules and flags cases where outline is removed (outline: none, outline: 0) without a visible replacement like border or box-shadow.",
      },
      {
        question: "Does this tool send my CSS to a server?",
        answer:
          "No, all analysis runs locally in your browser. Your CSS is never sent to a server or stored.",
      },
      {
        question: "What counts as a visible focus replacement?",
        answer:
          "The checker treats border, box-shadow, background, or a non-zero outline as visible replacements. It uses simple pattern matching and may miss custom indicators.",
      },
      {
        question: "Why does outline: none need a replacement?",
        answer:
          "Keyboard users rely on the focus outline to see which element is focused. Removing it without an alternative makes navigation difficult or impossible for some users.",
      },
    ],
  },
};

export default manifest;
