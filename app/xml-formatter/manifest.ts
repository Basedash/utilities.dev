import { FileCode } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "xml-formatter",
  slug: "xml-formatter",
  title: "XML Formatter",
  description:
    "Format, validate, and minify XML for config files, feeds, and API payloads.",
  category: "data-formatting",
  tags: ["xml", "format", "validate", "prettify", "minify", "syntax"],
  icon: FileCode,
  seo: {
    title: "XML Formatter and Validator | utilities.dev",
    description:
      "Format, validate, and minify XML in your browser. Useful for config files, RSS feeds, and SOAP payloads.",
  },
  content: {
    intro: "Clean up XML and catch syntax issues before it reaches production.",
    trustNote:
      "XML processing runs in your browser; invalid input is never silently fixed or sent to a server.",
    howToSteps: [
      "Paste XML into the editor input.",
      "Choose Format, Minify, or Validate based on your task.",
      "Copy the result or use validation feedback to fix syntax errors.",
    ],
    about:
      "This utility helps you make XML readable, compact, and syntactically correct in one place. It is useful when debugging API responses, preparing config files, and reviewing RSS or SOAP payloads before commit.",
    useCases: [
      "Formatting SOAP or REST XML payloads during API debugging",
      "Minifying XML config files for embedded deployment",
      "Validating RSS or Atom feeds before publishing",
    ],
    faqs: [
      {
        question: "What is the difference between formatting, minifying, and validating XML?",
        answer:
          "Formatting adds indentation for readability, minifying removes whitespace for compact output, and validation checks syntax correctness. These operations do not change the underlying data model.",
      },
      {
        question: "Does this tool send my XML to a server?",
        answer:
          "No, all processing happens in your browser. Your XML is never transmitted to any server by this tool.",
      },
      {
        question: "Does it support XML namespaces and CDATA sections?",
        answer:
          "Yes, the formatter uses the browser's native XML parser which supports namespaces, CDATA, and standard XML 1.0 features. Output may normalize some formatting details.",
      },
      {
        question: "Why does my formatted XML look different from the input?",
        answer:
          "The parser normalizes whitespace between tags and may reorder attributes. The logical structure and content remain the same; only presentation changes.",
      },
    ],
  },
};

export default manifest;
