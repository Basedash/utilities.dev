import { Palette } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "color-converter",
  slug: "color-converter",
  title: "Color Converter",
  description:
    "Convert colors between HEX, RGB, HSL, and HSV with instant previews for design and frontend workflows.",
  category: "color-design",
  tags: ["color", "hex", "rgb", "hsl", "hsv", "convert", "picker", "design"],
  icon: Palette,
  seo: {
    title: "Color Converter (HEX, RGB, HSL, HSV) | utilities.dev",
    description:
      "Convert HEX, RGB, HSL, and HSV color values in your browser with live preview and copy-ready output for CSS and design systems.",
  },
  content: {
    intro: "Convert color values across common web formats without losing visual intent.",
    trustNote:
      "Color conversions run locally in your browser; displayed values depend on supported precision and rounding.",
    howToSteps: [
      "Enter a color in HEX, RGB, HSL, or HSV format.",
      "Review converted values and the live preview swatch.",
      "Copy the target format for CSS, tokens, or design documentation.",
    ],
    about:
      "This utility translates color values across formats commonly used in UI design and frontend code. It helps you keep color intent consistent when moving between design tools, style sheets, and component tokens.",
    useCases: [
      "Converting brand palette values into CSS-ready formats",
      "Translating design handoff colors into component tokens",
      "Checking equivalent values while prototyping themes",
    ],
    faqs: [
      {
        question: "What color formats can this converter handle?",
        answer:
          "The converter supports HEX, RGB, HSL, and HSV color formats used in most web and design workflows. You can enter any supported format and get equivalent values in the others.",
      },
      {
        question: "Does converting between HEX, RGB, HSL, and HSV change the color?",
        answer:
          "No, conversion changes representation, not intended color. Small numeric differences can appear from rounding, especially when formats use different precision.",
      },
      {
        question: "Can I use shorthand HEX values like #fff?",
        answer:
          "Yes, shorthand HEX values are expanded to full six-digit form before conversion. The resulting RGB, HSL, and HSV outputs represent the same color.",
      },
      {
        question: "When should I edit colors in HSL instead of RGB?",
        answer:
          "HSL is easier when you want to tune hue, saturation, or lightness by intent. RGB is often better when matching channel-level values from graphics APIs or existing CSS.",
      },
    ],
  },
};

export default manifest;
