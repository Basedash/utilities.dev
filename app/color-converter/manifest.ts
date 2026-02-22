import { Palette } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "color-converter",
  slug: "color-converter",
  title: "Color Converter",
  description:
    "Convert colors between different formats including HEX, RGB, HSL, HSV, and more with live preview.",
  category: "Design",
  tags: ["color", "hex", "rgb", "hsl", "hsv", "convert", "picker", "design"],
  icon: Palette,
  seo: {
    title: "Color Converter & Picker | utilities.dev",
    description:
      "Free online color converter and picker. Convert colors between HEX, RGB, HSL, HSV, and other formats with live preview and copy functionality.",
  },
  content: {
    intro: "Convert colors between HEX, RGB, HSL, and HSV formats.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Enter a color value in any supported format.",
      "View converted values in other formats instantly.",
      "Copy the format you need for your code or design tool.",
    ],
    about:
      "Color Converter is a fast utility for translating values between common color systems used in design and frontend development.",
    useCases: [
      "Converting brand colors for CSS",
      "Switching between design and code formats",
      "Checking color values while prototyping",
    ],
    faqs: [
      {
        question: "Which formats are supported?",
        answer:
          "The tool supports common web color formats such as HEX, RGB, HSL, and HSV.",
      },
      {
        question: "Does conversion change the color itself?",
        answer:
          "No. Only the representation changes, not the underlying color value.",
      },
      {
        question: "Can I use shorthand HEX values?",
        answer:
          "Yes. Shorthand values are expanded and converted to equivalent full forms.",
      },
    ],
  },
};

export default manifest;
