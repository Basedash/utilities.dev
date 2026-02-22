import { Code } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "html-entity-encoder",
  slug: "html-entity-encoder",
  title: "HTML Entity Encoder Decoder",
  description:
    "Encode special characters to HTML entities and decode named or numeric entities back to plain text.",
  category: "encoding-hashing",
  tags: ["encoding", "html", "entities", "decode", "encode", "escape"],
  icon: Code,
  seo: {
    title: "HTML Entity Encoder and Decoder | utilities.dev",
    description:
      "Convert special characters to HTML entities and decode them in your browser. Supports named and numeric entities. Processing is local; encoding is not sanitization.",
  },
  content: {
    intro:
      "Encode or decode HTML entities instantly for safe display and data handling in web content.",
    trustNote:
      "Processing happens locally in your browser; entity encoding is for display safety, not input sanitization or XSS prevention.",
    howToSteps: [
      "Paste plain text or HTML entities into the input field.",
      "Choose Encode or Decode to run the conversion.",
      "Copy the result, swap input/output, or clear to start over.",
    ],
    about:
      "This tool helps you convert between plain text and HTML entities when preparing content for web display or parsing entity-encoded strings. It supports common named entities and decimal or hex numeric references.",
    useCases: [
      "Escaping special characters before inserting text into HTML",
      "Decoding entity-encoded content from APIs or scraped pages",
      "Converting numeric character references for debugging or migration",
    ],
    faqs: [
      {
        question: "What does HTML entity encoding do?",
        answer:
          "Entity encoding replaces characters like <, >, &, and quotes with safe sequences such as &lt;, &gt;, and &amp; so they display correctly in HTML without being interpreted as markup.",
      },
      {
        question: "Does this tool sanitize or prevent XSS?",
        answer:
          "No. Encoding a few characters is not full sanitization. For user input, use a proper sanitization library and context-aware escaping (HTML, JS, URL) to prevent XSS.",
      },
      {
        question: "Can I decode decimal and hex numeric entities?",
        answer:
          "Yes. The tool decodes &#123; (decimal) and &#x7B; (hex) style entities, plus common named entities like &amp; and &nbsp;.",
      },
      {
        question: "Why are some entities left unchanged when decoding?",
        answer:
          "Unknown named entities are left as-is. Ensure entities use correct names and end with a semicolon; ambiguous ampersands without semicolons are not decoded.",
      },
    ],
  },
};

export default manifest;
