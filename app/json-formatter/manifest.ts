import { FileText } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "json-formatter",
  slug: "json-formatter",
  title: "JSON Formatter",
  description:
    "Format, validate, and minify JSON with clear error feedback for API and configuration workflows.",
  category: "Formatting",
  tags: ["json", "format", "validate", "prettify", "minify", "syntax"],
  icon: FileText,
  seo: {
    title: "JSON Formatter and Validator | utilities.dev",
    description:
      "Format, validate, and minify JSON in your browser with syntax error feedback. Useful for API payload debugging and config cleanup.",
  },
  content: {
    intro: "Clean up JSON and catch syntax issues before it reaches production.",
    trustNote:
      "JSON processing runs in your browser; invalid input is never silently fixed or sent to a server.",
    howToSteps: [
      "Paste JSON into the editor input.",
      "Choose Format, Minify, or Validate based on your task.",
      "Copy the result or use validation feedback to fix syntax errors.",
    ],
    about:
      "This utility helps you make JSON readable, compact, and syntactically correct in one place. It is useful when debugging API responses, preparing request bodies, and reviewing config files before commit.",
    useCases: [
      "Validating request and response payloads during API debugging",
      "Formatting JSON for easier code review discussion",
      "Minifying JSON before embedding in transport payloads",
    ],
    faqs: [
      {
        question: "What is the difference between formatting, minifying, and validating JSON?",
        answer:
          "Formatting adds indentation for readability, minifying removes whitespace for compact output, and validation checks syntax correctness. These operations do not change the underlying data model.",
      },
      {
        question: "What happens when the JSON is invalid?",
        answer:
          "The tool returns a parse error so you can locate and correct malformed syntax. Invalid JSON is not formatted or minified into output.",
      },
      {
        question: "Does formatting JSON change keys or values?",
        answer:
          "No, formatting changes whitespace and indentation only. Key order may appear preserved, but JSON semantics should not depend on ordering.",
      },
      {
        question: "Is it safe to paste private JSON into this formatter?",
        answer:
          "The formatter processes input in your browser session, which avoids network submission by the tool itself. You should still follow your organization policy before handling sensitive production data.",
      },
    ],
  },
};

export default manifest;
