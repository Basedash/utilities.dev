import { Image } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "image-alt-auditor",
  slug: "image-alt-auditor",
  title: "Image Alt Auditor",
  description:
    "Parse img tags from HTML and flag missing, empty, or suspicious alt text with summary counts.",
  category: "accessibility",
  tags: ["image", "alt", "accessibility", "a11y", "wcag", "audit"],
  icon: Image,
  seo: {
    title: "Image Alt Auditor | utilities.dev",
    description:
      "Audit image alt text in HTML snippets. Flags missing, empty, and suspicious alt attributes with summary counts. Runs locally in your browser.",
  },
  content: {
    intro:
      "Audit img tags in pasted HTML for alt text issues: missing, empty, or suspicious descriptions.",
    trustNote:
      "Analysis runs locally in your browser. HTML is parsed in-memory and never sent to a server. Results are heuristic and do not guarantee full WCAG compliance.",
    howToSteps: [
      "Paste an HTML snippet containing img tags into the input area.",
      "Review the list of images and their alt status with summary counts.",
      "Use the findings to fix or add alt text in your source.",
    ],
    about:
      "This tool helps developers audit image accessibility by flagging missing alt attributes, empty alt (which may be intentional for decorative images), and suspicious placeholder text like 'image' or 'photo'. It works on static HTML snippets and provides summary counts for quick scanning.",
    useCases: [
      "Auditing component markup for image accessibility before release",
      "Checking alt text coverage in CMS or static site output",
      "Finding placeholder or generic alt text during accessibility review",
    ],
    faqs: [
      {
        question: "What does the image alt auditor check?",
        answer:
          "It parses img tags from pasted HTML and flags missing alt attributes, empty alt, and suspicious placeholder text like 'image', 'photo', or 'placeholder'. It also provides summary counts for each category.",
      },
      {
        question: "Does this tool send my HTML to a server?",
        answer:
          "No. All parsing and analysis runs in your browser. Your HTML never leaves your device.",
      },
      {
        question: "When is empty alt acceptable?",
        answer:
          "Empty alt (alt='') is valid for purely decorative images that screen readers should skip. The auditor flags it for review so you can confirm it is intentional.",
      },
      {
        question: "Why does my descriptive alt get flagged as suspicious?",
        answer:
          "The auditor flags generic phrases like 'image of' or very short text. If your alt is meaningful but starts with a flagged phrase, you may need to rephrase (e.g. 'Photo of team' to 'Team at conference').",
      },
    ],
  },
};

export default manifest;
