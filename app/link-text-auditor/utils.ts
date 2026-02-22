/**
 * Pure utilities for link text accessibility auditing.
 * Flags generic link text, empty text, and duplicate link names to different hrefs.
 */

export type FindingSeverity = "error" | "warning";

export interface LinkFinding {
  type: "generic-text" | "empty-text" | "duplicate-name-different-href";
  severity: FindingSeverity;
  message: string;
  href?: string;
  text?: string;
}

export interface LinkAuditResult {
  findings: LinkFinding[];
  summary: { total: number; errors: number; warnings: number };
}

const GENERIC_PATTERNS = [
  /^click\s+here$/i,
  /^read\s+more$/i,
  /^learn\s+more$/i,
  /^here$/i,
  /^link$/i,
  /^this\s+link$/i,
  /^more$/i,
  /^continue$/i,
  /^submit$/i,
  /^go\s+to$/i,
  /^see\s+more$/i,
  /^details?$/i,
  /^link\s+to\s+.+$/i,
];

function extractLinks(html: string): Array<{ href: string; text: string }> {
  const results: Array<{ href: string; text: string }> = [];
  const regex = /<a\s+[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1].trim();
    const rawText = (match[2] || "").replace(/<[^>]+>/g, "").trim();
    const text = rawText.replace(/\s+/g, " ").trim();
    results.push({ href, text });
  }
  return results;
}

function isGenericText(text: string): boolean {
  const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
  if (!normalized) return false;
  return GENERIC_PATTERNS.some((p) => p.test(normalized));
}

function findDuplicateNamesDifferentHrefs(
  links: Array<{ href: string; text: string }>
): Array<{ text: string; hrefs: string[] }> {
  const byText = new Map<string, Set<string>>();
  for (const { href, text } of links) {
    const t = text.trim().toLowerCase();
    if (!t) continue;
    if (!byText.has(t)) byText.set(t, new Set());
    byText.get(t)!.add(href);
  }
  const duplicates: Array<{ text: string; hrefs: string[] }> = [];
  for (const [text, hrefSet] of byText) {
    if (hrefSet.size > 1) {
      duplicates.push({ text, hrefs: [...hrefSet] });
    }
  }
  return duplicates;
}

/**
 * Audits HTML links for accessibility issues.
 * Flags generic text, empty text, and duplicate names with different hrefs.
 */
export function auditLinkText(html: string): LinkAuditResult {
  const findings: LinkFinding[] = [];
  const normalizedHtml = html.trim();
  if (!normalizedHtml) return { findings: [], summary: { total: 0, errors: 0, warnings: 0 } };

  const links = extractLinks(normalizedHtml);

  for (const { href, text } of links) {
    if (!text) {
      findings.push({
        type: "empty-text",
        severity: "error",
        message: "Link has no accessible text. Screen readers cannot determine its purpose.",
        href,
      });
    } else if (isGenericText(text)) {
      findings.push({
        type: "generic-text",
        severity: "warning",
        message: `Generic link text "${text}" provides little context. Use descriptive text that explains the destination.`,
        href,
        text,
      });
    }
  }

  const duplicates = findDuplicateNamesDifferentHrefs(links);
  for (const { text, hrefs } of duplicates) {
    findings.push({
      type: "duplicate-name-different-href",
      severity: "warning",
      message: `Link text "${text}" is used for ${hrefs.length} different URLs. Screen reader users may not distinguish them.`,
      text,
    });
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  return {
    findings,
    summary: { total: findings.length, errors, warnings },
  };
}
