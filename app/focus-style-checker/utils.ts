/**
 * Pure utilities for checking CSS focus styles.
 * Flags patterns that remove outlines without visible replacement.
 */

export interface FocusStyleIssue {
  type: "outline-removed" | "outline-none-without-replacement";
  message: string;
  selector: string;
  line: number;
  snippet: string;
}

export interface FocusStyleResult {
  issues: FocusStyleIssue[];
  hasFocusStyles: boolean;
  valid: boolean;
}

/** Patterns that indicate a visible focus replacement (border, box-shadow, background, etc.). */
const VISIBLE_REPLACEMENT_PATTERNS = [
  /\b(border|border-width|border-color|border-style)\s*:/i,
  /\bbox-shadow\s*:/i,
  /\bbackground(-color)?\s*:/i,
  /\boutline\s*:\s*(?!none|0)\S/i,
  /\boutline-width\s*:\s*(?!0)\S/i,
  /\boutline-color\s*:/i,
  /\boutline-style\s*:\s*(?!none)\S/i,
];

/** Check if a declaration block has a visible focus replacement. */
function hasVisibleReplacement(block: string): boolean {
  return VISIBLE_REPLACEMENT_PATTERNS.some((re) => re.test(block));
}

/** Check if outline is removed (outline: none, outline: 0, outline-width: 0). */
function removesOutline(block: string): boolean {
  return (
    /\boutline\s*:\s*(none|0)\b/i.test(block) ||
    /\boutline\s*:\s*0\s+0\s+0\b/i.test(block) ||
    /\boutline-width\s*:\s*0\b/i.test(block) ||
    /\boutline\s*:\s*unset\b/i.test(block) ||
    /\boutline\s*:\s*initial\b/i.test(block)
  );
}

/**
 * Extracts :focus and :focus-visible rule blocks from CSS.
 */
export function extractFocusRules(css: string): Array<{ selector: string; block: string; line: number; fullMatch: string }> {
  const results: Array<{ selector: string; block: string; line: number; fullMatch: string }> = [];
  const normalized = css.replace(/\r\n/g, "\n");
  const blockRegex = /([^{}\n]*:focus(?:-visible)?[^{}\n]*)\s*\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(normalized)) !== null) {
    const selector = match[1].trim();
    const block = match[2];
    const lineNum = normalized.slice(0, match.index).split("\n").length;
    results.push({
      selector,
      block,
      line: lineNum,
      fullMatch: match[0],
    });
  }
  return results;
}

/**
 * Validates CSS for focus style issues.
 */
export function checkFocusStyles(css: string): FocusStyleResult {
  const issues: FocusStyleIssue[] = [];
  const focusRules = extractFocusRules(css);

  for (const { selector, block, line, fullMatch } of focusRules) {
    if (removesOutline(block) && !hasVisibleReplacement(block)) {
      issues.push({
        type: "outline-none-without-replacement",
        message:
          "Outline is removed without a visible focus indicator. Add border, box-shadow, or another visible style for keyboard users.",
        selector,
        line,
        snippet: fullMatch.slice(0, 120) + (fullMatch.length > 120 ? "…" : ""),
      });
    }
  }

  const outlineRemovalRegex = /\boutline\s*:\s*(none|0)\b|\boutline-width\s*:\s*0\b/gi;
  const outlineRemovals = css.match(outlineRemovalRegex) || [];
  const hasFocusRules = focusRules.length > 0;
  const hasGlobalOutlineRemoval = outlineRemovals.length > 0 && !hasFocusRules;

  if (hasGlobalOutlineRemoval) {
    const lines = css.split("\n");
    const outlinePattern = /\boutline\s*:\s*(none|0)\b|\boutline-width\s*:\s*0\b/i;
    const lineIdx = lines.findIndex((l) => outlinePattern.test(l));
    const lineNum = lineIdx >= 0 ? lineIdx + 1 : 1;
    issues.push({
      type: "outline-removed",
      message:
        "Outline is removed globally. Ensure focusable elements have a visible focus indicator.",
      selector: "*",
      line: lineNum,
      snippet: "outline: none or outline-width: 0",
    });
  }

  return {
    issues,
    hasFocusStyles: focusRules.length > 0,
    valid: issues.length === 0,
  };
}
