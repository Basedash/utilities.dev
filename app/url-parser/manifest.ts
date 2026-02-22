import { Link2 } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "url-parser",
  slug: "url-parser",
  title: "URL Parser",
  description:
    "Parse URLs into protocol, host, path, query params, and hash with an editable view to rebuild and copy.",
  category: "Formatting",
  tags: ["url", "parse", "query", "params", "host", "path"],
  icon: Link2,
  seo: {
    title: "URL Parser | utilities.dev",
    description:
      "Parse and edit URLs in your browser. Inspect protocol, host, path, query params, and hash. Rebuild URLs from parsed parts.",
  },
  content: {
    intro: "Break down URLs into parts and rebuild them with editable query parameters.",
    trustNote:
      "URL parsing runs in your browser; no input is sent to a server.",
    howToSteps: [
      "Paste or type a URL into the input field.",
      "View parsed parts and edit query parameters in the list.",
      "Copy the rebuilt URL or clear to start over.",
    ],
    about:
      "This tool helps you inspect and modify URLs when debugging redirects, building API endpoints, or working with query strings. It parses URLs locally and lets you edit query params before rebuilding.",
    useCases: [
      "Inspecting query parameters in redirect URLs during debugging",
      "Building or modifying API endpoint URLs with dynamic params",
      "Understanding URL structure before implementing routing logic",
    ],
    faqs: [
      {
        question: "What does the URL parser do?",
        answer:
          "It splits a URL into protocol, host, port, pathname, query parameters, and hash. You can view and edit query params, then rebuild the full URL.",
      },
      {
        question: "Is my URL sent to a server?",
        answer:
          "No, parsing and rebuilding happen entirely in your browser. URLs are never transmitted by this tool.",
      },
      {
        question: "Why does parsing fail for some URLs?",
        answer:
          "The parser uses the browser URL API, which requires a valid absolute URL with a scheme (e.g. https://). Relative paths or malformed strings will fail.",
      },
      {
        question: "How do I add or remove query parameters?",
        answer:
          "Use the Add param button to insert new key-value pairs, or the trash icon next to each row to remove. Changes update the rebuilt URL immediately.",
      },
    ],
  },
};

export default manifest;
