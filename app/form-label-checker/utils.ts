/**
 * Pure utilities for form label accessibility checking.
 * Detects form controls missing labels, duplicate IDs, and unlabeled buttons.
 */

export type FindingSeverity = "error" | "warning";

export interface FormLabelFinding {
  type: "missing-label" | "duplicate-id" | "unlabeled-button";
  severity: FindingSeverity;
  message: string;
  selector?: string;
  id?: string;
}

export interface FormLabelResult {
  findings: FormLabelFinding[];
  summary: { total: number; errors: number; warnings: number };
}

const FORM_CONTROL_TAGS = ["input", "select", "textarea"];
const LABELABLE_TYPES = [
  "text", "email", "password", "search", "tel", "url", "number", "range",
  "date", "datetime-local", "month", "week", "time", "color", "checkbox", "radio",
];

function extractAttributes(html: string, tagName: string): Array<Record<string, string>> {
  const regex = new RegExp(`<${tagName}[^>]*>`, "gi");
  const results: Array<Record<string, string>> = [];
  let match: RegExpExecArray | null;
  const tagRegex = new RegExp(regex.source, "gi");
  while ((match = tagRegex.exec(html)) !== null) {
    const tagHtml = match[0];
    const attrs: Record<string, string> = {};
    const idMatch = tagHtml.match(/\bid\s*=\s*["']([^"']*)["']/i);
    const nameMatch = tagHtml.match(/\bname\s*=\s*["']([^"']*)["']/i);
    const typeMatch = tagHtml.match(/\btype\s*=\s*["']([^"']*)["']/i);
    const ariaLabelMatch = tagHtml.match(/\baria-label\s*=\s*["']([^"']*)["']/i);
    const ariaLabelledByMatch = tagHtml.match(/\baria-labelledby\s*=\s*["']([^"']*)["']/i);
    if (idMatch) attrs.id = idMatch[1].trim();
    if (nameMatch) attrs.name = nameMatch[1].trim();
    if (typeMatch) attrs.type = typeMatch[1].trim().toLowerCase();
    if (ariaLabelMatch) attrs["aria-label"] = ariaLabelMatch[1].trim();
    if (ariaLabelledByMatch) attrs["aria-labelledby"] = ariaLabelledByMatch[1].trim();
    results.push(attrs);
  }
  return results;
}

function extractLabels(html: string): Array<{ for: string }> {
  const regex = /<label[^>]*\bfor\s*=\s*["']([^"']*)["'][^>]*>/gi;
  const results: Array<{ for: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    results.push({ for: match[1].trim() });
  }
  return results;
}

function extractButtons(html: string): Array<{ text: string; hasAriaLabel: boolean }> {
  const regex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  const results: Array<{ text: string; hasAriaLabel: boolean }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const fullTag = match[0];
    const innerText = (match[1] || "").replace(/<[^>]+>/g, "").trim();
    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(fullTag);
    results.push({ text: innerText, hasAriaLabel });
  }
  return results;
}

function needsLabel(type: string | undefined, tagName: string): boolean {
  if (tagName === "textarea" || tagName === "select") return true;
  if (tagName !== "input") return false;
  if (!type || type === "text") return true;
  return LABELABLE_TYPES.includes(type);
}

function isHiddenOrSubmit(type: string | undefined): boolean {
  if (type === "hidden" || type === "submit" || type === "button" || type === "image") return true;
  return false;
}

/**
 * Analyzes HTML for form label accessibility issues.
 * Returns findings for missing labels, duplicate IDs, and unlabeled buttons.
 */
export function checkFormLabels(html: string): FormLabelResult {
  const findings: FormLabelFinding[] = [];
  const normalizedHtml = html.trim();
  if (!normalizedHtml) return { findings: [], summary: { total: 0, errors: 0, warnings: 0 } };

  const labelForIds = new Set(extractLabels(normalizedHtml).map((l) => l.for));
  const seenIds = new Map<string, number>();

  for (const tag of FORM_CONTROL_TAGS) {
    const controls = extractAttributes(normalizedHtml, tag);
    for (const attrs of controls) {
      const type = attrs.type ?? (tag === "input" ? "text" : undefined);
      if (isHiddenOrSubmit(type)) continue;
      if (!needsLabel(type, tag)) continue;

      const id = attrs.id;
      const hasLabel = id ? labelForIds.has(id) : false;
      const hasAriaLabel = !!attrs["aria-label"]?.trim();
      const hasAriaLabelledBy = !!attrs["aria-labelledby"]?.trim();

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        findings.push({
          type: "missing-label",
          severity: "error",
          message: `<${tag}${id ? ` id="${id}"` : ""}> has no associated label (use <label for="...">, aria-label, or aria-labelledby)`,
          selector: id ? `#${id}` : undefined,
          id: id || undefined,
        });
      }

      if (id) {
        const count = (seenIds.get(id) ?? 0) + 1;
        seenIds.set(id, count);
      }
    }
  }

  for (const [id, count] of seenIds) {
    if (count > 1) {
      findings.push({
        type: "duplicate-id",
        severity: "error",
        message: `Duplicate id "${id}" found ${count} times. IDs must be unique in the document.`,
        id,
      });
    }
  }

  const buttons = extractButtons(normalizedHtml);
  for (const btn of buttons) {
    if (!btn.text && !btn.hasAriaLabel) {
      findings.push({
        type: "unlabeled-button",
        severity: "error",
        message: "Button has no visible text or aria-label. Screen readers cannot determine its purpose.",
      });
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  return {
    findings,
    summary: { total: findings.length, errors, warnings },
  };
}
