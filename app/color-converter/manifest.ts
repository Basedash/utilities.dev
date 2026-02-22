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
};

export default manifest;
