import { FileText } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "json-formatter",
  slug: "json-formatter",
  title: "JSON Formatter",
  description:
    "Format, minify, and validate JSON data with syntax highlighting and error detection.",
  category: "Formatting",
  tags: ["json", "format", "validate", "prettify", "minify", "syntax"],
  icon: FileText,
  seo: {
    title: "JSON Formatter & Validator | utilities.dev",
    description:
      "Free online JSON formatter, prettifier, and validator. Format, minify, and validate JSON data with syntax highlighting and error detection.",
  },
};

export default manifest;
