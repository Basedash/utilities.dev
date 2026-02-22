import { FileImage } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "svg-viewer",
  slug: "svg-viewer",
  title: "SVG Viewer",
  description:
    "Preview, validate, and optimize SVG markup with live rendering for frontend and design workflows.",
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
    title: "SVG Viewer and Optimizer | utilities.dev",
    description:
      "Inspect SVG files with live preview, syntax validation, and format or minify controls to prepare web-ready vector assets.",
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
    intro: "Inspect SVG markup and optimize output before shipping assets.",
    trustNote:
      "SVG parsing and preview run in your browser; treat untrusted SVGs carefully because embedded scripts can be risky in other contexts.",
    howToSteps: [
      "Paste SVG markup or upload an SVG file.",
      "Check the live preview and validation feedback.",
      "Format or minify the SVG, then copy or download the result.",
    ],
    about:
      "This utility helps you inspect SVG structure, detect markup issues, and optimize output for delivery. It is useful for cleaning design exports and validating vector assets before committing them to a codebase.",
    useCases: [
      "Validating exported icons before production release",
      "Minifying SVG markup to reduce bundle size",
      "Cleaning design-tool SVG output for frontend use",
    ],
    faqs: [
      {
        question: "What can I do with this SVG viewer?",
        answer:
          "You can preview SVGs, validate markup, and format or minify output for cleaner files. It is useful for preparing web-ready vector assets.",
      },
      {
        question: "Is SVG preview safe for files with scripts or event handlers?",
        answer:
          "Preview is designed to reduce execution risk, but untrusted SVG content should still be handled cautiously. Security behavior can differ when SVGs are embedded in other environments.",
      },
      {
        question: "Can I minify SVG files for production use?",
        answer:
          "Yes, minification removes unnecessary whitespace and formatting to shrink file size. Always verify rendering after optimization, especially for complex SVGs.",
      },
      {
        question: "Will this detect invalid SVG markup?",
        answer:
          "Yes, validation feedback helps identify malformed tags and structural issues. This helps you catch broken markup before deploying assets.",
      },
    ],
  },
};

export default manifest;
