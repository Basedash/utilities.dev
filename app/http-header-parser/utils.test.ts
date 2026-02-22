import { describe, test, expect } from "vitest";
import {
  parseHttpHeaders,
  formatHttpHeaders,
  type ParsedHeader,
} from "./utils";

describe("HTTP Header Parser Utils", () => {
  describe("parseHttpHeaders", () => {
    test("parses simple headers", () => {
      const input = "Content-Type: application/json\nAuthorization: Bearer token";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "Content-Type", value: "application/json" },
        { name: "Authorization", value: "Bearer token" },
      ]);
    });

    test("parses headers with CRLF", () => {
      const input = "Content-Type: application/json\r\nAccept: */*";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "*/*" },
      ]);
    });

    test("extracts status line", () => {
      const input = "HTTP/1.1 200 OK\nContent-Type: text/html";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.statusLine).toBe("HTTP/1.1 200 OK");
      expect(result.headers).toEqual([
        { name: "Content-Type", value: "text/html" },
      ]);
    });

    test("handles HTTP/2 status line", () => {
      const input = "HTTP/2 200\ncontent-type: application/json";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.statusLine).toBe("HTTP/2 200");
    });

    test("handles header value with colon", () => {
      const input = "Date: Wed, 21 Oct 2015 07:28:00 GMT";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "Date", value: "Wed, 21 Oct 2015 07:28:00 GMT" },
      ]);
    });

    test("trims leading space after colon", () => {
      const input = "Content-Type:   application/json";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "Content-Type", value: "application/json" },
      ]);
    });

    test("skips empty lines", () => {
      const input = "A: 1\n\nB: 2\n\n";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "A", value: "1" },
        { name: "B", value: "2" },
      ]);
    });

    test("returns empty for empty string", () => {
      const result = parseHttpHeaders("");
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([]);
    });

    test("returns empty for whitespace-only", () => {
      const result = parseHttpHeaders("   \n  \n  ");
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([]);
    });

    test("skips lines without colon", () => {
      const input = "Content-Type: application/json\nnot-a-header\nAccept: */*";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "*/*" },
      ]);
    });

    test("handles empty header value", () => {
      const input = "X-Custom:";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers).toEqual([{ name: "X-Custom", value: "" }]);
    });

    test("rejects non-string input", () => {
      const result = parseHttpHeaders(123 as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Input must be a string");
    });

    test("preserves header name case", () => {
      const input = "Content-Type: application/json";
      const result = parseHttpHeaders(input);
      expect(result.success).toBe(true);
      expect(result.headers?.[0].name).toBe("Content-Type");
    });
  });

  describe("formatHttpHeaders", () => {
    test("formats headers", () => {
      const headers: ParsedHeader[] = [
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "*/*" },
      ];
      expect(formatHttpHeaders(headers)).toBe(
        "Content-Type: application/json\r\nAccept: */*"
      );
    });

    test("includes status line when provided", () => {
      const headers: ParsedHeader[] = [{ name: "Content-Type", value: "text/html" }];
      expect(formatHttpHeaders(headers, "HTTP/1.1 200 OK")).toBe(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html"
      );
    });

    test("returns empty for empty array", () => {
      expect(formatHttpHeaders([])).toBe("");
    });

    test("handles single header", () => {
      const headers: ParsedHeader[] = [{ name: "X-Request-ID", value: "abc" }];
      expect(formatHttpHeaders(headers)).toBe("X-Request-ID: abc");
    });
  });

  describe("round-trip", () => {
    test("parse then format preserves structure", () => {
      const input =
        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccept: */*";
      const parsed = parseHttpHeaders(input);
      expect(parsed.success).toBe(true);
      if (parsed.success && parsed.headers) {
        const formatted = formatHttpHeaders(parsed.headers, parsed.statusLine);
        const reparsed = parseHttpHeaders(formatted);
        expect(reparsed.success).toBe(true);
        expect(reparsed.headers).toEqual(parsed.headers);
        expect(reparsed.statusLine).toBe(parsed.statusLine);
      }
    });
  });
});
