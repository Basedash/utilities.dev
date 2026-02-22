import { Settings } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "ini-json-converter",
  slug: "ini-json-converter",
  title: "INI JSON Converter",
  description:
    "Convert between INI config files and JSON for settings migration and API integration.",
  category: "data-formatting",
  tags: ["ini", "json", "config", "convert", "settings", "properties"],
  icon: Settings,
  seo: {
    title: "INI to JSON Converter | utilities.dev",
    description:
      "Convert INI config files to JSON and JSON to INI in your browser. Useful for settings migration and config normalization.",
  },
  content: {
    intro: "Convert between INI config format and JSON for settings and config workflows.",
    trustNote:
      "Conversion runs in your browser; your config data is never sent to a server.",
    howToSteps: [
      "Paste INI or JSON into the input area.",
      "Choose INI to JSON or JSON to INI and click Convert.",
      "Copy the result for config migration or API use.",
    ],
    about:
      "This utility helps you move between INI (common in Windows configs, PHP, and legacy apps) and JSON (common in modern APIs and Node configs). Use it when migrating config files, normalizing settings for APIs, or debugging config structure.",
    useCases: [
      "Migrating legacy INI configs to JSON-based systems",
      "Converting JSON settings to INI for PHP or Windows apps",
      "Normalizing config structure for API or tool integration",
    ],
    faqs: [
      {
        question: "What is the difference between INI to JSON and JSON to INI?",
        answer:
          "INI to JSON reads section headers and key=value pairs, producing a nested object. JSON to INI does the reverse, turning an object with string keys and nested objects into INI sections and key=value lines.",
      },
      {
        question: "Is my config data sent to a server?",
        answer:
          "No, all conversion happens in your browser. Your INI or JSON config never leaves your device.",
      },
      {
        question: "Does it support INI comments and empty lines?",
        answer:
          "Yes, lines starting with ; or # and empty lines are ignored when parsing INI. Comments are not preserved when converting JSON back to INI.",
      },
      {
        question: "Why does my JSON to INI output have a different section order?",
        answer:
          "Section order is sorted alphabetically with the global section first. JSON object key order is not guaranteed, so we normalize for deterministic output.",
      },
    ],
  },
};

export default manifest;
