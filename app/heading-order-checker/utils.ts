/**
 * Pure utilities for heading order analysis in HTML snippets.
 * Detects heading level jumps, multiple h1, and missing h1.
 */

export type FindingSeverity = "error" | "warning";

export interface HeadingFinding {
  type: "multiple-h1" | "missing-h1" | "level-jump";
  severity: FindingSeverity;
  message: string;
  detail?: string;
}

export interface HeadingOrderResult {
  headings: { level: number; text: string }[];
  findings: HeadingFinding[];
  hasH1: boolean;
  h1Count: number;
}

const HEADING_REGEX = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;

/**
 * Extracts heading elements (h1–h6) from HTML in document order.
 */
export function extractHeadings(html: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  let match: RegExpExecArray | null;

  const re = new RegExp(HEADING_REGEX.source, "gi");
  while ((match = re.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = (match[2] ?? "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    headings.push({ level, text });
  }

  return headings;
}

/**
 * Analyzes heading structure and returns findings for accessibility issues.
 */
export function analyzeHeadingOrder(html: string): HeadingOrderResult {
  const headings = extractHeadings(html);
  const findings: HeadingFinding[] = [];

  const h1Count = headings.filter((h) => h.level === 1).length;

  if (headings.length === 0) {
    if (html.trim() !== "") {
      findings.push({
        type: "missing-h1",
        severity: "error",
        message: "No h1 heading found",
        detail: "Pages should have exactly one h1 for document structure and screen readers.",
      });
    }
    return {
      headings: [],
      findings,
      hasH1: false,
      h1Count: 0,
    };
  }

  if (h1Count === 0) {
    findings.push({
      type: "missing-h1",
      severity: "error",
      message: "No h1 heading found",
      detail: "Pages should have exactly one h1 for document structure and screen readers.",
    });
  } else if (h1Count > 1) {
    findings.push({
      type: "multiple-h1",
      severity: "warning",
      message: `Multiple h1 headings found (${h1Count})`,
      detail: "Consider using a single h1 for the main page title.",
    });
  }

  let prevLevel = 0;
  for (let i = 0; i < headings.length; i++) {
    const { level } = headings[i];
    if (prevLevel > 0 && level > prevLevel + 1) {
      findings.push({
        type: "level-jump",
        severity: "warning",
        message: `Heading level jump from h${prevLevel} to h${level}`,
        detail: `At heading "${headings[i].text.slice(0, 40)}${headings[i].text.length > 40 ? "…" : ""}". Headings should not skip levels (e.g. h2 → h4).`,
      });
    }
    prevLevel = level;
  }

  return {
    headings,
    findings,
    hasH1: h1Count > 0,
    h1Count,
  };
}
