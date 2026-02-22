/**
 * Pure utilities for validating ARIA attributes in HTML snippets.
 * Detects invalid aria-* names, malformed ID references, and role+aria mismatches.
 */

/** Valid WAI-ARIA 1.2 attributes (states and properties). */
export const VALID_ARIA_ATTRIBUTES = new Set([
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
]);

/** Attributes that require space-separated ID references. */
const ID_REF_ATTRIBUTES = new Set([
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-activedescendant",
  "aria-owns",
  "aria-flowto",
  "aria-details",
  "aria-errormessage",
]);

/** Roles that require aria-label or aria-labelledby when no accessible name. */
const ROLES_REQUIRING_LABEL = new Set([
  "button",
  "checkbox",
  "combobox",
  "grid",
  "gridcell",
  "listbox",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox",
  "treeitem",
]);

export interface AriaValidationIssue {
  type: "invalid-attribute" | "malformed-id-ref" | "role-label-mismatch";
  message: string;
  attribute?: string;
  snippet?: string;
  line?: number;
}

export interface AriaValidationResult {
  issues: AriaValidationIssue[];
  valid: boolean;
}

/**
 * Extracts all aria-* attributes from HTML string.
 */
export function extractAriaAttributes(html: string): Array<{ name: string; value: string; snippet: string; line: number }> {
  const results: Array<{ name: string; value: string; snippet: string; line: number }> = [];
  const ariaRegex = /\baria-[a-z-]+/gi;
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match: RegExpExecArray | null;
    const re = new RegExp(ariaRegex.source, "gi");
    while ((match = re.exec(line)) !== null) {
      const attrName = match[0].toLowerCase();
      const valueMatch = line.slice(match.index).match(/=\s*["']([^"']*)["']/);
      const value = valueMatch ? valueMatch[1] : "";
      const snippet = line.trim().slice(0, 80) + (line.trim().length > 80 ? "…" : "");
      results.push({ name: attrName, value, snippet, line: i + 1 });
    }
  }
  return results;
}

/**
 * Extracts role attributes and their elements.
 */
function extractRoles(html: string): Array<{ role: string; hasLabel: boolean; hasLabelledBy: boolean; snippet: string; line: number }> {
  const results: Array<{ role: string; hasLabel: boolean; hasLabelledBy: boolean; snippet: string; line: number }> = [];
  const roleRegex = /\brole\s*=\s*["']([^"']+)["']/gi;
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match: RegExpExecArray | null;
    const re = new RegExp(roleRegex.source, "g");
    while ((match = re.exec(line)) !== null) {
      const role = match[1].toLowerCase().trim();
      const hasLabel = /\baria-label\s*=/i.test(line);
      const hasLabelledBy = /\baria-labelledby\s*=/i.test(line);
      const snippet = line.trim().slice(0, 80) + (line.trim().length > 80 ? "…" : "");
      results.push({ role, hasLabel, hasLabelledBy, snippet, line: i + 1 });
    }
  }
  return results;
}

/**
 * Validates that an ID reference string contains valid ID tokens (alphanumeric, hyphen, underscore).
 */
function isValidIdRefList(value: string): boolean {
  if (!value.trim()) return false;
  const tokens = value.trim().split(/\s+/);
  const idTokenRegex = /^[a-zA-Z][a-zA-Z0-9_-]*$|^[a-zA-Z0-9_-]+$/;
  return tokens.every((t) => t.length > 0 && idTokenRegex.test(t));
}

/**
 * Validates HTML snippet for ARIA misuse.
 */
export function validateAriaAttributes(html: string): AriaValidationResult {
  const issues: AriaValidationIssue[] = [];

  const ariaAttrs = extractAriaAttributes(html);
  for (const { name, value, snippet, line } of ariaAttrs) {
    if (!VALID_ARIA_ATTRIBUTES.has(name)) {
      issues.push({
        type: "invalid-attribute",
        message: `Invalid ARIA attribute: "${name}" is not a valid WAI-ARIA attribute.`,
        attribute: name,
        snippet,
        line,
      });
    }

    if (ID_REF_ATTRIBUTES.has(name) && value.trim()) {
      if (!isValidIdRefList(value)) {
        issues.push({
          type: "malformed-id-ref",
          message: `Malformed ID reference in "${name}": values must be space-separated valid ID tokens.`,
          attribute: name,
          snippet,
          line,
        });
      }
    }
  }

  const roles = extractRoles(html);
  for (const { role, hasLabel, hasLabelledBy, snippet, line } of roles) {
    if (ROLES_REQUIRING_LABEL.has(role) && !hasLabel && !hasLabelledBy) {
      issues.push({
        type: "role-label-mismatch",
        message: `Role "${role}" typically requires aria-label or aria-labelledby for an accessible name.`,
        attribute: "role",
        snippet,
        line,
      });
    }
  }

  return {
    issues,
    valid: issues.length === 0,
  };
}
