import { Layout } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "landmark-role-checker",
  slug: "landmark-role-checker",
  title: "Landmark Role Checker",
  description:
    "Detect presence and duplicates of common landmarks (header, nav, main, footer, aside) and ARIA landmark roles.",
  category: "accessibility",
  tags: ["landmark", "aria", "accessibility", "a11y", "semantic", "structure"],
  icon: Layout,
  seo: {
    title: "Landmark Role Checker | utilities.dev",
    description:
      "Check landmark structure in HTML. Detects header, nav, main, footer, aside and ARIA roles. Runs locally in your browser.",
  },
  content: {
    intro:
      "Analyze pasted HTML for landmark structure: semantic elements and ARIA landmark roles, including presence and duplicates.",
    trustNote:
      "Analysis runs locally in your browser. HTML is parsed in-memory and never sent to a server. Results are structural only and do not guarantee full WCAG compliance.",
    howToSteps: [
      "Paste an HTML snippet or full document into the input area.",
      "Review the landmark table for presence and duplicate counts.",
      "Use the findings to adjust structure (e.g. avoid duplicate main).",
    ],
    about:
      "This tool helps developers audit page structure for screen readers and keyboard navigation. It checks semantic elements (header, nav, main, footer, aside) and ARIA landmark roles (banner, navigation, main, contentinfo, complementary, region, search, form). Duplicate landmarks can confuse assistive technology users.",
    useCases: [
      "Auditing component markup for landmark structure before release",
      "Checking for duplicate main or navigation landmarks",
      "Validating ARIA role usage in dynamic or framework-rendered HTML",
    ],
    faqs: [
      {
        question: "What landmarks does this checker detect?",
        answer:
          "It detects semantic elements (header, nav, main, footer, aside) and ARIA landmark roles (banner, navigation, main, contentinfo, complementary, region, search, form). It reports presence and flags duplicates.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No. All parsing and analysis runs in your browser. Your HTML never leaves your device.",
      },
      {
        question: "Are duplicate landmarks always wrong?",
        answer:
          "Multiple nav or complementary regions can be valid (e.g. main nav and footer nav). The checker flags them for review. Duplicate main or banner is usually an error and should be fixed.",
      },
      {
        question: "Why does it check both elements and ARIA roles?",
        answer:
          "Landmarks can be provided by semantic HTML (e.g. <main>) or by ARIA (role='main'). The checker reports both so you can see what assistive technology will expose.",
      },
    ],
  },
};

export default manifest;
