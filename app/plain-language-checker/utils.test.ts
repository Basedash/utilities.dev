import { describe, test, expect } from "vitest";
import { checkPlainLanguage } from "./utils";

describe("plain-language-checker utils", () => {
  describe("checkPlainLanguage", () => {
    test("returns null for empty input", () => {
      expect(checkPlainLanguage("")).toBeNull();
      expect(checkPlainLanguage("   ")).toBeNull();
    });

    test("flags long sentences", () => {
      const long =
        "This is a very long sentence that definitely exceeds twenty five words and should be flagged by the plain language checker for being too verbose and hard to read.";
      const result = checkPlainLanguage(long + " Short.");
      expect(result).not.toBeNull();
      expect(result!.longSentences.length).toBe(1);
      expect(result!.longSentences[0].wordCount).toBeGreaterThan(25);
    });

    test("does not flag short sentences", () => {
      const short = "This is short. So is this. And this.";
      const result = checkPlainLanguage(short);
      expect(result).not.toBeNull();
      expect(result!.longSentences.length).toBe(0);
    });

    test("flags passive-ish wording", () => {
      const passive = "The document was completed. It is being sent.";
      const result = checkPlainLanguage(passive);
      expect(result).not.toBeNull();
      expect(result!.passiveMarkers.length).toBeGreaterThan(0);
    });

    test("flags jargon", () => {
      const jargon = "We should utilize leverage to optimize the paradigm.";
      const result = checkPlainLanguage(jargon);
      expect(result).not.toBeNull();
      expect(result!.jargonHits.length).toBeGreaterThan(0);
    });

    test("provides suggestions summary", () => {
      const text = "Short. Clear.";
      const result = checkPlainLanguage(text);
      expect(result).not.toBeNull();
      expect(result!.suggestions.length).toBeGreaterThan(0);
    });

    test("is deterministic", () => {
      const text = "The system was deployed. We utilize robust architecture.";
      const a = checkPlainLanguage(text);
      const b = checkPlainLanguage(text);
      expect(a).toEqual(b);
    });
  });
});
