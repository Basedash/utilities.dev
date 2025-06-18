import { describe, test, expect } from "vitest";
import {
  processText,
  lcs,
  generateLCSDiff,
  generateSimpleDiff,
  calculateDiffStats,
  diffTexts,
  formatUnifiedDiff,
  formatDiffWithLineNumbers,
  exportAsPatch,
  areTextsIdentical,
  getSimilarityPercentage,
  type DiffLine,
  type DiffResult,
} from "./utils";

describe("Diff Utils", () => {
  describe("processText", () => {
    test("returns text unchanged with no options", () => {
      const text = "Hello World";
      expect(processText(text)).toBe("Hello World");
    });

    test("converts to lowercase when ignoreCase is true", () => {
      const text = "Hello World";
      expect(processText(text, { ignoreCase: true })).toBe("hello world");
    });

    test("normalizes whitespace when ignoreWhitespace is true", () => {
      const text = "Hello    World\n\tTest";
      expect(processText(text, { ignoreWhitespace: true })).toBe(
        "Hello World Test"
      );
    });

    test("applies both case and whitespace processing", () => {
      const text = "Hello    WORLD\n\tTest";
      expect(
        processText(text, { ignoreCase: true, ignoreWhitespace: true })
      ).toBe("hello world test");
    });

    test("handles empty string", () => {
      expect(
        processText("", { ignoreCase: true, ignoreWhitespace: true })
      ).toBe("");
    });

    test("handles whitespace-only string", () => {
      expect(processText("   \n\t  ", { ignoreWhitespace: true })).toBe("");
    });
  });

  describe("lcs", () => {
    test("calculates LCS for identical arrays", () => {
      const a = ["a", "b", "c"];
      const b = ["a", "b", "c"];
      const result = lcs(a, b);
      expect(result[a.length][b.length]).toBe(3);
    });

    test("calculates LCS for completely different arrays", () => {
      const a = ["a", "b", "c"];
      const b = ["x", "y", "z"];
      const result = lcs(a, b);
      expect(result[a.length][b.length]).toBe(0);
    });

    test("calculates LCS for partially similar arrays", () => {
      const a = ["a", "b", "c", "d"];
      const b = ["a", "x", "c", "y"];
      const result = lcs(a, b);
      expect(result[a.length][b.length]).toBe(2); // "a" and "c" match
    });

    test("handles empty arrays", () => {
      const a: string[] = [];
      const b = ["a", "b"];
      const result = lcs(a, b);
      expect(result[0][b.length]).toBe(0);
    });

    test("handles one empty array", () => {
      const a = ["a", "b"];
      const b: string[] = [];
      const result = lcs(a, b);
      expect(result[a.length][0]).toBe(0);
    });
  });

  describe("generateLCSDiff", () => {
    test("generates diff for identical texts", () => {
      const lines1 = ["line1", "line2"];
      const lines2 = ["line1", "line2"];
      const result = generateLCSDiff(lines1, lines2, lines1, lines2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: "equal",
        content: "line1",
        lineNumber1: 1,
        lineNumber2: 1,
      });
      expect(result[1]).toEqual({
        type: "equal",
        content: "line2",
        lineNumber1: 2,
        lineNumber2: 2,
      });
    });

    test("generates diff for added lines", () => {
      const lines1 = ["line1"];
      const lines2 = ["line1", "line2"];
      const result = generateLCSDiff(lines1, lines2, lines1, lines2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: "equal",
        content: "line1",
        lineNumber1: 1,
        lineNumber2: 1,
      });
      expect(result[1]).toEqual({
        type: "added",
        content: "line2",
        lineNumber2: 2,
      });
    });

    test("generates diff for removed lines", () => {
      const lines1 = ["line1", "line2"];
      const lines2 = ["line1"];
      const result = generateLCSDiff(lines1, lines2, lines1, lines2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: "equal",
        content: "line1",
        lineNumber1: 1,
        lineNumber2: 1,
      });
      expect(result[1]).toEqual({
        type: "removed",
        content: "line2",
        lineNumber1: 2,
      });
    });
  });

  describe("generateSimpleDiff", () => {
    test("generates simple diff for basic changes", () => {
      const lines1 = ["a", "b"];
      const lines2 = ["a", "c"];
      const result = generateSimpleDiff(lines1, lines2, lines1, lines2);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe("equal");
      expect(result[1].type).toBe("removed");
      expect(result[2].type).toBe("added");
    });

    test("handles empty arrays", () => {
      const result = generateSimpleDiff([], [], [], []);
      expect(result).toHaveLength(0);
    });

    test("handles one empty array", () => {
      const lines1: string[] = [];
      const lines2 = ["new line"];
      const result = generateSimpleDiff(lines1, lines2, lines1, lines2);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "added",
        content: "new line",
        lineNumber2: 1,
      });
    });
  });

  describe("calculateDiffStats", () => {
    test("calculates stats correctly", () => {
      const lines: DiffLine[] = [
        { type: "equal", content: "same" },
        { type: "added", content: "new" },
        { type: "removed", content: "old" },
        { type: "equal", content: "same2" },
      ];

      const stats = calculateDiffStats(lines);
      expect(stats).toEqual({
        added: 1,
        removed: 1,
        unchanged: 2,
        total: 4,
      });
    });

    test("handles empty diff", () => {
      const stats = calculateDiffStats([]);
      expect(stats).toEqual({
        added: 0,
        removed: 0,
        unchanged: 0,
        total: 0,
      });
    });

    test("handles only additions", () => {
      const lines: DiffLine[] = [
        { type: "added", content: "new1" },
        { type: "added", content: "new2" },
      ];

      const stats = calculateDiffStats(lines);
      expect(stats).toEqual({
        added: 2,
        removed: 0,
        unchanged: 0,
        total: 2,
      });
    });
  });

  describe("diffTexts", () => {
    test("diffs identical texts", () => {
      const text1 = "line1\nline2";
      const text2 = "line1\nline2";
      const result = diffTexts(text1, text2);

      expect(result.hasChanges).toBe(false);
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(0);
      expect(result.stats.unchanged).toBe(2);
    });

    test("diffs different texts", () => {
      const text1 = "line1\nline2";
      const text2 = "line1\nline3";
      const result = diffTexts(text1, text2);

      expect(result.hasChanges).toBe(true);
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(1);
    });

    test("respects ignoreCase option", () => {
      const text1 = "Hello";
      const text2 = "hello";
      const result = diffTexts(text1, text2, { ignoreCase: true });

      expect(result.hasChanges).toBe(false);
      expect(result.stats.unchanged).toBe(1);
    });

    test("respects ignoreWhitespace option", () => {
      const text1 = "Hello    World";
      const text2 = "Hello World";
      const result = diffTexts(text1, text2, { ignoreWhitespace: true });

      expect(result.hasChanges).toBe(false);
      expect(result.stats.unchanged).toBe(1);
    });

    test("handles empty texts", () => {
      const result = diffTexts("", "");
      expect(result.hasChanges).toBe(false);
      expect(result.stats.total).toBe(0);
    });

    test("handles one empty text", () => {
      const result = diffTexts("", "new content");
      expect(result.hasChanges).toBe(true);
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(0);
    });
  });

  describe("formatUnifiedDiff", () => {
    test("formats basic unified diff", () => {
      const diffResult: DiffResult = {
        lines: [
          { type: "equal", content: "line1", lineNumber1: 1, lineNumber2: 1 },
          { type: "removed", content: "line2", lineNumber1: 2 },
          { type: "added", content: "line3", lineNumber2: 2 },
        ],
        stats: { added: 1, removed: 1, unchanged: 1, total: 3 },
        hasChanges: true,
      };

      const result = formatUnifiedDiff(diffResult);
      expect(result).toContain("--- text1");
      expect(result).toContain("+++ text2");
      expect(result).toContain(" line1");
      expect(result).toContain("-line2");
      expect(result).toContain("+line3");
    });

    test("uses custom filenames", () => {
      const diffResult: DiffResult = {
        lines: [
          { type: "equal", content: "test", lineNumber1: 1, lineNumber2: 1 },
        ],
        stats: { added: 0, removed: 0, unchanged: 1, total: 1 },
        hasChanges: false,
      };

      const result = formatUnifiedDiff(diffResult, "file1.txt", "file2.txt");
      expect(result).toContain("--- file1.txt");
      expect(result).toContain("+++ file2.txt");
    });

    test("handles empty diff", () => {
      const diffResult: DiffResult = {
        lines: [],
        stats: { added: 0, removed: 0, unchanged: 0, total: 0 },
        hasChanges: false,
      };

      const result = formatUnifiedDiff(diffResult);
      expect(result).toContain("--- text1");
      expect(result).toContain("+++ text2");
    });
  });

  describe("formatDiffWithLineNumbers", () => {
    test("formats diff with line numbers", () => {
      const diffResult: DiffResult = {
        lines: [
          { type: "equal", content: "line1", lineNumber1: 1, lineNumber2: 1 },
          { type: "removed", content: "line2", lineNumber1: 2 },
          { type: "added", content: "line3", lineNumber2: 2 },
        ],
        stats: { added: 1, removed: 1, unchanged: 1, total: 3 },
        hasChanges: true,
      };

      const result = formatDiffWithLineNumbers(diffResult);
      expect(result).toContain("1 | 1 |   line1");
      expect(result).toContain("2 |   | - line2");
      expect(result).toContain("  | 2 | + line3");
    });

    test("handles empty diff", () => {
      const diffResult: DiffResult = {
        lines: [],
        stats: { added: 0, removed: 0, unchanged: 0, total: 0 },
        hasChanges: false,
      };

      const result = formatDiffWithLineNumbers(diffResult);
      expect(result).toBe("");
    });
  });

  describe("exportAsPatch", () => {
    test("exports as patch format", () => {
      const text1 = "line1\nline2";
      const text2 = "line1\nline3";

      const result = exportAsPatch(text1, text2, "file1.txt", "file2.txt");
      expect(result).toContain("--- file1.txt");
      expect(result).toContain("+++ file2.txt");
      expect(result).toContain("@@ -1,2 +1,2 @@");
      expect(result).toContain(" line1");
      expect(result).toContain("-line2");
      expect(result).toContain("+line3");
    });

    test("uses default filenames", () => {
      const result = exportAsPatch("test", "test");
      expect(result).toContain("--- a.txt");
      expect(result).toContain("+++ b.txt");
    });

    test("respects diff options", () => {
      const text1 = "Hello";
      const text2 = "hello";

      const result = exportAsPatch(text1, text2, "a.txt", "b.txt", {
        ignoreCase: true,
      });
      expect(result).toContain(" Hello"); // Should show as unchanged
    });
  });

  describe("areTextsIdentical", () => {
    test("returns true for identical texts", () => {
      expect(areTextsIdentical("hello", "hello")).toBe(true);
    });

    test("returns false for different texts", () => {
      expect(areTextsIdentical("hello", "world")).toBe(false);
    });

    test("respects ignoreCase option", () => {
      expect(areTextsIdentical("Hello", "hello", { ignoreCase: true })).toBe(
        true
      );
      expect(areTextsIdentical("Hello", "hello", { ignoreCase: false })).toBe(
        false
      );
    });

    test("respects ignoreWhitespace option", () => {
      expect(
        areTextsIdentical("hello world", "hello  world", {
          ignoreWhitespace: true,
        })
      ).toBe(true);
      expect(
        areTextsIdentical("hello world", "hello  world", {
          ignoreWhitespace: false,
        })
      ).toBe(false);
    });

    test("handles empty strings", () => {
      expect(areTextsIdentical("", "")).toBe(true);
      expect(areTextsIdentical("", "hello")).toBe(false);
    });

    test("handles whitespace-only strings", () => {
      expect(areTextsIdentical("   ", "   ")).toBe(true);
      expect(areTextsIdentical("   ", "", { ignoreWhitespace: true })).toBe(
        true
      );
    });
  });

  describe("getSimilarityPercentage", () => {
    test("returns 100 for identical texts", () => {
      expect(getSimilarityPercentage("hello", "hello")).toBe(100);
    });

    test("returns 0 for completely different texts", () => {
      expect(getSimilarityPercentage("abc", "xyz")).toBe(0);
    });

    test("calculates percentage for partially similar texts", () => {
      const text1 = "line1\nline2";
      const text2 = "line1\nline3";
      const similarity = getSimilarityPercentage(text1, text2);
      expect(similarity).toBe(50); // 1 out of 2 lines match
    });

    test("handles empty texts", () => {
      expect(getSimilarityPercentage("", "")).toBe(100);
      expect(getSimilarityPercentage("", "hello")).toBe(0);
      expect(getSimilarityPercentage("hello", "")).toBe(0);
    });

    test("respects diff options", () => {
      const similarity1 = getSimilarityPercentage("Hello", "hello", {
        ignoreCase: false,
      });
      const similarity2 = getSimilarityPercentage("Hello", "hello", {
        ignoreCase: true,
      });
      expect(similarity1).toBe(0);
      expect(similarity2).toBe(100);
    });

    test("handles single character changes", () => {
      const similarity = getSimilarityPercentage("hello", "hallo");
      expect(similarity).toBe(0); // Different lines entirely
    });

    test("handles whitespace differences", () => {
      const text1 = "hello world";
      const text2 = "hello  world";
      const similarity1 = getSimilarityPercentage(text1, text2, {
        ignoreWhitespace: false,
      });
      const similarity2 = getSimilarityPercentage(text1, text2, {
        ignoreWhitespace: true,
      });
      expect(similarity1).toBe(0);
      expect(similarity2).toBe(100);
    });
  });

  describe("edge cases and integration", () => {
    test("handles very long lines", () => {
      const longLine = "a".repeat(10000);
      const text1 = longLine;
      const text2 = longLine + "b";

      const result = diffTexts(text1, text2);
      expect(result.hasChanges).toBe(true);
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
    });

    test("handles many lines", () => {
      const lines1 = Array.from({ length: 1000 }, (_, i) => `line${i}`);
      const lines2 = [...lines1];
      lines2[500] = "modified line";

      const text1 = lines1.join("\n");
      const text2 = lines2.join("\n");

      const result = diffTexts(text1, text2);
      expect(result.hasChanges).toBe(true);
      expect(result.stats.unchanged).toBe(999);
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
    });

    test("handles special characters", () => {
      const text1 = "Hello 🌍\nSpecial chars: àáâãäå";
      const text2 = "Hello 🌎\nSpecial chars: àáâãäå";

      const result = diffTexts(text1, text2);
      expect(result.hasChanges).toBe(true);
      expect(result.stats.unchanged).toBe(1);
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
    });

    test("contextLines option affects output", () => {
      const text1 = "line1\nline2\nline3\nline4\nline5";
      const text2 = "line1\nline2\nmodified\nline4\nline5";

      const result = diffTexts(text1, text2, { contextLines: 1 });
      expect(result.hasChanges).toBe(true);
      expect(result.lines.length).toBeGreaterThan(0);
    });
  });
});
