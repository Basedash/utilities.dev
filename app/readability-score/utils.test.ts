import { describe, test, expect } from "vitest";
import {
  countSyllables,
  getWords,
  getSentences,
  fleschReadingEase,
  fleschKincaidGradeLevel,
  computeReadability,
} from "./utils";

describe("readability-score utils", () => {
  describe("countSyllables", () => {
    test("single syllable words", () => {
      expect(countSyllables("cat")).toBe(1);
      expect(countSyllables("the")).toBe(1);
      expect(countSyllables("a")).toBe(1);
      expect(countSyllables("I")).toBe(1);
    });

    test("two syllable words", () => {
      expect(countSyllables("hello")).toBe(2);
      expect(countSyllables("water")).toBe(2);
      expect(countSyllables("simple")).toBe(2);
    });

    test("three syllable words", () => {
      expect(countSyllables("beautiful")).toBe(3);
      expect(countSyllables("important")).toBe(3);
    });

    test("handles empty and non-alpha", () => {
      expect(countSyllables("")).toBe(0);
      expect(countSyllables("123")).toBe(0); // digits stripped, empty
    });

    test("is deterministic", () => {
      expect(countSyllables("deterministic")).toBe(countSyllables("deterministic"));
    });
  });

  describe("getWords", () => {
    test("splits on whitespace", () => {
      expect(getWords("one two three")).toEqual(["one", "two", "three"]);
      expect(getWords("  a   b  ")).toEqual(["a", "b"]);
    });

    test("returns empty for empty input", () => {
      expect(getWords("")).toEqual([]);
      expect(getWords("   ")).toEqual([]);
    });
  });

  describe("getSentences", () => {
    test("splits on sentence boundaries", () => {
      expect(getSentences("First. Second! Third?")).toEqual(["First.", "Second!", "Third?"]);
    });

    test("handles single sentence", () => {
      expect(getSentences("One sentence only.")).toEqual(["One sentence only."]);
    });

    test("returns empty for empty input", () => {
      expect(getSentences("")).toEqual([]);
      expect(getSentences("   ")).toEqual([]);
    });
  });

  describe("fleschReadingEase", () => {
    test("returns 0 for zero words or sentences", () => {
      expect(fleschReadingEase(0, 1, 5)).toBe(0);
      expect(fleschReadingEase(10, 0, 15)).toBe(0);
    });

    test("simple text yields positive score", () => {
      const score = fleschReadingEase(10, 1, 12);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test("short words and sentences yield higher score", () => {
      const easy = fleschReadingEase(5, 1, 5);
      const hard = fleschReadingEase(20, 1, 40);
      expect(easy).toBeGreaterThan(hard);
    });
  });

  describe("fleschKincaidGradeLevel", () => {
    test("returns 0 for zero words or sentences", () => {
      expect(fleschKincaidGradeLevel(0, 1, 5)).toBe(0);
      expect(fleschKincaidGradeLevel(10, 0, 15)).toBe(0);
    });

    test("returns non-negative grade", () => {
      const grade = fleschKincaidGradeLevel(10, 2, 15);
      expect(grade).toBeGreaterThanOrEqual(0);
    });

    test("complex text yields higher grade", () => {
      const simple = fleschKincaidGradeLevel(5, 1, 5);
      const complex = fleschKincaidGradeLevel(25, 1, 50);
      expect(complex).toBeGreaterThan(simple);
    });
  });

  describe("computeReadability", () => {
    test("returns null for empty input", () => {
      expect(computeReadability("")).toBeNull();
      expect(computeReadability("   ")).toBeNull();
    });

    test("returns result for valid text", () => {
      const result = computeReadability("The cat sat on the mat. It was warm.");
      expect(result).not.toBeNull();
      expect(result!.wordCount).toBe(9);
      expect(result!.sentenceCount).toBe(2);
      expect(result!.syllableCount).toBeGreaterThan(0);
      expect(result!.fleschReadingEase).toBeGreaterThan(0);
      expect(result!.gradeLevel).toBeGreaterThanOrEqual(0);
    });

    test("is deterministic", () => {
      const text = "This is a sample paragraph. It has two sentences.";
      const a = computeReadability(text);
      const b = computeReadability(text);
      expect(a).toEqual(b);
    });
  });
});
