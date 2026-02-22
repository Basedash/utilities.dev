import { describe, test, expect } from "vitest";
import {
  encodeBase64Url,
  decodeBase64Url,
  isValidBase64Url,
} from "./utils";

describe("Base64URL Converter Utils", () => {
  describe("encodeBase64Url", () => {
    test("encodes simple strings correctly", () => {
      expect(encodeBase64Url("hello")).toEqual({
        result: "aGVsbG8",
        success: true,
      });
      expect(encodeBase64Url("Hello World!")).toEqual({
        result: "SGVsbG8gV29ybGQh",
        success: true,
      });
    });

    test("uses URL-safe characters (- and _)", () => {
      const result = encodeBase64Url(">>>");
      expect(result.success).toBe(true);
      expect(result.result).not.toContain("+");
      expect(result.result).not.toContain("/");
      expect(result.result).not.toContain("=");
      expect(result.result).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    test("encodes empty string", () => {
      expect(encodeBase64Url("")).toEqual({ result: "", success: true });
    });

    test("encodes special characters and Unicode", () => {
      expect(encodeBase64Url("🚀")).toEqual({
        result: "8J-agA",
        success: true,
      });
    });

    test("handles non-string input", () => {
      expect(encodeBase64Url(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });
  });

  describe("decodeBase64Url", () => {
    test("decodes valid Base64URL strings", () => {
      expect(decodeBase64Url("aGVsbG8")).toEqual({
        result: "hello",
        success: true,
      });
      expect(decodeBase64Url("SGVsbG8gV29ybGQh")).toEqual({
        result: "Hello World!",
        success: true,
      });
    });

    test("decodes with - and _ instead of + and /", () => {
      // ">>>" in Base64 is "Pj4+", Base64URL uses - for +
      expect(decodeBase64Url("Pj4-")).toEqual({
        result: ">>>",
        success: true,
      });
    });

    test("decodes empty string", () => {
      expect(decodeBase64Url("")).toEqual({ result: "", success: true });
      expect(decodeBase64Url("   ")).toEqual({ result: "", success: true });
    });

    test("handles invalid Base64URL", () => {
      expect(decodeBase64Url("invalid!@#")).toEqual({
        result: "",
        success: false,
        error: "Invalid Base64URL string",
      });
    });

    test("handles non-string input", () => {
      expect(decodeBase64Url(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });
  });

  describe("isValidBase64Url", () => {
    test("validates correct Base64URL strings", () => {
      expect(isValidBase64Url("aGVsbG8")).toBe(true);
      expect(isValidBase64Url("SGVsbG8gV29ybGQh")).toBe(true);
      expect(isValidBase64Url("PD4-")).toBe(true);
    });

    test("rejects invalid characters", () => {
      expect(isValidBase64Url("aGVsbG8=")).toBe(false);
      expect(isValidBase64Url("a+b/c")).toBe(false);
      expect(isValidBase64Url("invalid!")).toBe(false);
    });

    test("rejects non-string input", () => {
      expect(isValidBase64Url(123 as unknown as string)).toBe(false);
    });
  });

  describe("round-trip", () => {
    test("maintains data integrity through encode-decode cycle", () => {
      const inputs = ["hello", "JWT.segment", ">>>", "🚀", ""];
      inputs.forEach((original) => {
        const encoded = encodeBase64Url(original);
        expect(encoded.success).toBe(true);
        const decoded = decodeBase64Url(encoded.result);
        expect(decoded.success).toBe(true);
        expect(decoded.result).toBe(original);
      });
    });
  });
});
