import { describe, test, expect } from "vitest";
import { auditLinkText } from "./utils";

describe("link-text-auditor utils", () => {
  describe("auditLinkText", () => {
    test("returns empty findings for empty input", () => {
      const result = auditLinkText("");
      expect(result.findings).toEqual([]);
      expect(result.summary).toEqual({ total: 0, errors: 0, warnings: 0 });
    });

    test("detects empty link text", () => {
      const html = '<a href="/page">  </a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0]).toMatchObject({
        type: "empty-text",
        severity: "error",
        message: expect.stringContaining("no accessible text"),
      });
    });

    test("detects link with only nested elements and no text", () => {
      const html = '<a href="/page"><span class="icon"></span></a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("empty-text");
    });

    test("passes link with descriptive text", () => {
      const html = '<a href="/docs">View documentation</a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(0);
    });

    test("flags generic 'click here'", () => {
      const html = '<a href="/page">Click here</a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0]).toMatchObject({
        type: "generic-text",
        severity: "warning",
        text: "Click here",
      });
    });

    test("flags generic 'read more'", () => {
      const html = '<a href="/article">Read more</a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("generic-text");
    });

    test("flags generic 'learn more'", () => {
      const html = '<a href="/product">Learn more</a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("generic-text");
    });

    test("flags generic 'here'", () => {
      const html = '<a href="/x">here</a>';
      const result = auditLinkText(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("generic-text");
    });

    test("flags duplicate link names with different hrefs", () => {
      const html = '<a href="/a">Product info</a><a href="/b">Product info</a>';
      const result = auditLinkText(html);
      const dup = result.findings.find((f) => f.type === "duplicate-name-different-href");
      expect(dup).toBeDefined();
      expect(dup).toMatchObject({
        type: "duplicate-name-different-href",
        severity: "warning",
      });
      expect(dup?.message).toContain("product info");
    });

    test("does not flag same href with same text", () => {
      const html = '<a href="/a">Product info</a><a href="/a">Product info</a>';
      const result = auditLinkText(html);
      const dup = result.findings.filter((f) => f.type === "duplicate-name-different-href");
      expect(dup).toHaveLength(0);
    });

    test("summary counts are correct", () => {
      const html = '<a href="/1"></a><a href="/2">Click here</a>';
      const result = auditLinkText(html);
      expect(result.summary.total).toBe(2);
      expect(result.summary.errors).toBe(1);
      expect(result.summary.warnings).toBe(1);
    });

    test("is deterministic for same input", () => {
      const html = '<a href="/x">Click here</a>';
      const a = auditLinkText(html);
      const b = auditLinkText(html);
      expect(a.findings).toEqual(b.findings);
      expect(a.summary).toEqual(b.summary);
    });

    test("extracts text from nested elements", () => {
      const html = '<a href="/x"><span>Descriptive</span> text</a>';
      const result = auditLinkText(html);
      expect(result.findings.filter((f) => f.type === "empty-text")).toHaveLength(0);
    });
  });
});
