import { Palette } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "palette-generator",
  slug: "palette-generator",
  title: "Palette Generator",
  description:
    "Generate color palettes from a base color with deterministic shades and tints for design systems and CSS.",
  category: "color-design",
  tags: ["palette", "color", "shades", "tints", "design system", "css variables", "hex"],
  icon: Palette,
  seo: {
    title: "Palette Generator | utilities.dev",
    description:
      "Generate design-system palettes from a base color. Get shades, tints, and CSS variable output—all processed locally in your browser.",
  },
  content: {
    intro: "Create consistent color scales from any base color for design systems and stylesheets.",
    trustNote:
      "Palette generation runs entirely in your browser; no colors or input are sent to a server.",
    howToSteps: [
      "Enter a base color in HEX format.",
      "Choose output format (CSS variables, hex map) and copy options.",
      "Copy the generated palette for use in CSS, Tailwind config, or design tokens.",
    ],
    about:
      "This utility helps you build color scales from a single base color, useful when defining design tokens or migrating brand colors into a structured palette. Output is deterministic: the same base color always produces the same shades and tints.",
    useCases: [
      "Generating Tailwind-style color scales for a custom theme",
      "Creating CSS custom property palettes for component libraries",
      "Exporting hex values for design handoff or style guides",
    ],
    faqs: [
      {
        question: "What does this palette generator do?",
        answer:
          "It takes a base HEX color and produces a full scale of lighter tints and darker shades, with 500 as the base. Output includes HEX values and CSS variable declarations suitable for design systems.",
      },
      {
        question: "Does this tool send my colors to a server?",
        answer:
          "No, all processing happens in your browser. Your base color and generated palette never leave your device.",
      },
      {
        question: "Can I use shorthand HEX values like #fff?",
        answer:
          "No, only full six-digit HEX format (#RRGGBB) is supported. Use a color converter first if you have shorthand or other formats.",
      },
      {
        question: "Why does my palette look different from Tailwind's default colors?",
        answer:
          "This tool uses a simple HSL-based interpolation. Tailwind and other frameworks may use different algorithms or hand-tuned values, so results can vary slightly.",
      },
    ],
  },
};

export default manifest;
