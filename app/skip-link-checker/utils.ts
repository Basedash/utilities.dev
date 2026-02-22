/**
 * Pure utilities for checking skip link patterns in HTML.
 * Detects skip links (href="#main" etc.) and verifies target presence.
 */

export interface SkipLink {
  href: string;
  targetId: string;
  snippet: string;
  line: number;
}

export interface SkipLinkTarget {
  id: string;
  tagName: string;
  snippet: string;
  line: number;
}

export interface SkipLinkResult {
  skipLinks: SkipLink[];
  targets: SkipLinkTarget[];
  orphanedSkipLinks: SkipLink[];
  missingTargets: string[];
  valid: boolean;
}

/** Extract hash from href (e.g. "#main" -> "main", "#" -> ""). */
function hrefToId(href: string): string {
  const hash = href.trim();
  if (hash.startsWith("#")) {
    return hash.slice(1).trim();
  }
  return "";
}

/** Check if href looks like a skip link (same-page anchor). */
function isSkipLinkHref(href: string): boolean {
  const id = hrefToId(href);
  return id.length > 0 && !href.includes("://") && !href.startsWith("//");
}

/**
 * Extracts skip link patterns from HTML (a[href="#id"]).
 */
export function extractSkipLinks(html: string): SkipLink[] {
  const results: SkipLink[] = [];
  const linkRegex = /<a\s+([^>]*?)>/gi;
  const hrefRegex = /\bhref\s*=\s*["']([^"']+)["']/i;
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match: RegExpExecArray | null;
    const re = new RegExp(linkRegex.source, "g");
    while ((match = re.exec(line)) !== null) {
      const attrs = match[1];
      const hrefMatch = attrs.match(hrefRegex);
      if (hrefMatch) {
        const href = hrefMatch[1].trim();
        if (isSkipLinkHref(href)) {
          const targetId = hrefToId(href);
          const snippet = match[0].slice(0, 80) + (match[0].length > 80 ? "…" : "");
          results.push({
            href,
            targetId,
            snippet,
            line: i + 1,
          });
        }
      }
    }
  }
  return results;
}

/**
 * Extracts elements with id attributes (potential skip targets).
 */
export function extractTargets(html: string): SkipLinkTarget[] {
  const results: SkipLinkTarget[] = [];
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)\s[^>]*\bid\s*=\s*["']([^"']+)["']/gi;
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match: RegExpExecArray | null;
    const re = new RegExp(tagRegex.source, "g");
    while ((match = re.exec(line)) !== null) {
      const tagName = match[1].toLowerCase();
      const id = match[2];
      const snippet = match[0].slice(0, 80) + (match[0].length > 80 ? "…" : "");
      results.push({
        id,
        tagName,
        snippet,
        line: i + 1,
      });
    }
  }
  return results;
}

/**
 * Validates HTML for skip link patterns and target presence.
 */
export function checkSkipLinks(html: string): SkipLinkResult {
  const skipLinks = extractSkipLinks(html);
  const targets = extractTargets(html);
  const targetIds = new Set(targets.map((t) => t.id));

  const missingTargets: string[] = [];
  const orphanedSkipLinks: SkipLink[] = [];

  for (const link of skipLinks) {
    if (!targetIds.has(link.targetId)) {
      missingTargets.push(link.targetId);
      orphanedSkipLinks.push(link);
    }
  }

  const valid = orphanedSkipLinks.length === 0;

  return {
    skipLinks,
    targets,
    orphanedSkipLinks,
    missingTargets: [...new Set(missingTargets)],
    valid,
  };
}
