import { FileText } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "json-formatter",
  slug: "json-formatter",
  title: "JSON Formatter",
  description:
    "Format, minify, and validate JSON data with syntax highlighting and error detection.",
  category: "Formatting",
  tags: ["json", "format", "validate", "prettify", "minify", "syntax"],
  icon: FileText,
  seo: {
    title: "JSON Formatter & Validator | utilities.dev",
    description:
      "Free online JSON formatter, prettifier, and validator. Format, minify, and validate JSON data with syntax highlighting and error detection.",
  },
  content: {
    intro: "Format, validate, and minify JSON with instant feedback.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste your JSON into the input field.",
      "Choose Format, Minify, or Validate.",
      "Copy the output and use it in your API, config, or code.",
    ],
    about:
      "This utility helps you clean, validate, and compress JSON safely. It is useful for debugging API responses and preparing JSON payloads for production use.",
    useCases: [
      "Debugging malformed API responses",
      "Pretty-printing JSON for code reviews",
      "Minifying JSON before shipping payloads",
    ],
    faqs: [
      {
        question: "Does this tool modify my data?",
        answer:
          "No. It only formats or validates the JSON you paste into the editor.",
      },
      {
        question: "What happens on invalid JSON?",
        answer:
          "You get a clear validation error and no output is produced until fixed.",
      },
      {
        question: "Can I use this for large JSON payloads?",
        answer:
          "Yes for typical payload sizes. Very large data may be limited by browser memory.",
      },
    ],
  },
};

export default manifest;
