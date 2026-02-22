import { Link } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "url-encoding",
  slug: "url-encoding",
  title: "URL Encoder Decoder",
  description:
    "Encode and decode URL percent-encoded strings for query parameters and safe transport in links.",
  category: "web-http",
  tags: ["encoding", "url", "percent-encode", "decode", "query", "links"],
  icon: Link,
  seo: {
    title: "URL Encoder and Decoder | utilities.dev",
    description:
      "Convert text to and from URL percent-encoding in your browser. Useful for query parameters, redirect URLs, and API paths.",
  },
  content: {
    intro:
      "Encode or decode URL percent-encoded strings instantly for query params, redirects, and API workflows.",
    trustNote:
      "Processing happens locally in your browser; percent-encoding is reversible and does not secure or verify data.",
    howToSteps: [
      "Paste plain text or a percent-encoded string into the input.",
      "Choose Encode or Decode to run the conversion.",
      "Copy the result and use it in your URL, query string, or API path.",
    ],
    about:
      "This tool helps you convert between raw text and URL-safe percent-encoding when building links, query parameters, or API paths. It follows RFC 3986 percent-encoding rules and is useful for debugging redirect URLs and preparing values for web requests.",
    useCases: [
      "Encoding query parameter values for safe use in URLs",
      "Decoding percent-encoded segments while debugging redirects",
      "Preparing special characters for API path or form values",
    ],
    faqs: [
      {
        question: "What is URL percent-encoding used for?",
        answer:
          "Percent-encoding converts characters into a safe format for URLs by replacing them with percent signs followed by hex codes. It is required for query parameters, path segments, and any text that may contain spaces or special characters.",
      },
      {
        question: "Does this tool send my data to a server?",
        answer:
          "No, encoding and decoding run entirely in your browser. Your input never leaves your device, which helps when working with sensitive or private strings.",
      },
      {
        question: "Why does decoding fail on some percent-encoded strings?",
        answer:
          "Decoding fails when the percent sequence is malformed, such as an incomplete %XX or invalid hex digits. Some systems use non-standard encoding that may not match RFC 3986.",
      },
      {
        question: "When should I use encode vs decode?",
        answer:
          "Use encode when you have plain text to put into a URL or query parameter. Use decode when you have a percent-encoded string and need to read or debug the original value.",
      },
    ],
  },
};

export default manifest;
