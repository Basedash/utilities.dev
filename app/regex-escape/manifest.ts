import { Shield } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "regex-escape",
  slug: "regex-escape",
  title: "Regex Escape",
  description:
    "Escape special regex characters in a string so it matches literally in regular expressions.",
  category: "text-regex",
  tags: ["regex", "escape", "pattern", "literal", "string"],
  icon: Shield,
  seo: {
    title: "Regex Escape | utilities.dev",
    description:
      "Escape special regex characters in your browser. Turn user input or file paths into safe literal patterns for JavaScript and other regex engines.",
  },
  content: {
    intro: "Escape special regex characters so your string matches literally in a pattern.",
    trustNote:
      "Escaping runs in your browser; output is suitable for JavaScript regex but engine behavior may differ elsewhere.",
    howToSteps: [
      "Paste or type the string you want to use as a literal regex pattern.",
      "Click Escape to add backslashes before special characters.",
      "Copy the escaped result and paste it into your regex or code.",
    ],
    about:
      "This tool escapes characters that have special meaning in regex (e.g. . * + ? [ ] ( ) | \\), so you can safely match user input or file paths as literal text. It is useful when building dynamic patterns from untrusted strings.",
    useCases: [
      "Escaping user search input before using it in a regex pattern",
      "Converting file paths or URLs into literal match patterns",
      "Preparing strings for RegExp constructors or replace operations",
    ],
    faqs: [
      {
        question: "What does regex escaping do?",
        answer:
          "It adds backslashes before characters that have special meaning in regex (like . * + ? [ ] ( ) | \\), so the pattern matches those characters literally instead of as regex metacharacters.",
      },
      {
        question: "Does this tool send my text anywhere?",
        answer:
          "No, escaping runs entirely in your browser. Your input never leaves your device.",
      },
      {
        question: "Will the escaped output work in all regex engines?",
        answer:
          "The output follows JavaScript regex escaping rules. Other engines (PCRE, Python, etc.) may have slightly different special character sets, so test in your target environment.",
      },
      {
        question: "When should I escape vs. use a regex directly?",
        answer:
          "Escape when your pattern comes from user input, config, or file paths. Use raw regex when you control the pattern and want metacharacters like . or * to have their special meaning.",
      },
    ],
  },
};

export default manifest;
