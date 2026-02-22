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
  content: {
    intro: "View, validate, format, and optimize SVG markup safely.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste SVG markup or upload an SVG file.",
      "Review validation state and live preview.",
      "Format or minify output, then copy or download the result.",
    ],
    about:
      "SVG Viewer helps developers and designers inspect and optimize SVG assets. It supports validation, formatting, and metadata extraction for faster iteration.",
    useCases: [
      "Checking exported SVG files before shipping",
      "Cleaning SVG markup from design tools",
      "Previewing SVG assets without opening external apps",
    ],
    faqs: [
      {
        question: "Is SVG preview safe?",
        answer:
          "The preview uses an image data URL strategy to reduce script execution risk from SVG content.",
      },
      {
        question: "Can I minify SVG for production?",
        answer:
          "Yes. The minify option removes unnecessary whitespace and formatting.",
      },
      {
        question: "Does this detect invalid SVG markup?",
        answer:
          "Yes. Validation feedback appears as you edit or paste SVG content.",
      },
    ],
  },
};

export default manifest;
