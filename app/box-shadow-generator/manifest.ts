import { Box } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "box-shadow-generator",
  slug: "box-shadow-generator",
  title: "Box Shadow Generator",
  description:
    "Generate CSS box-shadow strings with live preview. Adjust offsets, blur, spread, color, opacity, and inset for copy-ready output.",
  category: "color-design",
  tags: ["box-shadow", "css", "design", "shadow", "styling", "frontend"],
  icon: Box,
  seo: {
    title: "Box Shadow Generator | utilities.dev",
    description:
      "Create CSS box-shadow values with live preview. Tune offsets, blur, spread, color, and opacity for copy-ready CSS—all processed locally in your browser.",
  },
  content: {
    intro:
      "Build CSS box-shadow declarations visually and copy the output into your stylesheets.",
    trustNote:
      "All generation runs locally in your browser; no shadow values are sent to any server.",
    howToSteps: [
      "Adjust offset, blur, spread, color, opacity, and inset using the controls.",
      "Preview the shadow in real time on the sample card.",
      "Copy the CSS output and paste it into your stylesheet or component.",
    ],
    about:
      "This tool helps you craft box-shadow values without guessing pixel values or opacity. It is useful when prototyping UI depth, cards, or elevation in design systems.",
    useCases: [
      "Prototyping card and button shadows for design handoff",
      "Tuning elevation values for a design system",
      "Experimenting with inset shadows for pressed states",
    ],
    faqs: [
      {
        question: "What is this box shadow generator for?",
        answer:
          "It generates CSS box-shadow declaration strings from visual controls. You adjust offsets, blur, spread, color, opacity, and inset, then copy the resulting CSS.",
      },
      {
        question: "Does this tool send my shadow values anywhere?",
        answer:
          "No. All generation runs entirely in your browser. No shadow parameters or colors are transmitted to any server.",
      },
      {
        question: "Can I use negative values for offset or spread?",
        answer:
          "Yes. Negative offsets move the shadow up or left; negative spread shrinks the shadow. The tool supports all valid CSS box-shadow numeric values.",
      },
      {
        question: "Why does my shadow look different in my project?",
        answer:
          "Rendering can vary by background color, surrounding elements, and browser. Copy the CSS and tweak values in your environment if the visual result differs.",
      },
    ],
  },
};

export default manifest;
