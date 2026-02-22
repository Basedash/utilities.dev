import { describe, test, expect } from "vitest";
import {
  checkPasswordStrength,
  type StrengthLevel,
} from "./utils";

describe("Password Strength Checker Utils", () => {
  describe("checkPasswordStrength", () => {
    test("returns very-weak for empty password", () => {
      const empty = checkPasswordStrength("");
      expect(empty.score).toBeLessThanOrEqual(2);
      expect(empty.level).toBe("very-weak");
      expect(empty.feedback.length).toBeGreaterThan(0);
    });

    test("returns weak or very-weak for short passwords", () => {
      const short = checkPasswordStrength("ab");
      expect(["very-weak", "weak"]).toContain(short.level);
      expect(short.score).toBeLessThan(7);
    });

    test("returns weak for common patterns", () => {
      const password = checkPasswordStrength("password123");
      expect(password.checks.noCommonPattern).toBe(false);
      expect(password.feedback.some((f) => f.toLowerCase().includes("common"))).toBe(
        true
      );
    });

    test("returns weak for sequential patterns", () => {
      const seq = checkPasswordStrength("abc123xyz");
      expect(seq.checks.noSequential).toBe(false);
    });

    test("returns strong for good passwords", () => {
      const strong = checkPasswordStrength("Xk9#mP2$vLq@nR7");
      expect(strong.score).toBeGreaterThanOrEqual(7);
      expect(strong.level).toMatch(/strong|very-strong/);
      expect(strong.checks.length).toBe(true);
      expect(strong.checks.hasLower).toBe(true);
      expect(strong.checks.hasUpper).toBe(true);
      expect(strong.checks.hasNumber).toBe(true);
      expect(strong.checks.hasSymbol).toBe(true);
    });

    test("handles non-string input", () => {
      const result = checkPasswordStrength(123 as unknown as string);
      expect(result.score).toBe(0);
      expect(result.level).toBe("very-weak");
      expect(result.feedback).toContain("Input must be a string");
    });

    test("checks structure", () => {
      const result = checkPasswordStrength("Test1!");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("level");
      expect(result).toHaveProperty("feedback");
      expect(result).toHaveProperty("checks");
      expect(result.checks).toHaveProperty("length");
      expect(result.checks).toHaveProperty("hasLower");
      expect(result.checks).toHaveProperty("hasUpper");
      expect(result.checks).toHaveProperty("hasNumber");
      expect(result.checks).toHaveProperty("hasSymbol");
      expect(result.checks).toHaveProperty("noCommonPattern");
      expect(result.checks).toHaveProperty("noSequential");
    });

    test("level is one of allowed values", () => {
      const levels: StrengthLevel[] = [
        "very-weak",
        "weak",
        "fair",
        "strong",
        "very-strong",
      ];
      const results = [
        checkPasswordStrength(""),
        checkPasswordStrength("short"),
        checkPasswordStrength("Medium1"),
        checkPasswordStrength("Strong1!@#"),
        checkPasswordStrength("VeryStr0ng!@#XyZ"),
      ];
      results.forEach((r) => {
        expect(levels).toContain(r.level);
      });
    });

    test("score is between 0 and 10", () => {
      const inputs = ["", "a", "password", "Test1!", "Xk9#mP2$vLq@nR7"];
      inputs.forEach((p) => {
        const r = checkPasswordStrength(p);
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(10);
      });
    });

    test("detects common patterns", () => {
      expect(checkPasswordStrength("password").checks.noCommonPattern).toBe(false);
      expect(checkPasswordStrength("12345678").checks.noCommonPattern).toBe(false);
      expect(checkPasswordStrength("qwerty123").checks.noCommonPattern).toBe(false);
      expect(checkPasswordStrength("admin123").checks.noCommonPattern).toBe(false);
    });

    test("detects sequential patterns", () => {
      expect(checkPasswordStrength("abc123").checks.noSequential).toBe(false);
      expect(checkPasswordStrength("test0123456789").checks.noSequential).toBe(false);
    });

    test("provides positive feedback for strong passwords", () => {
      const r = checkPasswordStrength("MyS3cur3P@ssw0rd!");
      expect(r.feedback.some((f) => f.toLowerCase().includes("good") || f.toLowerCase().includes("manager"))).toBe(true);
    });
  });
});
