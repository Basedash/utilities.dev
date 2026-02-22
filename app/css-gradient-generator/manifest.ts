import { Palette } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "css-gradient-generator",
  slug: "css-gradient-generator",
  title: "CSS Gradient Generator",
  description:
    "Generate CSS linear and radial gradients with color stops, angle, and direction controls for design and frontend workflows.",
  category: "color-design",
  tags: ["css", "gradient", "linear", "radial", "color", "design", "background"],
  icon: Palette,
  seo: {
    title: "CSS Gradient Generator | utilities.dev",
    description:
      "Create linear and radial CSS gradients in your browser with color stops and angle controls. Copy-ready output for backgrounds and design systems.",
  },
  content: {
    intro:
      "Build CSS gradients visually with color stops and direction controls, then copy the generated CSS.",
    trustNote:
      "Gradient generation runs locally in your browser; no input is sent to a server.",
    howToSteps: [
      "Add or edit color stops and set positions (0–100%).",
      "Choose linear or radial, set angle or direction, and preview the result.",
      "Copy the CSS output for your stylesheet or design system.",
    ],
    about:
      "This utility helps you create linear and radial CSS gradients without memorizing syntax. It is useful when prototyping backgrounds, building design tokens, or quickly iterating on gradient directions and color stops.",
    useCases: [
      "Prototyping hero section or card backgrounds with custom gradients",
      "Generating design system gradient tokens from color palettes",
      "Tuning gradient angle and stops for accessibility and contrast",
    ],
    faqs: [
      {
        question: "What is the CSS gradient generator?",
        answer:
          "It is a browser tool that lets you configure color stops, angle, and direction for linear or radial gradients, then outputs copy-ready CSS. All processing happens locally.",
      },
      {
        question: "Does this tool send my colors or gradients to a server?",
        answer:
          "No. Gradient generation runs entirely in your browser. Your color choices and CSS output never leave your device.",
      },
      {
        question: "Can I use RGB, HSL, or named colors in the gradient?",
        answer:
          "Yes. The tool accepts hex, rgb, rgba, hsl, and hsla values. Use any valid CSS color format for your stops.",
      },
      {
        question: "Why does my gradient look different in another browser?",
        answer:
          "Gradient rendering can vary slightly across browsers and color profiles. Test your CSS in target environments and consider fallback background colors for older browsers.",
      },
    ],
  },
};

export default manifest;
