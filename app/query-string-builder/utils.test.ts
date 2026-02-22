import { describe, test, expect } from "vitest";
import {
  parseQueryString,
  buildQueryString,
  type QueryParam,
} from "./utils";

describe("Query String Builder Utils", () => {
  describe("parseQueryString", () => {
    test("parses simple query string", () => {
      const result = parseQueryString("foo=bar&baz=qux");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ]);
    });

    test("parses query string with leading ?", () => {
      const result = parseQueryString("?foo=bar");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "foo", value: "bar" }]);
    });

    test("parses empty value", () => {
      const result = parseQueryString("flag=");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "flag", value: "" }]);
    });

    test("parses param without value", () => {
      const result = parseQueryString("flag");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "flag", value: "" }]);
    });

    test("decodes URL-encoded values", () => {
      const result = parseQueryString("q=hello%20world&x=%26%3D");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([
        { key: "q", value: "hello world" },
        { key: "x", value: "&=" },
      ]);
    });

    test("handles + as space", () => {
      const result = parseQueryString("q=hello+world");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "q", value: "hello world" }]);
    });

    test("handles duplicate keys (last wins)", () => {
      const result = parseQueryString("a=1&a=2&a=3");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "a", value: "3" }]);
    });

    test("returns empty params for empty string", () => {
      const result = parseQueryString("");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([]);
    });

    test("returns empty params for whitespace-only", () => {
      const result = parseQueryString("   ");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([]);
    });

    test("handles single param", () => {
      const result = parseQueryString("key=value");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "key", value: "value" }]);
    });

    test("handles empty pairs (consecutive &)", () => {
      const result = parseQueryString("a=1&&b=2");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([
        { key: "a", value: "1" },
        { key: "b", value: "2" },
      ]);
    });

    test("rejects non-string input", () => {
      const result = parseQueryString(123 as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Input must be a string");
    });

    test("trims leading and trailing whitespace", () => {
      const result = parseQueryString("  foo=bar  ");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "foo", value: "bar" }]);
    });

    test("handles value with = in it", () => {
      const result = parseQueryString("eq=a=b");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([{ key: "eq", value: "a=b" }]);
    });

    test("extracts query from full URL", () => {
      const result = parseQueryString("https://example.com/path?foo=bar&baz=qux");
      expect(result.success).toBe(true);
      expect(result.params).toEqual([
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ]);
    });
  });

  describe("buildQueryString", () => {
    test("builds from params", () => {
      const params: QueryParam[] = [
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ];
      expect(buildQueryString(params)).toBe("foo=bar&baz=qux");
    });

    test("encodes special characters", () => {
      const params: QueryParam[] = [{ key: "q", value: "hello world" }];
      expect(buildQueryString(params)).toBe("q=hello%20world");
    });

    test("encodes keys", () => {
      const params: QueryParam[] = [{ key: "my key", value: "val" }];
      expect(buildQueryString(params)).toBe("my%20key=val");
    });

    test("returns empty for empty array", () => {
      expect(buildQueryString([])).toBe("");
    });

    test("filters out params with empty key", () => {
      const params: QueryParam[] = [
        { key: "", value: "orphan" },
        { key: "valid", value: "val" },
      ];
      expect(buildQueryString(params)).toBe("valid=val");
    });

    test("handles single param", () => {
      const params: QueryParam[] = [{ key: "a", value: "1" }];
      expect(buildQueryString(params)).toBe("a=1");
    });

    test("handles empty value", () => {
      const params: QueryParam[] = [{ key: "flag", value: "" }];
      expect(buildQueryString(params)).toBe("flag=");
    });

    test("handles non-array input gracefully", () => {
      expect(buildQueryString(null as unknown as QueryParam[])).toBe("");
    });
  });

  describe("round-trip", () => {
    test("parse then build preserves structure", () => {
      const inputs = [
        "foo=bar",
        "a=1&b=2&c=3",
        "q=hello%20world",
        "flag=",
        "empty",
      ];

      for (const input of inputs) {
        const parsed = parseQueryString(input);
        expect(parsed.success).toBe(true);
        if (parsed.success && parsed.params) {
          const built = buildQueryString(parsed.params);
          const reparsed = parseQueryString(built);
          expect(reparsed.success).toBe(true);
          expect(reparsed.params).toEqual(parsed.params);
        }
      }
    });
  });
});
