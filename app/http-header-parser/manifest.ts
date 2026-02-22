import { FileText } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "http-header-parser",
  slug: "http-header-parser",
  title: "HTTP Header Parser",
  description:
    "Parse raw HTTP request or response headers into a structured view. Inspect headers and copy formatted output.",
  category: "web-http",
  tags: ["http", "headers", "parse", "request", "response", "api"],
  icon: FileText,
  seo: {
    title: "HTTP Header Parser | utilities.dev",
    description:
      "Parse raw HTTP headers in your browser. Paste request or response headers to inspect and copy. All processing is local.",
  },
  content: {
    intro: "Paste raw HTTP headers to parse them into a structured view. Inspect headers and copy the formatted output.",
    trustNote:
      "Header parsing runs entirely in your browser; no headers or data are sent to a server.",
    howToSteps: [
      "Paste raw HTTP headers from a request, response, or browser dev tools.",
      "View parsed headers in a structured list with optional status line.",
      "Copy the formatted output or clear to start over.",
    ],
    about:
      "This tool helps you inspect HTTP headers when debugging APIs, reviewing webhooks, or analyzing request/response details. It parses standard header format and supports status lines from HTTP responses.",
    useCases: [
      "Inspecting request headers from browser dev tools or network logs",
      "Parsing webhook payload headers for debugging",
      "Formatting headers for documentation or API testing",
    ],
    faqs: [
      {
        question: "What does the HTTP header parser do?",
        answer:
          "It parses raw HTTP header text (Name: Value format) into a structured list. You can paste headers from browser dev tools, curl output, or API logs. It optionally detects HTTP status lines (e.g. HTTP/1.1 200 OK).",
      },
      {
        question: "Are my headers sent to a server?",
        answer:
          "No, parsing happens entirely in your browser. Your headers are never transmitted.",
      },
      {
        question: "How does it handle headers with colons in the value?",
        answer:
          "It splits on the first colon only, so values like Date: Wed, 21 Oct 2015 07:28:00 GMT are parsed correctly.",
      },
      {
        question: "Can I parse both request and response headers?",
        answer:
          "Yes. Paste any header block. If the first line starts with HTTP/, it is treated as a status line; otherwise all lines are parsed as headers.",
      },
    ],
  },
};

export default manifest;
