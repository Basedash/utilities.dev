/**
 * Pure utilities for WCAG color contrast checking.
 * Uses sRGB relative luminance per WCAG 2.1.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** WCAG AA: 4.5:1 normal, 3:1 large. AAA: 7:1 normal, 4.5:1 large. */
export const WCAG_RATIOS = {
  aaNormal: 4.5,
  aaLarge: 3,
  aaaNormal: 7,
  aaaLarge: 4.5,
} as const;

export interface WcagResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

/**
 * Converts RGB to 6-digit HEX.
 */
export function rgbToHex(rgb: Rgb): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Parses a hex color string to RGB. Supports #RGB and #RRGGBB.
 */
export function hexToRgb(hex: string): Rgb | null {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

/**
 * Computes relative luminance (0–1) per WCAG 2.1 sRGB formula.
 */
export function relativeLuminance(rgb: Rgb): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes contrast ratio (1–21) per WCAG 2.1.
 * Lighter luminance first, darker second.
 */
export function contrastRatio(l1: number, l2: number): number {
  const [light, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Returns WCAG pass/fail for text/background pair.
 */
export function checkWcag(textRgb: Rgb, bgRgb: Rgb): WcagResult {
  const lText = relativeLuminance(textRgb);
  const lBg = relativeLuminance(bgRgb);
  const ratio = contrastRatio(lText, lBg);

  return {
    ratio,
    aaNormal: ratio >= WCAG_RATIOS.aaNormal,
    aaLarge: ratio >= WCAG_RATIOS.aaLarge,
    aaaNormal: ratio >= WCAG_RATIOS.aaaNormal,
    aaaLarge: ratio >= WCAG_RATIOS.aaaLarge,
  };
}

/**
 * Formats contrast ratio for display (e.g. "4.52:1").
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
