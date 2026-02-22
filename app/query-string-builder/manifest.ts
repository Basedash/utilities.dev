import { Link2 } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "query-string-builder",
  slug: "query-string-builder",
  title: "Query String Builder",
  description:
    "Parse and build URL query strings with key-value pairs. Add, edit, remove params and copy the result.",
  category: "web-http",
  tags: ["query", "url", "params", "search", "string", "builder"],
  icon: Link2,
  seo: {
    title: "Query String Builder | utilities.dev",
    description:
      "Parse and build URL query strings in your browser. Add, edit, remove params and copy. All processing is local.",
  },
  content: {
    intro: "Parse query strings into editable key-value pairs, then build and copy the result.",
    trustNote:
      "Query string parsing and building run entirely in your browser; no data is sent to a server.",
    howToSteps: [
      "Paste a query string or URL fragment, or start with an empty list.",
      "Add, edit, or remove key-value pairs using the controls.",
      "Copy the built query string or clear to start over.",
    ],
    about:
      "This tool helps you work with URL query parameters when building API URLs, debugging redirects, or constructing links. It parses standard query format and lets you modify params before rebuilding.",
    useCases: [
      "Building API URLs with dynamic query parameters",
      "Debugging and modifying redirect URLs with query strings",
      "Converting between query string formats for different systems",
    ],
    faqs: [
      {
        question: "What does the query string builder do?",
        answer:
          "It parses a query string (e.g. ?foo=bar&baz=qux) into editable key-value pairs, lets you add or remove params, and rebuilds the encoded string. You can paste a full URL and it will parse the query portion.",
      },
      {
        question: "Is my query string sent to a server?",
        answer:
          "No, all parsing and building happens locally in your browser. Your input is never transmitted.",
      },
      {
        question: "How does it handle duplicate keys or special characters?",
        answer:
          "When parsing, duplicate keys keep the last value. Keys and values are URL-encoded when building, so spaces and special characters are handled correctly.",
      },
      {
        question: "Can I parse a query string without the leading ?",
        answer:
          "Yes, both ?foo=bar and foo=bar are accepted. The leading ? is optional.",
      },
    ],
  },
};

export default manifest;
