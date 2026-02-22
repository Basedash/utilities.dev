import { FileImage } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "svg-viewer",
  slug: "svg-viewer",
  title: "SVG Viewer",
  description:
    "View, format, validate, and analyze SVG files with real-time preview. Sanitize SVGs and extract metadata.",
  category: "Design",
  tags: [
    "svg",
    "vector",
    "graphics",
    "viewer",
    "format",
    "validate",
    "sanitize",
    "xml",
  ],
  icon: FileImage,
  seo: {
    title: "SVG Viewer - View, Format, and Analyze SVG Files | utilities.dev",
    description:
      "View, format, minify, and analyze SVG files with real-time preview. Validate SVG syntax, extract metadata, and preview safely in your browser. Free online SVG viewer and editor tool.",
    keywords: [
      "SVG viewer",
      "SVG editor",
      "SVG formatter",
      "SVG validator",
      "SVG minifier",
      "SVG sanitizer",
      "vector graphics",
      "XML viewer",
      "SVG analyzer",
      "scalable vector graphics",
    ],
  },
};

export default manifest;
