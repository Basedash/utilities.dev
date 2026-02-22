import { describe, test, expect } from "vitest";
import { validateXml, formatXml, minifyXml } from "./utils";

describe("XML Formatter Utils", () => {
  describe("validateXml", () => {
    test("validates well-formed XML", () => {
      const result = validateXml("<root><child>value</child></root>");
      expect(result.isValid).toBe(true);
    });

    test("validates XML with declaration", () => {
      const result = validateXml(
        '<?xml version="1.0"?><root><a>1</a></root>'
      );
      expect(result.isValid).toBe(true);
    });

    test("validates XML with attributes", () => {
      const result = validateXml('<root id="1"><child name="test"/></root>');
      expect(result.isValid).toBe(true);
    });

    test("handles empty string as valid", () => {
      const result = validateXml("");
      expect(result.isValid).toBe(true);
    });

    test("handles whitespace-only as valid", () => {
      const result = validateXml("   \n  \t  ");
      expect(result.isValid).toBe(true);
    });

    test("rejects unclosed tags", () => {
      const result = validateXml("<root><child>value</root>");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("rejects malformed XML", () => {
      const result = validateXml("<root><child></root>");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("rejects invalid structure", () => {
      const result = validateXml("not xml at all");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("formatXml", () => {
    test("formats minified XML with indentation", () => {
      const input = "<root><a>1</a><b>2</b></root>";
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("<root>");
      expect(result.result).toContain("<a>");
      expect(result.result).toContain("<b>");
      expect(result.result).toMatch(/\s+<a>/);
    });

    test("formats with custom indent", () => {
      const input = "<root><a>1</a></root>";
      const result = formatXml(input, 4);

      expect(result.success).toBe(true);
      expect(result.result).toContain("    <a>");
    });

    test("handles empty string", () => {
      const result = formatXml("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for invalid XML", () => {
      const result = formatXml("<root><unclosed></root>");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.result).toBe("");
    });

    test("preserves XML content", () => {
      const input = "<root><child>hello</child></root>";
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("hello");
    });

    test("handles self-closing tags", () => {
      const input = "<root><br/><img src='x'/></root>";
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("<br/>");
      expect(result.result).toContain("<img");
    });
  });

  describe("minifyXml", () => {
    test("removes unnecessary whitespace", () => {
      const input = `<root>
  <a>1</a>
  <b>2</b>
</root>`;
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.result).not.toContain("\n  ");
      expect(result.result).toContain("<root>");
      expect(result.result).toContain("<a>1</a>");
    });

    test("handles already minified XML", () => {
      const input = "<root><a>1</a></root>";
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("<root><a>1</a></root>");
    });

    test("handles empty string", () => {
      const result = minifyXml("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for invalid XML", () => {
      const result = minifyXml("<broken><xml>");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("preserves text content", () => {
      const input = "<root>  <x>  value  </x>  </root>";
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("value");
    });
  });

  describe("round-trip", () => {
    test("format then minify preserves structure", () => {
      const original = "<root><a>1</a><b>2</b></root>";
      const formatted = formatXml(original);
      expect(formatted.success).toBe(true);

      const minified = minifyXml(formatted.result);
      expect(minified.success).toBe(true);
      expect(minified.result).toContain("<root>");
      expect(minified.result).toContain("<a>");
      expect(minified.result).toContain("1");
      expect(minified.result).toContain("<b>");
      expect(minified.result).toContain("2");
    });

    test("minify then format produces readable output", () => {
      const minified = "<root><a>1</a><b>2</b></root>";
      const formatted = formatXml(minified);
      expect(formatted.success).toBe(true);
      expect(formatted.result.split("\n").length).toBeGreaterThan(1);
    });
  });
});
