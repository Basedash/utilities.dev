import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter & Picker | utilities.dev",
  description:
    "Free online color converter and picker. Convert colors between HEX, RGB, HSL, HSV, and other formats with live preview and copy functionality.",
};

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
