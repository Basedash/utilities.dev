import { Table } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "csv-json-converter",
  slug: "csv-json-converter",
  title: "CSV JSON Converter",
  description:
    "Convert between CSV and JSON for data import, export, and API integration workflows.",
  category: "data-formatting",
  tags: ["csv", "json", "convert", "import", "export", "spreadsheet"],
  icon: Table,
  seo: {
    title: "CSV to JSON Converter | utilities.dev",
    description:
      "Convert CSV to JSON and JSON to CSV in your browser. Supports quoted fields for spreadsheet exports and API data workflows.",
  },
  content: {
    intro: "Convert between CSV and JSON for data pipelines and API payloads.",
    trustNote:
      "Conversion runs in your browser; your data is never sent to a server.",
    howToSteps: [
      "Paste CSV or JSON into the input area.",
      "Choose CSV to JSON or JSON to CSV and click Convert.",
      "Copy the result for import, export, or API use.",
    ],
    about:
      "This utility helps you move data between CSV (common in spreadsheets and exports) and JSON (common in APIs and config). It handles quoted fields and commas correctly for practical import and export workflows.",
    useCases: [
      "Converting spreadsheet exports to JSON for API requests",
      "Turning API response JSON into CSV for Excel or analysis",
      "Preparing CSV data for import into JSON-based systems",
    ],
    faqs: [
      {
        question: "What is the difference between CSV to JSON and JSON to CSV?",
        answer:
          "CSV to JSON reads comma-separated rows and turns the first row into keys, producing an array of objects. JSON to CSV does the reverse, turning an array of objects into comma-separated rows with a header line.",
      },
      {
        question: "Is my data sent to a server when I convert?",
        answer:
          "No, all conversion happens in your browser. Your CSV or JSON data never leaves your device.",
      },
      {
        question: "Does it support fields with commas or quotes?",
        answer:
          "Yes, CSV fields containing commas or quotes are quoted and escaped per RFC 4180. Double quotes inside quoted fields are escaped as two quotes.",
      },
      {
        question: "Why does my JSON to CSV output look wrong?",
        answer:
          "JSON to CSV expects an array of objects with consistent keys. If your JSON is an object, a nested structure, or has inconsistent keys across items, the output may not match expectations. Ensure the top level is an array of objects.",
      },
    ],
  },
};

export default manifest;
