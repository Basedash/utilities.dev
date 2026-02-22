import { describe, test, expect } from "vitest";
import { parseDataUrl } from "./utils";

describe("Data URL Parser Utils", () => {
  describe("parseDataUrl", () => {
    test("parses simple text data URL", () => {
      const result = parseDataUrl("data:text/plain,hello");
      expect(result.success).toBe(true);
      expect(result.parsed).toEqual({
        mediaType: "text/plain",
        base64: false,
        data: "hello",
        decodedData: "hello",
      });
    });

    test("parses base64 data URL", () => {
      const result = parseDataUrl("data:text/plain;base64,aGVsbG8=");
      expect(result.success).toBe(true);
      expect(result.parsed?.base64).toBe(true);
      expect(result.parsed?.decodedData).toBe("hello");
    });

    test("parses with charset", () => {
      const result = parseDataUrl("data:text/plain;charset=UTF-8,hello");
      expect(result.success).toBe(true);
      expect(result.parsed?.mediaType).toBe("text/plain");
      expect(result.parsed?.charset).toBe("UTF-8");
    });

    test("parses image/png base64", () => {
      const result = parseDataUrl("data:image/png;base64,iVBORw0KGgo=");
      expect(result.success).toBe(true);
      expect(result.parsed?.mediaType).toBe("image/png");
      expect(result.parsed?.base64).toBe(true);
    });

    test("parses URL-encoded data", () => {
      const result = parseDataUrl("data:text/plain,hello%20world");
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe("hello world");
    });

    test("handles empty data", () => {
      const result = parseDataUrl("data:text/plain,");
      expect(result.success).toBe(true);
      expect(result.parsed?.data).toBe("");
      expect(result.parsed?.decodedData).toBe("");
    });

    test("handles base64 with empty data", () => {
      const result = parseDataUrl("data:text/plain;base64,");
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe("");
    });

    test("rejects empty string", () => {
      const result = parseDataUrl("");
      expect(result.success).toBe(false);
      expect(result.error).toContain("empty");
    });

    test("rejects string not starting with data:", () => {
      const result = parseDataUrl("https://example.com");
      expect(result.success).toBe(false);
      expect(result.error).toContain("data:");
    });

    test("rejects data URL without comma", () => {
      const result = parseDataUrl("data:text/plain");
      expect(result.success).toBe(false);
      expect(result.error).toContain("comma");
    });

    test("rejects invalid base64", () => {
      const result = parseDataUrl("data:text/plain;base64,!!!invalid!!!");
      expect(result.success).toBe(false);
      expect(result.error).toContain("base64");
    });

    test("rejects non-string input", () => {
      const result = parseDataUrl(123 as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Input must be a string");
    });

    test("trims whitespace", () => {
      const result = parseDataUrl("  data:text/plain,hello  ");
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe("hello");
    });

    test("handles data: with only base64 and comma", () => {
      const result = parseDataUrl("data:;base64,aGVsbG8=");
      expect(result.success).toBe(true);
      expect(result.parsed?.mediaType).toBe("text/plain");
      expect(result.parsed?.decodedData).toBe("hello");
    });

    test("handles + as space in non-base64", () => {
      const result = parseDataUrl("data:text/plain,hello+world");
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe("hello world");
    });

    test("handles base64 with whitespace in data", () => {
      const result = parseDataUrl("data:text/plain;base64,aGVs bG8=");
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe("hello");
    });

    test("parses application/json", () => {
      const result = parseDataUrl("data:application/json,{\"a\":1}");
      expect(result.success).toBe(true);
      expect(result.parsed?.mediaType).toBe("application/json");
      expect(result.parsed?.decodedData).toBe("{\"a\":1}");
    });

    test("parses HTML base64", () => {
      const html = "<html></html>";
      const b64 = btoa(unescape(encodeURIComponent(html)));
      const result = parseDataUrl(`data:text/html;base64,${b64}`);
      expect(result.success).toBe(true);
      expect(result.parsed?.decodedData).toBe(html);
    });
  });
});
