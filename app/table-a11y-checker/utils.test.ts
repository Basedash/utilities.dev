import { describe, test, expect } from "vitest";
import { checkTableA11y } from "./utils";

describe("table-a11y-checker utils", () => {
  describe("checkTableA11y", () => {
    test("returns empty findings for empty input", () => {
      const result = checkTableA11y("");
      expect(result.findings).toEqual([]);
      expect(result.summary).toEqual({ total: 0, errors: 0, warnings: 0 });
    });

    test("detects table without caption", () => {
      const html = "<table><tr><td>Data</td></tr></table>";
      const result = checkTableA11y(html);
      const missingCaption = result.findings.find((f) => f.type === "missing-caption");
      expect(missingCaption).toBeDefined();
      expect(missingCaption).toMatchObject({
        type: "missing-caption",
        severity: "warning",
      });
    });

    test("passes table with caption", () => {
      const html = "<table><caption>Sales</caption><tr><th>Q1</th><td>10</td></tr></table>";
      const result = checkTableA11y(html);
      expect(result.findings.filter((f) => f.type === "missing-caption")).toHaveLength(0);
    });

    test("detects table without th", () => {
      const html = "<table><tr><td>A</td><td>B</td></tr></table>";
      const result = checkTableA11y(html);
      expect(result.findings).toHaveLength(2);
      const missingTh = result.findings.find((f) => f.type === "missing-th");
      expect(missingTh).toBeDefined();
      expect(missingTh?.severity).toBe("error");
    });

    test("passes table with th", () => {
      const html = "<table><tr><th>Name</th><th>Value</th></tr><tr><td>A</td><td>1</td></tr></table>";
      const result = checkTableA11y(html);
      expect(result.findings.filter((f) => f.type === "missing-th")).toHaveLength(0);
    });

    test("detects th without scope", () => {
      const html = "<table><tr><th>Name</th><th>Value</th></tr><tr><td>A</td><td>1</td></tr></table>";
      const result = checkTableA11y(html);
      const scopeFinding = result.findings.find((f) => f.type === "th-without-scope");
      expect(scopeFinding).toBeDefined();
      expect(scopeFinding?.message).toContain("scope");
    });

    test("passes th with scope", () => {
      const html =
        '<table><tr><th scope="col">Name</th><th scope="col">Value</th></tr><tr><td>A</td><td>1</td></tr></table>';
      const result = checkTableA11y(html);
      expect(result.findings.filter((f) => f.type === "th-without-scope")).toHaveLength(0);
    });

    test("reports table index for multiple tables", () => {
      const html =
        "<table><tr><td>1</td></tr></table><table><tr><td>2</td></tr></table>";
      const result = checkTableA11y(html);
      const withIndex = result.findings.filter((f) => f.tableIndex !== undefined);
      expect(withIndex.length).toBeGreaterThan(0);
      expect(withIndex.some((f) => f.tableIndex === 1)).toBe(true);
      expect(withIndex.some((f) => f.tableIndex === 2)).toBe(true);
    });

    test("summary counts are correct", () => {
      const html = "<table><tr><td>A</td></tr></table>";
      const result = checkTableA11y(html);
      expect(result.summary.total).toBeGreaterThanOrEqual(1);
      expect(result.summary.errors + result.summary.warnings).toBe(result.summary.total);
    });

    test("is deterministic for same input", () => {
      const html = "<table><tr><th>X</th><td>Y</td></tr></table>";
      const a = checkTableA11y(html);
      const b = checkTableA11y(html);
      expect(a.findings).toEqual(b.findings);
      expect(a.summary).toEqual(b.summary);
    });

    test("empty table (no td) does not report missing-th", () => {
      const html = "<table></table>";
      const result = checkTableA11y(html);
      expect(result.findings.filter((f) => f.type === "missing-th")).toHaveLength(0);
    });
  });
});
