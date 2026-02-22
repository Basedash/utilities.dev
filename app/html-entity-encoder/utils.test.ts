import { describe, test, expect } from "vitest";
import { encodeHtmlEntities, decodeHtmlEntities } from "./utils";

describe("HTML Entity Encoder Utils", () => {
  describe("encodeHtmlEntities", () => {
    test("encodes special characters to entities", () => {
      expect(encodeHtmlEntities("<script>")).toEqual({
        result: "&lt;script&gt;",
        success: true,
      });
      expect(encodeHtmlEntities('"hello"')).toEqual({
        result: "&quot;hello&quot;",
        success: true,
      });
      expect(encodeHtmlEntities("it's")).toEqual({
        result: "it&apos;s",
        success: true,
      });
      expect(encodeHtmlEntities("a & b")).toEqual({
        result: "a &amp; b",
        success: true,
      });
    });

    test("encodes empty string", () => {
      expect(encodeHtmlEntities("")).toEqual({
        result: "",
        success: true,
      });
    });

    test("leaves non-special characters unchanged", () => {
      expect(encodeHtmlEntities("hello world")).toEqual({
        result: "hello world",
        success: true,
      });
      expect(encodeHtmlEntities("123")).toEqual({
        result: "123",
        success: true,
      });
    });

    test("encodes all five special chars together", () => {
      expect(encodeHtmlEntities('<>&"\'')).toEqual({
        result: "&lt;&gt;&amp;&quot;&apos;",
        success: true,
      });
    });

    test("handles non-string input", () => {
      expect(encodeHtmlEntities(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
      expect(encodeHtmlEntities(null as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("encodes multiline text", () => {
      const input = "line1\n<tag>\nline2";
      expect(encodeHtmlEntities(input)).toEqual({
        result: "line1\n&lt;tag&gt;\nline2",
        success: true,
      });
    });
  });

  describe("decodeHtmlEntities", () => {
    test("decodes named entities", () => {
      expect(decodeHtmlEntities("&lt;script&gt;")).toEqual({
        result: "<script>",
        success: true,
      });
      expect(decodeHtmlEntities("&quot;hello&quot;")).toEqual({
        result: '"hello"',
        success: true,
      });
      expect(decodeHtmlEntities("it&apos;s")).toEqual({
        result: "it's",
        success: true,
      });
      expect(decodeHtmlEntities("a &amp; b")).toEqual({
        result: "a & b",
        success: true,
      });
    });

    test("decodes decimal numeric entities", () => {
      expect(decodeHtmlEntities("&#60;")).toEqual({
        result: "<",
        success: true,
      });
      expect(decodeHtmlEntities("&#65;&#66;&#67;")).toEqual({
        result: "ABC",
        success: true,
      });
      expect(decodeHtmlEntities("&#32;")).toEqual({
        result: " ",
        success: true,
      });
    });

    test("decodes hex numeric entities", () => {
      expect(decodeHtmlEntities("&#x3C;")).toEqual({
        result: "<",
        success: true,
      });
      expect(decodeHtmlEntities("&#x41;&#x42;&#x43;")).toEqual({
        result: "ABC",
        success: true,
      });
      expect(decodeHtmlEntities("&#X7B;")).toEqual({
        result: "{",
        success: true,
      });
    });

    test("decodes empty string", () => {
      expect(decodeHtmlEntities("")).toEqual({
        result: "",
        success: true,
      });
    });

    test("leaves non-entity text unchanged", () => {
      expect(decodeHtmlEntities("hello world")).toEqual({
        result: "hello world",
        success: true,
      });
    });

    test("leaves unknown named entities as-is", () => {
      expect(decodeHtmlEntities("&unknown;")).toEqual({
        result: "&unknown;",
        success: true,
      });
      expect(decodeHtmlEntities("&foo123;")).toEqual({
        result: "&foo123;",
        success: true,
      });
    });

    test("decodes common entities: nbsp, copy, reg, trade", () => {
      expect(decodeHtmlEntities("&nbsp;")).toEqual({
        result: "\u00A0",
        success: true,
      });
      expect(decodeHtmlEntities("&copy;")).toEqual({
        result: "\u00A9",
        success: true,
      });
      expect(decodeHtmlEntities("&reg;")).toEqual({
        result: "\u00AE",
        success: true,
      });
      expect(decodeHtmlEntities("&trade;")).toEqual({
        result: "\u2122",
        success: true,
      });
    });

    test("leaves ambiguous ampersands without semicolon as-is", () => {
      expect(decodeHtmlEntities("&amp")).toEqual({
        result: "&amp",
        success: true,
      });
      expect(decodeHtmlEntities("&lt")).toEqual({
        result: "&lt",
        success: true,
      });
    });

    test("handles non-string input", () => {
      expect(decodeHtmlEntities(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("decodes mixed content", () => {
      expect(decodeHtmlEntities("Price: &#36;100 &amp; tax")).toEqual({
        result: "Price: $100 & tax",
        success: true,
      });
    });

    test("handles invalid decimal range", () => {
      expect(decodeHtmlEntities("&#9999999;")).toEqual({
        result: "&#9999999;",
        success: true,
      });
    });

  });

  describe("round-trip encoding/decoding", () => {
    test("encode then decode preserves special chars", () => {
      const inputs = [
        "<script>alert(1)</script>",
        '"quoted"',
        "it's",
        "a & b",
        '<>&"\'',
      ];
      for (const input of inputs) {
        const encoded = encodeHtmlEntities(input);
        expect(encoded.success).toBe(true);
        const decoded = decodeHtmlEntities(encoded.result);
        expect(decoded.success).toBe(true);
        expect(decoded.result).toBe(input);
      }
    });

    test("decode then encode preserves entity structure for basic chars", () => {
      const inputs = ["&lt;", "&amp;", "&quot;"];
      for (const input of inputs) {
        const decoded = decodeHtmlEntities(input);
        expect(decoded.success).toBe(true);
        const encoded = encodeHtmlEntities(decoded.result);
        expect(encoded.success).toBe(true);
        expect(decodeHtmlEntities(encoded.result).result).toBe(decoded.result);
      }
    });
  });

  describe("edge cases", () => {
    test("handles very long strings", () => {
      const long = "<".repeat(1000);
      const encoded = encodeHtmlEntities(long);
      expect(encoded.success).toBe(true);
      expect(encoded.result).toBe("&lt;".repeat(1000));

      const decoded = decodeHtmlEntities(encoded.result);
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe(long);
    });

    test("handles Unicode characters", () => {
      const input = "Hello \u00A9 World";
      const encoded = encodeHtmlEntities(input);
      expect(encoded.success).toBe(true);
      expect(encoded.result).toBe("Hello \u00A9 World");

      expect(decodeHtmlEntities("&#169;")).toEqual({
        result: "\u00A9",
        success: true,
      });
    });

    test("handles decimal entity at boundary", () => {
      expect(decodeHtmlEntities("&#0;")).toEqual({
        result: "\u0000",
        success: true,
      });
    });

    test("handles hex entity at boundary", () => {
      expect(decodeHtmlEntities("&#x0;")).toEqual({
        result: "\u0000",
        success: true,
      });
    });

    test("handles multiple entities in sequence", () => {
      expect(decodeHtmlEntities("&lt;&gt;&amp;&quot;&apos;")).toEqual({
        result: '<>&"\'',
        success: true,
      });
    });

    test("handles bare ampersand in text", () => {
      expect(decodeHtmlEntities("foo & bar")).toEqual({
        result: "foo & bar",
        success: true,
      });
    });

    test("handles malformed entity-like patterns", () => {
      expect(decodeHtmlEntities("&#")).toEqual({
        result: "&#",
        success: true,
      });
      expect(decodeHtmlEntities("&#x")).toEqual({
        result: "&#x",
        success: true,
      });
    });
  });
});
