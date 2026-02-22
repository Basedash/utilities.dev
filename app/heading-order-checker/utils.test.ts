import { describe, test, expect } from "vitest";
import {
  extractHeadings,
  analyzeHeadingOrder,
} from "./utils";

describe("heading-order-checker utils", () => {
  describe("extractHeadings", () => {
    test("extracts h1–h6 in document order", () => {
      const html = "<h1>Title</h1><h2>Section</h2><h3>Sub</h3>";
      expect(extractHeadings(html)).toEqual([
        { level: 1, text: "Title" },
        { level: 2, text: "Section" },
        { level: 3, text: "Sub" },
      ]);
    });

    test("handles attributes on heading tags", () => {
      const html = '<h2 class="foo" id="bar">Section</h2>';
      expect(extractHeadings(html)).toEqual([
        { level: 2, text: "Section" },
      ]);
    });

    test("strips nested tags from heading text", () => {
      const html = "<h1><span>Title</span> <em>extra</em></h1>";
      expect(extractHeadings(html)).toEqual([
        { level: 1, text: "Title extra" },
      ]);
    });

    test("returns empty array for no headings", () => {
      expect(extractHeadings("<p>No headings</p>")).toEqual([]);
      expect(extractHeadings("")).toEqual([]);
    });

    test("handles multiple h1", () => {
      const html = "<h1>First</h1><h1>Second</h1>";
      expect(extractHeadings(html)).toEqual([
        { level: 1, text: "First" },
        { level: 1, text: "Second" },
      ]);
    });

    test("is case-sensitive for tag names (HTML5)", () => {
      const html = "<H1>Title</H1>";
      expect(extractHeadings(html)).toEqual([
        { level: 1, text: "Title" },
      ]);
    });

    test("handles multiline heading content", () => {
      const html = "<h2>Line one\n  Line two</h2>";
      expect(extractHeadings(html)).toEqual([
        { level: 2, text: "Line one Line two" },
      ]);
    });

    test("ignores malformed headings (unclosed)", () => {
      const html = "<h1>Title";
      expect(extractHeadings(html)).toEqual([]);
    });

    test("ignores mismatched closing tags", () => {
      const html = "<h1>Title</h2>";
      expect(extractHeadings(html)).toEqual([]);
    });
  });

  describe("analyzeHeadingOrder", () => {
    test("empty input returns no findings", () => {
      const result = analyzeHeadingOrder("");
      expect(result.headings).toEqual([]);
      expect(result.findings).toEqual([]);
      expect(result.hasH1).toBe(false);
      expect(result.h1Count).toBe(0);
    });

    test("no headings returns missing-h1", () => {
      const result = analyzeHeadingOrder("<p>Content</p>");
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("missing-h1");
      expect(result.findings[0].severity).toBe("error");
    });

    test("single h1 passes", () => {
      const result = analyzeHeadingOrder("<h1>Title</h1>");
      expect(result.findings).toEqual([]);
      expect(result.hasH1).toBe(true);
      expect(result.h1Count).toBe(1);
    });

    test("multiple h1 produces warning", () => {
      const result = analyzeHeadingOrder("<h1>A</h1><h1>B</h1>");
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("multiple-h1");
      expect(result.findings[0].message).toContain("2");
      expect(result.findings[0].severity).toBe("warning");
    });

    test("h2 without h1 produces missing-h1", () => {
      const result = analyzeHeadingOrder("<h2>Section</h2>");
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("missing-h1");
    });

    test("level jump h1 to h3 produces warning", () => {
      const result = analyzeHeadingOrder("<h1>Title</h1><h3>Sub</h3>");
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("level-jump");
      expect(result.findings[0].message).toContain("h1");
      expect(result.findings[0].message).toContain("h3");
    });

    test("level jump h2 to h5 produces warning", () => {
      const result = analyzeHeadingOrder("<h1>T</h1><h2>S</h2><h5>Deep</h5>");
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("level-jump");
      expect(result.findings[0].message).toContain("h2");
      expect(result.findings[0].message).toContain("h5");
    });

    test("sequential levels produce no level-jump", () => {
      const result = analyzeHeadingOrder(
        "<h1>T</h1><h2>A</h2><h3>B</h3><h4>C</h4>"
      );
      expect(result.findings.filter((f) => f.type === "level-jump")).toHaveLength(0);
    });

    test("backwards levels (h3 to h2) do not produce level-jump", () => {
      const result = analyzeHeadingOrder("<h1>T</h1><h3>A</h3><h2>B</h2>");
      expect(result.findings.filter((f) => f.type === "level-jump")).toHaveLength(1);
    });

    test("combined issues: multiple h1 and level jump", () => {
      const result = analyzeHeadingOrder("<h1>A</h1><h1>B</h1><h4>Jump</h4>");
      expect(result.findings).toHaveLength(2);
      expect(result.findings.some((f) => f.type === "multiple-h1")).toBe(true);
      expect(result.findings.some((f) => f.type === "level-jump")).toBe(true);
    });

    test("level jump detail truncates long heading text", () => {
      const longText = "A".repeat(60);
      const result = analyzeHeadingOrder(`<h1>T</h1><h4>${longText}</h4>`);
      const jumpFinding = result.findings.find((f) => f.type === "level-jump");
      expect(jumpFinding?.detail).toContain("…");
    });
  });
});
