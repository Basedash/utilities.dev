import { describe, test, expect } from "vitest";
import { escapeUnescape } from "./utils";

describe("Text Escape Unescape Utils", () => {
  describe("JSON mode", () => {
    test("escapes JSON string correctly", () => {
      expect(escapeUnescape("hello\nworld", "json", "escape")).toEqual({
        result: "hello\\nworld",
        success: true,
      });
      expect(escapeUnescape('say "hi"', "json", "escape")).toEqual({
        result: 'say \\"hi\\"',
        success: true,
      });
      expect(escapeUnescape("tab\there", "json", "escape")).toEqual({
        result: "tab\\there",
        success: true,
      });
      expect(escapeUnescape("back\\slash", "json", "escape")).toEqual({
        result: "back\\\\slash",
        success: true,
      });
    });

    test("unescapes JSON string correctly", () => {
      expect(escapeUnescape("hello\\nworld", "json", "unescape")).toEqual({
        result: "hello\nworld",
        success: true,
      });
      expect(escapeUnescape('say \\"hi\\"', "json", "unescape")).toEqual({
        result: 'say "hi"',
        success: true,
      });
      expect(escapeUnescape("tab\\there", "json", "unescape")).toEqual({
        result: "tab\there",
        success: true,
      });
      expect(escapeUnescape("back\\\\slash", "json", "unescape")).toEqual({
        result: "back\\slash",
        success: true,
      });
    });

    test("handles empty string", () => {
      expect(escapeUnescape("", "json", "escape")).toEqual({
        result: "",
        success: true,
      });
      expect(escapeUnescape("", "json", "unescape")).toEqual({
        result: "",
        success: true,
      });
    });

    test("handles unicode escape", () => {
      expect(escapeUnescape("\\u0041", "json", "unescape")).toEqual({
        result: "A",
        success: true,
      });
    });
  });

  describe("JavaScript mode", () => {
    test("escapes JavaScript string correctly including single quote", () => {
      expect(escapeUnescape("it's", "javascript", "escape")).toEqual({
        result: "it\\'s",
        success: true,
      });
      expect(escapeUnescape("hello\nworld", "javascript", "escape")).toEqual({
        result: "hello\\nworld",
        success: true,
      });
    });

    test("unescapes JavaScript string correctly", () => {
      expect(escapeUnescape("hello\\nworld", "javascript", "unescape")).toEqual({
        result: "hello\nworld",
        success: true,
      });
    });
  });

  describe("Regex mode", () => {
    test("escapes regex special characters", () => {
      expect(escapeUnescape("a.b", "regex", "escape")).toEqual({
        result: "a\\.b",
        success: true,
      });
      expect(escapeUnescape("(test)*", "regex", "escape")).toEqual({
        result: "\\(test\\)\\*",
        success: true,
      });
      expect(escapeUnescape("[a-z]", "regex", "escape")).toEqual({
        result: "\\[a-z\\]",
        success: true,
      });
      expect(escapeUnescape("$^", "regex", "escape")).toEqual({
        result: "\\$\\^",
        success: true,
      });
    });

    test("unescapes regex literal", () => {
      expect(escapeUnescape("a\\.b", "regex", "unescape")).toEqual({
        result: "a.b",
        success: true,
      });
      expect(escapeUnescape("\\(test\\)", "regex", "unescape")).toEqual({
        result: "(test)",
        success: true,
      });
    });

    test("leaves non-special chars unchanged when escaping", () => {
      expect(escapeUnescape("hello", "regex", "escape")).toEqual({
        result: "hello",
        success: true,
      });
    });
  });

  describe("Newline-tab mode", () => {
    test("escapes newlines and tabs to visible form", () => {
      expect(escapeUnescape("hello\nworld", "newline-tab", "escape")).toEqual({
        result: "hello\\nworld",
        success: true,
      });
      expect(escapeUnescape("col1\tcol2", "newline-tab", "escape")).toEqual({
        result: "col1\\tcol2",
        success: true,
      });
      expect(escapeUnescape("a\r\nb", "newline-tab", "escape")).toEqual({
        result: "a\\r\\nb",
        success: true,
      });
    });

    test("escapes backslashes first to avoid double-escaping", () => {
      expect(escapeUnescape("path\\to\\file", "newline-tab", "escape")).toEqual({
        result: "path\\\\to\\\\file",
        success: true,
      });
    });

    test("unescapes visible form to actual chars", () => {
      expect(escapeUnescape("hello\\nworld", "newline-tab", "unescape")).toEqual({
        result: "hello\nworld",
        success: true,
      });
      expect(escapeUnescape("col1\\tcol2", "newline-tab", "unescape")).toEqual({
        result: "col1\tcol2",
        success: true,
      });
      expect(escapeUnescape("a\\r\\nb", "newline-tab", "unescape")).toEqual({
        result: "a\r\nb",
        success: true,
      });
    });

    test("unescapes double backslash to single", () => {
      expect(escapeUnescape("path\\\\to\\\\file", "newline-tab", "unescape")).toEqual({
        result: "path\\to\\file",
        success: true,
      });
    });
  });

  describe("Round-trip", () => {
    test("JSON round-trip", () => {
      const input = 'hello "world"\n\twith\tspecial';
      const escaped = escapeUnescape(input, "json", "escape");
      expect(escaped.success).toBe(true);
      const unescaped = escapeUnescape(escaped.result, "json", "unescape");
      expect(unescaped.success).toBe(true);
      expect(unescaped.result).toBe(input);
    });

    test("Regex round-trip", () => {
      const input = "a.b*c+?";
      const escaped = escapeUnescape(input, "regex", "escape");
      expect(escaped.success).toBe(true);
      const unescaped = escapeUnescape(escaped.result, "regex", "unescape");
      expect(unescaped.success).toBe(true);
      expect(unescaped.result).toBe(input);
    });

    test("Newline-tab round-trip", () => {
      const input = "line1\nline2\tcol";
      const escaped = escapeUnescape(input, "newline-tab", "escape");
      expect(escaped.success).toBe(true);
      const unescaped = escapeUnescape(escaped.result, "newline-tab", "unescape");
      expect(unescaped.success).toBe(true);
      expect(unescaped.result).toBe(input);
    });
  });

  describe("Error handling", () => {
    test("rejects non-string input", () => {
      expect(escapeUnescape(123 as unknown as string, "json", "escape")).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("JSON unescape returns error for invalid escape", () => {
      const result = escapeUnescape("hello\\invalid", "json", "unescape");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("JSON unescape returns error for invalid unicode", () => {
      const result = escapeUnescape("\\u00xy", "json", "unescape");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
