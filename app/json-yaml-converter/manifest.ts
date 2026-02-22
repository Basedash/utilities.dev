import { ArrowLeftRight } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "json-yaml-converter",
  slug: "json-yaml-converter",
  title: "JSON YAML Converter",
  description:
    "Convert between JSON and YAML formats with validation and error feedback for config and API workflows.",
  category: "Formatting",
  tags: ["json", "yaml", "convert", "config", "format", "validate"],
  icon: ArrowLeftRight,
  seo: {
    title: "JSON YAML Converter | utilities.dev",
    description:
      "Convert JSON to YAML and YAML to JSON in your browser. Validates input and shows errors. Useful for config files and API payloads.",
  },
  content: {
    intro: "Convert between JSON and YAML with clear validation feedback.",
    trustNote:
      "Conversion runs in your browser; input is never sent to a server. Some YAML features may not round-trip identically.",
    howToSteps: [
      "Paste JSON or YAML into the input field.",
      "Choose conversion direction and click Convert.",
      "Copy the result or clear to start over.",
    ],
    about:
      "This utility helps you switch between JSON and YAML for config files, API payloads, and CI definitions. Round-trip conversion may differ for edge cases like custom YAML tags or key ordering.",
    useCases: [
      "Converting Kubernetes or Docker Compose configs between formats",
      "Translating API request bodies from JSON to YAML for tooling",
      "Migrating config files between systems that prefer different formats",
    ],
    faqs: [
      {
        question: "What does this tool do?",
        answer:
          "It converts JSON to YAML and YAML to JSON. You paste input, pick a direction, and get formatted output with validation errors if the input is malformed.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. All conversion runs locally in your browser. Your input is never transmitted or stored by this tool.",
      },
      {
        question: "Does round-trip conversion always produce identical output?",
        answer:
          "Not always. YAML supports features like anchors and custom tags that JSON does not. Key order and formatting may differ after a round-trip.",
      },
      {
        question: "Why does my YAML show an error?",
        answer:
          "Check indentation (YAML uses spaces, not tabs), colons in unquoted strings, and that lists and mappings are correctly structured. The error message points to the issue.",
      },
    ],
  },
};

export default manifest;
