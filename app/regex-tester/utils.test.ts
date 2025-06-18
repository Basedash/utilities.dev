import { describe, test, expect } from "vitest";
import {
  buildFlagString,
  validateRegexPattern,
  testRegex,
  escapeRegex,
  isMatch,
  regexReplace,
  extractMatches,
  getCommonPatterns,
  type RegexFlags,
} from "./utils";

describe("Regex Tester Utils", () => {
  describe("buildFlagString", () => {
    test("builds empty flag string when all flags are false", () => {
      const flags: RegexFlags = {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      };
      expect(buildFlagString(flags)).toBe("");
    });

    test("builds flag string with single flag", () => {
      expect(
        buildFlagString({
          global: true,
          ignoreCase: false,
          multiline: false,
          sticky: false,
          unicode: false,
          dotAll: false,
        })
      ).toBe("g");
      expect(
        buildFlagString({
          global: false,
          ignoreCase: true,
          multiline: false,
          sticky: false,
          unicode: false,
          dotAll: false,
        })
      ).toBe("i");
      expect(
        buildFlagString({
          global: false,
          ignoreCase: false,
          multiline: true,
          sticky: false,
          unicode: false,
          dotAll: false,
        })
      ).toBe("m");
      expect(
        buildFlagString({
          global: false,
          ignoreCase: false,
          multiline: false,
          sticky: true,
          unicode: false,
          dotAll: false,
        })
      ).toBe("y");
      expect(
        buildFlagString({
          global: false,
          ignoreCase: false,
          multiline: false,
          sticky: false,
          unicode: true,
          dotAll: false,
        })
      ).toBe("u");
      expect(
        buildFlagString({
          global: false,
          ignoreCase: false,
          multiline: false,
          sticky: false,
          unicode: false,
          dotAll: true,
        })
      ).toBe("s");
    });

    test("builds flag string with multiple flags", () => {
      const flags: RegexFlags = {
        global: true,
        ignoreCase: true,
        multiline: true,
        sticky: false,
        unicode: false,
        dotAll: false,
      };
      expect(buildFlagString(flags)).toBe("gim");
    });

    test("builds flag string with all flags", () => {
      const flags: RegexFlags = {
        global: true,
        ignoreCase: true,
        multiline: true,
        sticky: true,
        unicode: true,
        dotAll: true,
      };
      expect(buildFlagString(flags)).toBe("gimyus");
    });
  });

  describe("validateRegexPattern", () => {
    test("validates simple patterns", () => {
      const result = validateRegexPattern("hello");
      expect(result.isValid).toBe(true);
      expect(result.regex).toBeInstanceOf(RegExp);
    });

    test("validates patterns with flags", () => {
      const result = validateRegexPattern("hello", {
        global: true,
        ignoreCase: true,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });
      expect(result.isValid).toBe(true);
      expect(result.regex!.global).toBe(true);
      expect(result.regex!.ignoreCase).toBe(true);
    });

    test("validates complex patterns", () => {
      const patterns = [
        "^[a-zA-Z0-9]+$",
        "\\d{3}-\\d{3}-\\d{4}",
        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
        "(?:https?:\\/\\/)?(?:www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}",
        "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
      ];

      patterns.forEach((pattern) => {
        const result = validateRegexPattern(pattern);
        expect(result.isValid).toBe(true);
        expect(result.regex).toBeInstanceOf(RegExp);
      });
    });

    test("rejects empty patterns", () => {
      const result = validateRegexPattern("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Pattern cannot be empty");
    });

    test("rejects whitespace-only patterns", () => {
      const result = validateRegexPattern("   ");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Pattern cannot be empty");
    });

    test("rejects invalid patterns", () => {
      const invalidPatterns = ["[", "(", "(?<invalid>", "(?P<invalid>)"];

      invalidPatterns.forEach((pattern) => {
        const result = validateRegexPattern(pattern);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    test("handles patterns with escaped characters", () => {
      const patterns = ["\\[", "\\(", "\\*", "\\?", "\\{", "\\\\", "\\."];

      patterns.forEach((pattern) => {
        const result = validateRegexPattern(pattern);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe("testRegex", () => {
    test("finds matches with global flag", () => {
      const result = testRegex("\\d+", "123 abc 456 def 789", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(3);
      expect(result.matches).toHaveLength(3);
      expect(result.matches[0]).toEqual({
        match: "123",
        index: 0,
        groups: [],
        namedGroups: undefined,
      });
      expect(result.matches[1]).toEqual({
        match: "456",
        index: 8,
        groups: [],
        namedGroups: undefined,
      });
      expect(result.matches[2]).toEqual({
        match: "789",
        index: 16,
        groups: [],
        namedGroups: undefined,
      });
    });

    test("finds single match without global flag", () => {
      const result = testRegex("\\d+", "123 abc 456", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(1);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0]).toEqual({
        match: "123",
        index: 0,
        groups: [],
        namedGroups: undefined,
      });
    });

    test("handles groups in matches", () => {
      const result = testRegex("(\\d+)-(\\d+)", "123-456", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matches[0]).toEqual({
        match: "123-456",
        index: 0,
        groups: ["123", "456"],
        namedGroups: undefined,
      });
    });

    test("handles named groups", () => {
      const result = testRegex("(?<year>\\d{4})-(?<month>\\d{2})", "2024-01", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matches[0].namedGroups).toEqual({
        year: "2024",
        month: "01",
      });
    });

    test("respects ignoreCase flag", () => {
      const result = testRegex("hello", "HELLO world", {
        global: false,
        ignoreCase: true,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(1);
      expect(result.matches[0].match).toBe("HELLO");
    });

    test("respects multiline flag", () => {
      const result = testRegex("^test", "hello\ntest", {
        global: false,
        ignoreCase: false,
        multiline: true,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(1);
    });

    test("handles empty test string", () => {
      const result = testRegex("test", "", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(0);
      expect(result.matches).toHaveLength(0);
    });

    test("handles no matches", () => {
      const result = testRegex("xyz", "hello world", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(0);
      expect(result.matches).toHaveLength(0);
    });

    test("handles invalid regex patterns", () => {
      const result = testRegex("[", "test string", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.matchCount).toBe(0);
    });

    test("prevents infinite loops with zero-length matches", () => {
      const result = testRegex("a*", "bbb", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.matches.length).toBeLessThan(100); // Should not be infinite
    });
  });

  describe("escapeRegex", () => {
    test("escapes special regex characters", () => {
      expect(escapeRegex(".")).toBe("\\.");
      expect(escapeRegex("*")).toBe("\\*");
      expect(escapeRegex("+")).toBe("\\+");
      expect(escapeRegex("?")).toBe("\\?");
      expect(escapeRegex("^")).toBe("\\^");
      expect(escapeRegex("$")).toBe("\\$");
      expect(escapeRegex("{")).toBe("\\{");
      expect(escapeRegex("}")).toBe("\\}");
      expect(escapeRegex("(")).toBe("\\(");
      expect(escapeRegex(")")).toBe("\\)");
      expect(escapeRegex("|")).toBe("\\|");
      expect(escapeRegex("[")).toBe("\\[");
      expect(escapeRegex("]")).toBe("\\]");
      expect(escapeRegex("\\")).toBe("\\\\");
    });

    test("escapes complex strings", () => {
      expect(escapeRegex("hello.world*")).toBe("hello\\.world\\*");
      expect(escapeRegex("test[123]")).toBe("test\\[123\\]");
      expect(escapeRegex("$100+")).toBe("\\$100\\+");
      expect(escapeRegex("(a|b)")).toBe("\\(a\\|b\\)");
    });

    test("leaves normal characters unchanged", () => {
      expect(escapeRegex("hello")).toBe("hello");
      expect(escapeRegex("123")).toBe("123");
      expect(escapeRegex("abc_def")).toBe("abc_def");
    });

    test("handles empty string", () => {
      expect(escapeRegex("")).toBe("");
    });

    test("handles strings with multiple special characters", () => {
      expect(escapeRegex(".*+?^${}()|[]\\")).toBe(
        "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"
      );
    });
  });

  describe("isMatch", () => {
    test("returns true for matching patterns", () => {
      expect(isMatch("\\d+", "123")).toBe(true);
      expect(isMatch("hello", "hello world")).toBe(true);
      expect(isMatch("test", "testing")).toBe(true);
    });

    test("returns false for non-matching patterns", () => {
      expect(isMatch("\\d+", "abc")).toBe(false);
      expect(isMatch("xyz", "hello world")).toBe(false);
      expect(isMatch("^test$", "testing")).toBe(false);
    });

    test("respects flags", () => {
      expect(
        isMatch("HELLO", "hello", {
          ignoreCase: true,
          global: false,
          multiline: false,
          sticky: false,
          unicode: false,
          dotAll: false,
        })
      ).toBe(true);
      expect(
        isMatch("HELLO", "hello", {
          ignoreCase: false,
          global: false,
          multiline: false,
          sticky: false,
          unicode: false,
          dotAll: false,
        })
      ).toBe(false);
    });

    test("handles invalid patterns", () => {
      expect(isMatch("[", "test")).toBe(false);
    });

    test("handles empty test string", () => {
      expect(isMatch("test", "")).toBe(false);
      expect(isMatch(".*", "")).toBe(false); // Empty string returns no matches in this implementation
    });
  });

  describe("regexReplace", () => {
    test("replaces matches with global flag", () => {
      const result = regexReplace("\\d+", "abc 123 def 456", "X", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.result).toBe("abc X def X");
      expect(result.success).toBe(true);
      expect(result.replacements).toBe(2);
    });

    test("replaces first match without global flag", () => {
      const result = regexReplace("\\d+", "abc 123 def 456", "X", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.result).toBe("abc X def 456");
      expect(result.success).toBe(true);
      expect(result.replacements).toBe(1);
    });

    test("handles replacement with groups", () => {
      const result = regexReplace("(\\d+)-(\\d+)", "123-456", "$2-$1", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.result).toBe("456-123");
      expect(result.success).toBe(true);
      expect(result.replacements).toBe(1);
    });

    test("handles no matches", () => {
      const result = regexReplace("xyz", "hello world", "X", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.result).toBe("hello world");
      expect(result.success).toBe(true);
      expect(result.replacements).toBe(0);
    });

    test("handles invalid patterns", () => {
      const result = regexReplace("[", "test", "X", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.replacements).toBe(0);
    });

    test("handles empty strings", () => {
      const result = regexReplace("test", "", "X", {
        global: true,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.result).toBe("");
      expect(result.success).toBe(true);
      expect(result.replacements).toBe(0);
    });
  });

  describe("extractMatches", () => {
    test("extracts all matches from text", () => {
      const matches = extractMatches("\\d+", "abc 123 def 456 ghi 789");
      expect(matches).toEqual(["123", "456", "789"]);
    });

    test("extracts single match without global flag", () => {
      const matches = extractMatches("\\d+", "abc 123 def 456", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });
      expect(matches).toEqual(["123"]);
    });

    test("returns empty array for no matches", () => {
      const matches = extractMatches("xyz", "hello world");
      expect(matches).toEqual([]);
    });

    test("handles invalid patterns", () => {
      const matches = extractMatches("[", "test");
      expect(matches).toEqual([]);
    });

    test("extracts email addresses", () => {
      const text = "Contact us at john@example.com or support@test.org";
      const matches = extractMatches(
        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
        text
      );
      expect(matches).toEqual(["john@example.com", "support@test.org"]);
    });

    test("extracts phone numbers", () => {
      const text = "Call 123-456-7890 or 987-654-3210 for assistance";
      const matches = extractMatches("\\d{3}-\\d{3}-\\d{4}", text);
      expect(matches).toEqual(["123-456-7890", "987-654-3210"]);
    });
  });

  describe("getCommonPatterns", () => {
    test("returns common pattern examples", () => {
      const patterns = getCommonPatterns();

      expect(patterns).toHaveProperty("email");
      expect(patterns).toHaveProperty("phone");
      expect(patterns).toHaveProperty("url");
      expect(patterns).toHaveProperty("ipv4");
      expect(patterns).toHaveProperty("creditCard");
      expect(patterns).toHaveProperty("zipCode");
      expect(patterns).toHaveProperty("hexColor");
      expect(patterns).toHaveProperty("strongPassword");
    });

    test("all patterns have required properties", () => {
      const patterns = getCommonPatterns();

      Object.values(patterns).forEach((pattern) => {
        expect(pattern).toHaveProperty("pattern");
        expect(pattern).toHaveProperty("description");
        expect(pattern).toHaveProperty("example");
        expect(typeof pattern.pattern).toBe("string");
        expect(typeof pattern.description).toBe("string");
        expect(typeof pattern.example).toBe("string");
      });
    });

    test("pattern examples should match their patterns", () => {
      const patterns = getCommonPatterns();

      // Test a few key patterns to ensure they match their examples
      expect(isMatch(patterns.email.pattern, patterns.email.example)).toBe(
        true
      );
      expect(isMatch(patterns.phone.pattern, patterns.phone.example)).toBe(
        true
      );
      expect(isMatch(patterns.url.pattern, patterns.url.example)).toBe(true);
      expect(isMatch(patterns.ipv4.pattern, patterns.ipv4.example)).toBe(true);
      expect(
        isMatch(patterns.hexColor.pattern, patterns.hexColor.example)
      ).toBe(true);
    });

    test("patterns are valid regex patterns", () => {
      const patterns = getCommonPatterns();

      Object.values(patterns).forEach((pattern) => {
        const validation = validateRegexPattern(pattern.pattern);
        expect(validation.isValid).toBe(true);
      });
    });
  });

  describe("edge cases and integration", () => {
    test("handles Unicode characters", () => {
      const result = testRegex("🚀", "Hello 🚀 World", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: true,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(1);
      expect(result.matches[0].match).toBe("🚀");
    });

    test("handles very long text", () => {
      const longText = "test ".repeat(10000) + "match";
      const result = testRegex("match", longText, {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matchCount).toBe(1);
    });

    test("handles complex nested groups", () => {
      const result = testRegex("((\\d+)-(\\d+))", "123-456", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.matches[0].groups).toEqual(["123-456", "123", "456"]);
    });

    test("dotAll flag affects dot behavior", () => {
      const text = "hello\nworld";

      const withoutDotAll = testRegex("hello.world", text, {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: false,
      });

      const withDotAll = testRegex("hello.world", text, {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: false,
        unicode: false,
        dotAll: true,
      });

      expect(withoutDotAll.matchCount).toBe(0);
      expect(withDotAll.matchCount).toBe(1);
    });

    test("sticky flag behavior", () => {
      const result = testRegex("\\d+", "abc123def456", {
        global: false,
        ignoreCase: false,
        multiline: false,
        sticky: true,
        unicode: false,
        dotAll: false,
      });

      // Sticky flag starts matching from beginning, so should not match
      expect(result.matchCount).toBe(0);
    });
  });
});
