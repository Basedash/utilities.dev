import { Code } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "text-escape-unescape",
  slug: "text-escape-unescape",
  title: "Text Escape Unescape",
  description:
    "Escape and unescape text for JSON, JavaScript, regex, and newline contexts with context-specific rules.",
  category: "Encoding",
  tags: ["escape", "unescape", "json", "javascript", "regex", "string"],
  icon: Code,
  seo: {
    title: "Text Escape Unescape | utilities.dev",
    description:
      "Escape and unescape text for JSON, JavaScript, regex, and newline contexts. Runs locally in your browser.",
  },
  content: {
    intro: "Escape or unescape text for JSON, JavaScript, regex, and newline/tab contexts.",
    trustNote:
      "Processing runs in your browser. Escaping is context-specific and does not sanitize or validate input for security.",
    howToSteps: [
      "Paste text into the input and select the context (JSON, JavaScript, regex, or newline/tab).",
      "Choose Escape or Unescape to perform the conversion.",
      "Copy the result, clear inputs, or swap input and output for another pass.",
    ],
    about:
      "This tool helps you prepare strings for embedding in JSON, JavaScript, or regex literals, or to make newlines and tabs visible. Each context uses different escape rules, so choose the one that matches your target.",
    useCases: [
      "Escaping user input before embedding in JSON or JavaScript string literals",
      "Preparing a literal string for use inside a regex pattern",
      "Converting newlines and tabs to visible escape sequences for debugging",
    ],
    faqs: [
      {
        question: "What does this tool do?",
        answer:
          "It escapes or unescapes text for specific contexts: JSON strings, JavaScript strings, regex literal patterns, and newline/tab visibility. Each context has different rules, so the output depends on the mode you select.",
      },
      {
        question: "Does this tool sanitize or validate input for security?",
        answer:
          "No. It only applies escape/unescape rules. Escaping for JSON or regex does not sanitize against XSS or other injection. Use proper validation and encoding for security-sensitive contexts.",
      },
      {
        question: "Why does JSON escaping differ from regex escaping?",
        answer:
          "JSON escapes quotes, newlines, and control characters for string literals. Regex escaping backslash-prefixes special metacharacters so they match literally. The rules are different because the contexts differ.",
      },
      {
        question: "What if unescape fails with an error?",
        answer:
          "Check that the input uses valid escape sequences for the selected context. Invalid sequences like malformed \\uXXXX or stray backslashes will cause an error. Ensure you chose the correct mode for your input.",
      },
    ],
  },
};

export default manifest;
