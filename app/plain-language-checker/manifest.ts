import { FileText } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "plain-language-checker",
  slug: "plain-language-checker",
  title: "Plain Language Checker",
  description:
    "Heuristic flags for long sentences, passive wording, jargon hits, and plain-language suggestions.",
  category: "accessibility",
  tags: ["plain-language", "accessibility", "readability", "passive-voice", "jargon"],
  icon: FileText,
  seo: {
    title: "Plain Language Checker | utilities.dev",
    description:
      "Flag long sentences, passive wording, and jargon in text. Heuristic plain-language suggestions for accessibility. Runs locally in your browser.",
  },
  content: {
    intro:
      "Get heuristic flags for long sentences, passive-ish wording markers, jargon hits, and a suggestions summary.",
    trustNote:
      "Analysis runs locally in your browser. Flags are heuristic only and may miss or over-flag; use as guidance, not as a definitive plain-language audit.",
    howToSteps: [
      "Paste or type text into the input area.",
      "Review long-sentence, passive, and jargon flags.",
      "Use the suggestions summary to improve clarity.",
    ],
    about:
      "This tool helps content creators spot common plain-language issues: long sentences, passive constructions, and jargon. It uses simple heuristics and a small jargon list; results are best used as a first pass before human review.",
    useCases: [
      "Scanning documentation or help text for plain-language issues",
      "Identifying passive voice and jargon before publishing",
      "Getting quick feedback during content drafting",
    ],
    faqs: [
      {
        question: "What does this plain-language checker flag?",
        answer:
          "It flags long sentences (over 25 words), passive-ish wording (e.g. is/are/was + past participle), and words from a built-in jargon list. It also provides a short suggestions summary.",
      },
      {
        question: "Does this tool send my text to a server?",
        answer:
          "No. All analysis runs locally in your browser. Your text is never sent to a server or stored.",
      },
      {
        question: "Why might it miss or over-flag passive voice?",
        answer:
          "Passive detection uses simple pattern matching (e.g. 'is done', 'was completed'). It can miss complex passives and may flag false positives. Use as a starting point, not a final check.",
      },
      {
        question: "Can I add custom jargon words?",
        answer:
          "No. The checker uses a fixed jargon list. For custom terms, consider a separate review or editing workflow.",
      },
    ],
  },
};

export default manifest;
