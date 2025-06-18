import { describe, test, expect } from "vitest";
import {
  encodeBase64,
  decodeBase64,
  isValidBase64,
  getBase64Info,
} from "./utils";

describe("Base64 Encoding Utils", () => {
  describe("encodeBase64", () => {
    test("encodes simple strings correctly", () => {
      expect(encodeBase64("hello")).toEqual({
        result: "aGVsbG8=",
        success: true,
      });

      expect(encodeBase64("Hello World!")).toEqual({
        result: "SGVsbG8gV29ybGQh",
        success: true,
      });
    });

    test("encodes empty string", () => {
      expect(encodeBase64("")).toEqual({
        result: "",
        success: true,
      });
    });

    test("encodes special characters", () => {
      expect(encodeBase64("🚀")).toEqual({
        result: "8J+agA==",
        success: true,
      });

      expect(encodeBase64("!@#$%^&*()")).toEqual({
        result: "IUAjJCVeJiooKQ==",
        success: true,
      });
    });

    test("encodes multiline text", () => {
      const multiline = "line1\nline2\nline3";
      const result = encodeBase64(multiline);
      expect(result.success).toBe(true);
      expect(result.result).toBe("bGluZTEKbGluZTIKbGluZTM=");
    });

    test("handles non-string input", () => {
      expect(encodeBase64(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });

      expect(encodeBase64(null as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });
  });

  describe("decodeBase64", () => {
    test("decodes valid Base64 strings correctly", () => {
      expect(decodeBase64("aGVsbG8=")).toEqual({
        result: "hello",
        success: true,
      });

      expect(decodeBase64("SGVsbG8gV29ybGQh")).toEqual({
        result: "Hello World!",
        success: true,
      });
    });

    test("decodes empty Base64 succeeds for empty string", () => {
      expect(decodeBase64("")).toEqual({
        result: "",
        success: true,
      });

      expect(decodeBase64("   ")).toEqual({
        result: "",
        success: true,
      });
    });

    test("decodes special characters", () => {
      expect(decodeBase64("8J+agA==")).toEqual({
        result: "🚀",
        success: true,
      });

      expect(decodeBase64("IUAjJCVeJiooKQ==")).toEqual({
        result: "!@#$%^&*()",
        success: true,
      });
    });

    test("handles invalid Base64 strings", () => {
      expect(decodeBase64("invalid base64!")).toEqual({
        result: "",
        success: false,
        error: "Invalid base64 string",
      });

      expect(decodeBase64("aGVsbG8")).toEqual({
        result: "",
        success: false,
        error: "Invalid base64 string",
      });
    });

    test("handles non-string input", () => {
      expect(decodeBase64(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("decodes multiline encoded text", () => {
      const result = decodeBase64("bGluZTEKbGluZTIKbGluZTM=");
      expect(result).toEqual({
        result: "line1\nline2\nline3",
        success: true,
      });
    });
  });

  describe("isValidBase64", () => {
    test("validates correct Base64 strings", () => {
      expect(isValidBase64("aGVsbG8=")).toBe(true);
      expect(isValidBase64("SGVsbG8gV29ybGQh")).toBe(true);
      expect(isValidBase64("8J+agA==")).toBe(true);
    });

    test("rejects invalid Base64 strings", () => {
      expect(isValidBase64("invalid base64!")).toBe(false);
      expect(isValidBase64("aGVsbG8")).toBe(false);
      expect(isValidBase64("hello world")).toBe(false);
    });

    test("rejects empty and non-string inputs except for empty strings", () => {
      expect(isValidBase64("")).toBe(true); // Empty string is valid
      expect(isValidBase64("   ")).toBe(true); // Whitespace-only is also valid
      expect(isValidBase64(123 as unknown as string)).toBe(false);
      expect(isValidBase64(null as unknown as string)).toBe(false);
    });

    test("validates edge cases", () => {
      // Valid minimal Base64
      expect(isValidBase64("YQ==")).toBe(true); // 'a'
      expect(isValidBase64("YWI=")).toBe(true); // 'ab'
      expect(isValidBase64("YWJj")).toBe(true); // 'abc'
    });
  });

  describe("getBase64Info", () => {
    test("calculates size information correctly", () => {
      const info = getBase64Info("hello");
      expect(info.originalSize).toBe(5);
      expect(info.encodedSize).toBe(8);
      expect(info.overhead).toBe(3);
      expect(info.overheadPercentage).toBe(60);
    });

    test("handles empty string", () => {
      const info = getBase64Info("");
      expect(info.originalSize).toBe(0);
      expect(info.encodedSize).toBe(0);
      expect(info.overhead).toBe(0);
      expect(info.overheadPercentage).toBe(0);
    });

    test("calculates overhead for different string lengths", () => {
      // 1 character: 'a' -> 'YQ=='
      const info1 = getBase64Info("a");
      expect(info1.originalSize).toBe(1);
      expect(info1.encodedSize).toBe(4);
      expect(info1.overheadPercentage).toBe(300);

      // 3 characters: 'abc' -> 'YWJj'
      const info3 = getBase64Info("abc");
      expect(info3.originalSize).toBe(3);
      expect(info3.encodedSize).toBe(4);
      expect(info3.overheadPercentage).toBe(33.33);
    });

    test("handles Unicode characters", () => {
      const info = getBase64Info("🚀");
      expect(info.originalSize).toBe(4); // UTF-8 encoding of emoji
      expect(info.encodedSize).toBe(8); // Base64 encoded
      expect(info.overheadPercentage).toBe(100);
    });
  });

  describe("round-trip encoding/decoding", () => {
    test("maintains data integrity through encode-decode cycle", () => {
      const testStrings = [
        "hello world",
        "🚀 Unicode test 🌟",
        "Multi\nline\ntext",
        "!@#$%^&*()_+{}[]|\\:\";'<>?,./",
        "", // empty string
        "a", // single character
        "This is a longer string with various characters: 123 ABC abc !@# 🚀🌟⭐",
      ];

      testStrings.forEach((original) => {
        const encoded = encodeBase64(original);
        expect(encoded.success).toBe(true);

        const decoded = decodeBase64(encoded.result);
        expect(decoded.success).toBe(true);
        expect(decoded.result).toBe(original);
      });
    });
  });

  describe("edge cases and error handling", () => {
    test("handles very long strings", () => {
      const longString = "a".repeat(10000);
      const encoded = encodeBase64(longString);
      expect(encoded.success).toBe(true);

      const decoded = decodeBase64(encoded.result);
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe(longString);
    });

    test("handles strings with null bytes", () => {
      const stringWithNull = "hello\0world";
      const encoded = encodeBase64(stringWithNull);
      expect(encoded.success).toBe(true);

      const decoded = decodeBase64(encoded.result);
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe(stringWithNull);
    });
  });
});
