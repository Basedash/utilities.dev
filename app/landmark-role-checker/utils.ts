/**
 * Pure utilities for landmark and ARIA role analysis in HTML snippets.
 * Detects presence and duplicates of common landmarks.
 */

export type LandmarkSource = "element" | "aria";

export interface LandmarkFinding {
  type: string;
  source: LandmarkSource;
  count: number;
  status: "ok" | "missing" | "duplicate";
  message: string;
}

export interface LandmarkRoleResult {
  landmarks: LandmarkFinding[];
  summary: {
    present: number;
    missing: string[];
    duplicates: string[];
  };
}

const SEMANTIC_ELEMENTS = ["header", "nav", "main", "footer", "aside"] as const;

const ARIA_LANDMARK_ROLES = [
  "banner",
  "navigation",
  "main",
  "contentinfo",
  "complementary",
  "region",
  "search",
  "form",
] as const;

const ELEMENT_TO_ROLE: Record<string, string> = {
  header: "banner",
  nav: "navigation",
  main: "main",
  footer: "contentinfo",
  aside: "complementary",
};

/**
 * Counts occurrences of semantic elements (header, nav, main, footer, aside).
 */
function countSemanticElements(html: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tag of SEMANTIC_ELEMENTS) {
    const re = new RegExp(`<${tag}(?:\\s|>|/)`, "gi");
    const matches = html.match(re);
    counts.set(tag, matches ? matches.length : 0);
  }
  return counts;
}

/**
 * Counts occurrences of role="..." for landmark roles.
 */
function countAriaLandmarks(html: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const role of ARIA_LANDMARK_ROLES) {
    const re = new RegExp(
      `(?<![a-zA-Z-])role\\s*=\\s*["']${role}["']`,
      "gi"
    );
    const matches = html.match(re);
    counts.set(role, matches ? matches.length : 0);
  }
  return counts;
}

/**
 * Analyzes HTML for landmark presence and duplicates.
 */
export function analyzeLandmarks(html: string): LandmarkRoleResult {
  const landmarks: LandmarkFinding[] = [];
  const elementCounts = countSemanticElements(html);
  const ariaCounts = countAriaLandmarks(html);

  const missing: string[] = [];
  const duplicates: string[] = [];

  for (const tag of SEMANTIC_ELEMENTS) {
    const count = elementCounts.get(tag) ?? 0;
    let status: "ok" | "missing" | "duplicate";
    let message: string;

    if (count === 0) {
      status = "missing";
      message = `No <${tag}> element found`;
      missing.push(`<${tag}>`);
    } else if (count > 1) {
      status = "duplicate";
      message = `<${tag}> appears ${count} times`;
      duplicates.push(`<${tag}>`);
    } else {
      status = "ok";
      message = `<${tag}> present`;
    }

    landmarks.push({
      type: tag,
      source: "element",
      count,
      status,
      message,
    });
  }

  for (const role of ARIA_LANDMARK_ROLES) {
    const count = ariaCounts.get(role) ?? 0;
    const elementTag = Object.entries(ELEMENT_TO_ROLE).find(
      ([, r]) => r === role
    )?.[0];

    let status: "ok" | "missing" | "duplicate";
    let message: string;

    if (count === 0) {
      status = "missing";
      message = `No role="${role}" found`;
      if (!elementTag || (elementCounts.get(elementTag) ?? 0) === 0) {
        missing.push(`role="${role}"`);
      }
    } else if (count > 1) {
      status = "duplicate";
      message = `role="${role}" appears ${count} times`;
      duplicates.push(`role="${role}"`);
    } else {
      status = "ok";
      message = `role="${role}" present`;
    }

    landmarks.push({
      type: role,
      source: "aria",
      count,
      status,
      message,
    });
  }

  const present = landmarks.filter((l) => l.count > 0).length;

  return {
    landmarks,
    summary: {
      present,
      missing: [...new Set(missing)],
      duplicates: [...new Set(duplicates)],
    },
  };
}
