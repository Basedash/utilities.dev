import { describe, test, expect } from "vitest";
import { encodeUrl, decodeUrl } from "./utils";

describe("URL Encoding Utils", () => {
  describe("encodeUrl", () => {
    test("encodes simple strings correctly", () => {
      expect(encodeUrl("hello")).toEqual({
        result: "hello",
        success: true,
      });

      expect(encodeUrl("Hello World!")).toEqual({
        result: "Hello%20World!",
        success: true,
      });
    });

    test("encodes empty string", () => {
      expect(encodeUrl("")).toEqual({
        result: "",
        success: true,
      });
    });

    test("encodes special characters", () => {
      expect(encodeUrl("hello world")).toEqual({
        result: "hello%20world",
        success: true,
      });

      expect(encodeUrl("a&b=c")).toEqual({
        result: "a%26b%3Dc",
        success: true,
      });

      expect(encodeUrl("?query=value")).toEqual({
        result: "%3Fquery%3Dvalue",
        success: true,
      });
    });

    test("encodes Unicode characters", () => {
      expect(encodeUrl("cafe")).toEqual({
        result: "cafe",
        success: true,
      });

      expect(encodeUrl("café")).toEqual({
        result: "caf%C3%A9",
        success: true,
      });
    });

    test("encodes multiline text", () => {
      const multiline = "line1\nline2\nline3";
      const result = encodeUrl(multiline);
      expect(result.success).toBe(true);
      expect(result.result).toBe("line1%0Aline2%0Aline3");
    });

    test("handles non-string input", () => {
      expect(encodeUrl(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });

      expect(encodeUrl(null as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });
  });

  describe("decodeUrl", () => {
    test("decodes valid percent-encoded strings correctly", () => {
      expect(decodeUrl("hello")).toEqual({
        result: "hello",
        success: true,
      });

      expect(decodeUrl("Hello%20World!")).toEqual({
        result: "Hello World!",
        success: true,
      });

      expect(decodeUrl("a%26b%3Dc")).toEqual({
        result: "a&b=c",
        success: true,
      });
    });

    test("decodes empty string succeeds", () => {
      expect(decodeUrl("")).toEqual({
        result: "",
        success: true,
      });

      expect(decodeUrl("   ")).toEqual({
        result: "   ",
        success: true,
      });
    });

    test("decodes Unicode characters", () => {
      expect(decodeUrl("caf%C3%A9")).toEqual({
        result: "café",
        success: true,
      });
    });

    test("handles invalid percent-encoded strings", () => {
      expect(decodeUrl("hello%")).toEqual({
        result: "",
        success: false,
        error: "Invalid percent-encoded string",
      });

      expect(decodeUrl("hello%2")).toEqual({
        result: "",
        success: false,
        error: "Invalid percent-encoded string",
      });

      expect(decodeUrl("hello%2G")).toEqual({
        result: "",
        success: false,
        error: "Invalid percent-encoded string",
      });
    });

    test("handles non-string input", () => {
      expect(decodeUrl(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("decodes multiline encoded text", () => {
      const result = decodeUrl("line1%0Aline2%0Aline3");
      expect(result).toEqual({
        result: "line1\nline2\nline3",
        success: true,
      });
    });
  });

  describe("round-trip encoding/decoding", () => {
    test("maintains data integrity through encode-decode cycle", () => {
      const testStrings = [
        "hello world",
        "query=value&foo=bar",
        "Multi\nline\ntext",
        "!@#$%^&*()_+{}[]|\\:\";'<>?,./",
        "",
        "a",
        "café",
        "https://example.com/path?q=test",
      ];

      testStrings.forEach((original) => {
        const encoded = encodeUrl(original);
        expect(encoded.success).toBe(true);

        const decoded = decodeUrl(encoded.result);
        expect(decoded.success).toBe(true);
        expect(decoded.result).toBe(original);
      });
    });
  });

  describe("edge cases and error handling", () => {
    test("handles very long strings", () => {
      const longString = "a".repeat(10000);
      const encoded = encodeUrl(longString);
      expect(encoded.success).toBe(true);

      const decoded = decodeUrl(encoded.result);
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe(longString);
    });

    test("handles plus sign as literal in encode", () => {
      const encoded = encodeUrl("a+b");
      expect(encoded.success).toBe(true);
      expect(encoded.result).toBe("a%2Bb");
    });

    test("decodes plus as literal plus", () => {
      const decoded = decodeUrl("a%2Bb");
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe("a+b");
    });
  });
});
