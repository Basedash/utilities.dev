/**
 * Pure utilities for table accessibility checking.
 * Checks caption presence, th usage, and scope/header associations.
 */

export type FindingSeverity = "error" | "warning";

export interface TableFinding {
  type: "missing-caption" | "missing-th" | "th-without-scope" | "td-headers-mismatch";
  severity: FindingSeverity;
  message: string;
  tableIndex?: number;
}

export interface TableA11yResult {
  findings: TableFinding[];
  summary: { total: number; errors: number; warnings: number };
}

function extractTables(html: string): string[] {
  const tables: string[] = [];
  const regex = /<table[\s>][\s\S]*?<\/table>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    tables.push(match[0]);
  }
  return tables;
}

function hasCaption(tableHtml: string): boolean {
  return /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableHtml);
}

function hasTh(tableHtml: string): boolean {
  return /<th[\s>]/i.test(tableHtml);
}

function countTh(tableHtml: string): number {
  const regex = /<th[\s>]/gi;
  let count = 0;
  while (regex.exec(tableHtml) !== null) count++;
  return count;
}

function countTd(tableHtml: string): number {
  const regex = /<td[\s>]/gi;
  let count = 0;
  while (regex.exec(tableHtml) !== null) count++;
  return count;
}

function thWithScope(tableHtml: string): number {
  const regex = /<th[\s>][^<]*>/gi;
  let withScope = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(tableHtml)) !== null) {
    if (/\bscope\s*=\s*["'](col|row|colgroup|rowgroup)["']/i.test(match[0])) {
      withScope++;
    }
  }
  return withScope;
}

function thWithoutScope(tableHtml: string): number {
  const thCount = countTh(tableHtml);
  const withScope = thWithScope(tableHtml);
  return Math.max(0, thCount - withScope);
}

function tdWithHeaders(tableHtml: string): number {
  const regex = /<td[^>]*\bheaders\s*=\s*["'][^"']*["']/gi;
  let count = 0;
  while (regex.exec(tableHtml) !== null) count++;
  return count;
}

/**
 * Analyzes HTML tables for accessibility issues.
 * Checks caption presence, th usage, scope on th, and headers on td.
 */
export function checkTableA11y(html: string): TableA11yResult {
  const findings: TableFinding[] = [];
  const normalizedHtml = html.trim();
  if (!normalizedHtml) return { findings: [], summary: { total: 0, errors: 0, warnings: 0 } };

  const tables = extractTables(normalizedHtml);

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (!hasCaption(table)) {
      findings.push({
        type: "missing-caption",
        severity: "warning",
        message: "Table has no <caption>. Add a caption to describe the table's purpose.",
        tableIndex: i + 1,
      });
    }

    if (!hasTh(table)) {
      const tdCount = countTd(table);
      if (tdCount > 0) {
        findings.push({
          type: "missing-th",
          severity: "error",
          message:
            "Table has no <th> cells. Use <th> for column or row headers so screen readers can associate data with headers.",
          tableIndex: i + 1,
        });
      }
    } else {
      const withoutScope = thWithoutScope(table);
      if (withoutScope > 0) {
        findings.push({
          type: "th-without-scope",
          severity: "warning",
          message: `${withoutScope} <th> cell(s) missing scope attribute. Add scope="col" or scope="row" to clarify header association.`,
          tableIndex: i + 1,
        });
      }

      const numTd = countTd(table);
      const tdWithHeadersCount = tdWithHeaders(table);
      if (numTd > 0 && tdWithHeadersCount === 0 && countTh(table) > 0) {
        findings.push({
          type: "td-headers-mismatch",
          severity: "warning",
          message:
            "Data cells have no headers attribute. For complex tables, add headers to <td> to associate with specific <th> cells.",
          tableIndex: i + 1,
        });
      }
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  return {
    findings,
    summary: { total: findings.length, errors, warnings },
  };
}
