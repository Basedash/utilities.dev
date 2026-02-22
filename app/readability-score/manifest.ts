import { BookOpen } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "readability-score",
  slug: "readability-score",
  title: "Readability Score",
  description:
    "Compute readability metrics including Flesch Reading Ease and approximate grade level from pasted text.",
  category: "accessibility",
  tags: ["readability", "flesch", "grade-level", "accessibility", "plain-language"],
  icon: BookOpen,
  seo: {
    title: "Readability Score | utilities.dev",
    description:
      "Compute Flesch Reading Ease and grade level from text. Instant readability metrics for accessibility and content audits. Runs locally in your browser.",
  },
  content: {
    intro:
      "Compute readability metrics such as Flesch Reading Ease and approximate grade level from pasted text.",
    trustNote:
      "Metrics are computed locally in your browser using standard formulas. Results are approximate and may vary from other tools due to syllable estimation.",
    howToSteps: [
      "Paste or type text into the input area.",
      "Review the Flesch Reading Ease score and grade level.",
      "Copy or adjust content to target your desired readability level.",
    ],
    about:
      "This tool helps content creators and developers assess text readability for accessibility and audience targeting. It uses Flesch formulas with approximate syllable counting; results are best used as guidance rather than definitive scores.",
    useCases: [
      "Auditing documentation or help text for readability before release",
      "Targeting content to a specific reading level for accessibility",
      "Comparing draft revisions for readability improvements",
    ],
    faqs: [
      {
        question: "What does this readability tool measure?",
        answer:
          "It computes Flesch Reading Ease (0–100, higher is easier) and Flesch-Kincaid Grade Level (U.S. school grade). Both use word, sentence, and syllable counts with standard formulas.",
      },
      {
        question: "Does this tool send my text to a server?",
        answer:
          "No. All analysis runs locally in your browser. Your text is never sent to a server or stored.",
      },
      {
        question: "Why might my score differ from other tools?",
        answer:
          "Syllable counting is approximated with heuristics; different tools use different algorithms. Results are consistent within this tool but may vary across tools.",
      },
      {
        question: "What Flesch score should I aim for?",
        answer:
          "For general audiences, aim for 60–70 (8th–9th grade). For technical docs, 50–60 is common. Very high scores (80+) indicate very simple text.",
      },
    ],
  },
};

export default manifest;
