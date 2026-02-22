import { describe, test, expect } from "vitest";
import { escapeRegex } from "./utils";

describe("escapeRegex", () => {
  test("escapes backslash", () => {
    expect(escapeRegex("\\")).toBe("\\\\");
    expect(escapeRegex("a\\b")).toBe("a\\\\b");
  });

  test("escapes anchors", () => {
    expect(escapeRegex("^start")).toBe("\\^start");
    expect(escapeRegex("end$")).toBe("end\\$");
  });

  test("escapes quantifiers", () => {
    expect(escapeRegex("a.b")).toBe("a\\.b");
    expect(escapeRegex("a*b")).toBe("a\\*b");
    expect(escapeRegex("a+b")).toBe("a\\+b");
    expect(escapeRegex("a?b")).toBe("a\\?b");
  });

  test("escapes alternation", () => {
    expect(escapeRegex("a|b")).toBe("a\\|b");
  });

  test("escapes groups and character classes", () => {
    expect(escapeRegex("(group)")).toBe("\\(group\\)");
    expect(escapeRegex("[chars]")).toBe("\\[chars\\]");
    expect(escapeRegex("{1,2}")).toBe("\\{1,2\\}");
  });

  test("leaves alphanumeric and spaces unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
    expect(escapeRegex("abc123")).toBe("abc123");
  });

  test("handles empty string", () => {
    expect(escapeRegex("")).toBe("");
  });

  test("handles string with no special chars", () => {
    expect(escapeRegex("plain text")).toBe("plain text");
  });

  test("handles multiple special chars", () => {
    expect(escapeRegex(".*+?^${}()|[]\\")).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
    );
  });

  test("handles real-world paths", () => {
    expect(escapeRegex("C:\\Users\\file.txt")).toBe(
      "C:\\\\Users\\\\file\\.txt"
    );
    expect(escapeRegex("path/to/file.js")).toBe("path/to/file\\.js");
  });

  test("handles non-string input", () => {
    expect(escapeRegex(123 as unknown as string)).toBe("");
    expect(escapeRegex(null as unknown as string)).toBe("");
  });
});
