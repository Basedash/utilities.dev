import { FileSearch } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "http-status-codes",
  slug: "http-status-codes",
  title: "HTTP Status Codes Reference",
  description:
    "Search and browse HTTP status codes by category with quick lookup by code or phrase.",
  category: "Reference",
  tags: ["http", "status", "codes", "api", "rest", "reference", "1xx", "2xx", "3xx", "4xx", "5xx"],
  icon: FileSearch,
  seo: {
    title: "HTTP Status Codes Reference | utilities.dev",
    description:
      "Look up HTTP status codes by number or keyword. Browse 1xx-5xx with short descriptions. Local reference only, not protocol enforcement.",
  },
  content: {
    intro: "Look up HTTP status codes by number or phrase and browse by category.",
    trustNote:
      "Lookup runs locally in your browser. This is reference guidance only, not protocol enforcement or validation.",
    howToSteps: [
      "Type a status code (e.g. 404) or phrase (e.g. not found) in the search box.",
      "Use category chips to filter by 1xx, 2xx, 3xx, 4xx, or 5xx.",
      "Copy codes and descriptions for API docs, error handling, or debugging.",
    ],
    about:
      "This utility helps you quickly find HTTP status code meanings when debugging APIs, writing error handlers, or documenting endpoints. It covers common codes; RFCs define the authoritative semantics.",
    useCases: [
      "Looking up status codes while debugging API responses",
      "Choosing appropriate codes for REST endpoint design",
      "Writing error messages or client handling logic",
    ],
    faqs: [
      {
        question: "What does this HTTP status codes tool do?",
        answer:
          "It lets you search and browse HTTP status codes by number or keyword, grouped by category (1xx through 5xx). Use it for quick reference during API work.",
      },
      {
        question: "Does this tool validate or enforce HTTP protocol?",
        answer:
          "No. It is a local reference lookup only. It does not validate requests, responses, or enforce any protocol rules.",
      },
      {
        question: "Are all HTTP status codes included?",
        answer:
          "The tool includes common codes developers encounter. The IANA registry and RFC 9110 define the full official set.",
      },
      {
        question: "How do I search by phrase vs by code?",
        answer:
          "Type a number to match by code (exact or prefix). Type words to match the status name or description. Both are case-insensitive.",
      },
    ],
  },
};

export default manifest;
