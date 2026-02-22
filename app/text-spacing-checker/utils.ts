/**
 * WCAG 1.4.12 Text Spacing checker.
 * Minimums: line-height ≥1.5×, paragraph ≥2×, letter-spacing ≥0.12×, word-spacing ≥0.16× font size.
 */

export interface SpacingCheck {
  property: string;
  value: string;
  computedPx: number | null;
  minimumPx: number;
  pass: boolean;
  guidance: string;
}

export interface TextSpacingResult {
  fontSizePx: number;
  checks: SpacingCheck[];
  allPass: boolean;
}

const WCAG_MINIMUMS = {
  lineHeight: 1.5,
  paragraphSpacing: 2,
  letterSpacing: 0.12,
  wordSpacing: 0.16,
} as const;

const DEFAULT_FONT_SIZE_PX = 16;

/**
 * Parses a CSS length value to pixels.
 * Supports: px, em, rem. Unitless returns as-is for line-height.
 */
export function parseLengthToPx(
  value: string,
  fontSizePx: number = DEFAULT_FONT_SIZE_PX
): number | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;

  const unitless = /^(-?[\d.]+)$/;
  const pxMatch = /^(-?[\d.]+)px$/;
  const emMatch = /^(-?[\d.]+)em$/;
  const remMatch = /^(-?[\d.]+)rem$/;

  if (unitless.test(trimmed)) {
    const n = parseFloat(trimmed);
    return Number.isNaN(n) ? null : n;
  }
  if (pxMatch.test(trimmed)) {
    const n = parseFloat(trimmed);
    return Number.isNaN(n) ? null : n;
  }
  if (emMatch.test(trimmed)) {
    const n = parseFloat(trimmed);
    return Number.isNaN(n) ? null : n * fontSizePx;
  }
  if (remMatch.test(trimmed)) {
    const n = parseFloat(trimmed);
    return Number.isNaN(n) ? null : n * DEFAULT_FONT_SIZE_PX;
  }
  return null;
}

/**
 * Parses font-size from CSS string to pixels.
 */
function parseFontSize(css: string): number {
  const match = css.match(
    /font-size\s*:\s*([^;}\s]+)/gi
  );
  if (!match || match.length === 0) return DEFAULT_FONT_SIZE_PX;
  const last = match[match.length - 1];
  const value = last.replace(/font-size\s*:\s*/i, "").trim();
  const px = parseLengthToPx(value, DEFAULT_FONT_SIZE_PX);
  if (px !== null && px > 0) return px;
  return DEFAULT_FONT_SIZE_PX;
}

/**
 * Extracts the last value for a property from CSS string.
 */
function getPropertyValue(css: string, property: string): string | null {
  const regex = new RegExp(
    `${property}\\s*:\\s*([^;}\\s]+)`,
    "gi"
  );
  const match = css.match(regex);
  if (!match || match.length === 0) return null;
  const last = match[match.length - 1];
  return last.replace(new RegExp(`${property}\\s*:\\s*`, "i"), "").trim();
}

/**
 * Extracts paragraph spacing from margin-bottom or margin (shorthand).
 */
function getParagraphSpacing(css: string): string | null {
  const marginBottom = getPropertyValue(css, "margin-bottom");
  if (marginBottom) return marginBottom;
  const margin = getPropertyValue(css, "margin");
  if (margin) {
    const parts = margin.split(/\s+/);
    if (parts.length >= 2) return parts[1];
    if (parts.length === 1) return parts[0];
  }
  return null;
}

/**
 * Evaluates CSS against WCAG 1.4.12 text spacing minimums.
 */
export function checkTextSpacing(css: string): TextSpacingResult {
  const fontSizePx = parseFontSize(css);
  const checks: SpacingCheck[] = [];
  const minLineHeightPx = fontSizePx * WCAG_MINIMUMS.lineHeight;
  const minParagraphPx = fontSizePx * WCAG_MINIMUMS.paragraphSpacing;
  const minLetterPx = fontSizePx * WCAG_MINIMUMS.letterSpacing;
  const minWordPx = fontSizePx * WCAG_MINIMUMS.wordSpacing;

  const lineHeightVal = getPropertyValue(css, "line-height");
  if (lineHeightVal) {
    const parsed = parseLengthToPx(lineHeightVal, fontSizePx);
    const isUnitless = /^-?[\d.]+$/.test(lineHeightVal.trim());
    const actualPx =
      parsed !== null
        ? isUnitless
          ? parsed * fontSizePx
          : parsed
        : null;
    const pass = actualPx !== null && actualPx >= minLineHeightPx;
    checks.push({
      property: "line-height",
      value: lineHeightVal,
      computedPx: actualPx,
      minimumPx: minLineHeightPx,
      pass,
      guidance: pass
        ? `Meets WCAG minimum (≥${WCAG_MINIMUMS.lineHeight}× font size)`
        : `Below minimum. Use ≥${minLineHeightPx.toFixed(0)}px or ≥${WCAG_MINIMUMS.lineHeight} for ${fontSizePx}px font.`,
    });
  } else {
    checks.push({
      property: "line-height",
      value: "(not set)",
      computedPx: null,
      minimumPx: minLineHeightPx,
      pass: false,
      guidance: `Set line-height to ≥${minLineHeightPx.toFixed(0)}px or ≥${WCAG_MINIMUMS.lineHeight} for WCAG 1.4.12.`,
    });
  }

  const paragraphVal = getParagraphSpacing(css);
  if (paragraphVal) {
    const parsed = parseLengthToPx(paragraphVal, fontSizePx);
    const actualPx = parsed;
    const pass = actualPx !== null && actualPx >= minParagraphPx;
    checks.push({
      property: "paragraph spacing",
      value: paragraphVal,
      computedPx: actualPx,
      minimumPx: minParagraphPx,
      pass,
      guidance: pass
        ? `Meets WCAG minimum (≥${WCAG_MINIMUMS.paragraphSpacing}× font size)`
        : `Below minimum. Use ≥${minParagraphPx.toFixed(0)}px for ${fontSizePx}px font.`,
    });
  } else {
    checks.push({
      property: "paragraph spacing",
      value: "(not set)",
      computedPx: null,
      minimumPx: minParagraphPx,
      pass: false,
      guidance: `Set margin-bottom to ≥${minParagraphPx.toFixed(0)}px for paragraph spacing.`,
    });
  }

  const letterVal = getPropertyValue(css, "letter-spacing");
  if (letterVal) {
    const parsed = parseLengthToPx(letterVal, fontSizePx);
    const actualPx = parsed !== null ? Math.abs(parsed) : null;
    const pass = actualPx !== null && actualPx >= minLetterPx;
    checks.push({
      property: "letter-spacing",
      value: letterVal,
      computedPx: actualPx,
      minimumPx: minLetterPx,
      pass,
      guidance: pass
        ? `Meets WCAG minimum (≥${WCAG_MINIMUMS.letterSpacing}× font size)`
        : `Below minimum. Use ≥${minLetterPx.toFixed(2)}px for ${fontSizePx}px font.`,
    });
  } else {
    checks.push({
      property: "letter-spacing",
      value: "(not set)",
      computedPx: null,
      minimumPx: minLetterPx,
      pass: true,
      guidance: "No letter-spacing set; WCAG allows user override. Optional.",
    });
  }

  const wordVal = getPropertyValue(css, "word-spacing");
  if (wordVal) {
    const parsed = parseLengthToPx(wordVal, fontSizePx);
    const actualPx = parsed !== null ? Math.abs(parsed) : null;
    const pass = actualPx !== null && actualPx >= minWordPx;
    checks.push({
      property: "word-spacing",
      value: wordVal,
      computedPx: actualPx,
      minimumPx: minWordPx,
      pass,
      guidance: pass
        ? `Meets WCAG minimum (≥${WCAG_MINIMUMS.wordSpacing}× font size)`
        : `Below minimum. Use ≥${minWordPx.toFixed(2)}px for ${fontSizePx}px font.`,
    });
  } else {
    checks.push({
      property: "word-spacing",
      value: "(not set)",
      computedPx: null,
      minimumPx: minWordPx,
      pass: true,
      guidance: "No word-spacing set; WCAG allows user override. Optional.",
    });
  }

  const allPass = checks.every((c) => c.pass);

  return {
    fontSizePx,
    checks,
    allPass,
  };
}
