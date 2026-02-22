import { describe, test, expect } from "vitest";
import { parseUrl, buildUrl, type ParsedUrl } from "./utils";

describe("URL Parser Utils", () => {
  describe("parseUrl", () => {
    test("parses simple HTTPS URL", () => {
      const result = parseUrl("https://example.com/path");
      expect(result.success).toBe(true);
      expect(result.parsed).toEqual({
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/path",
        searchParams: [],
        hash: "",
      });
    });

    test("parses URL with query params", () => {
      const result = parseUrl("https://example.com?foo=bar&baz=qux");
      expect(result.success).toBe(true);
      expect(result.parsed?.searchParams).toEqual([
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ]);
    });

    test("parses URL with path and query", () => {
      const result = parseUrl("https://api.example.com/v1/users?id=123&limit=10");
      expect(result.success).toBe(true);
      expect(result.parsed?.pathname).toBe("/v1/users");
      expect(result.parsed?.searchParams).toEqual([
        { key: "id", value: "123" },
        { key: "limit", value: "10" },
      ]);
    });

    test("parses URL with hash", () => {
      const result = parseUrl("https://example.com/page#section");
      expect(result.success).toBe(true);
      expect(result.parsed?.hash).toBe("#section");
    });

    test("parses URL with port", () => {
      const result = parseUrl("https://example.com:8080/path");
      expect(result.success).toBe(true);
      expect(result.parsed?.port).toBe("8080");
    });

    test("parses URL with all components", () => {
      const result = parseUrl(
        "https://example.com:8080/api?key=val#anchor"
      );
      expect(result.success).toBe(true);
      expect(result.parsed).toEqual({
        protocol: "https:",
        host: "example.com",
        port: "8080",
        pathname: "/api",
        searchParams: [{ key: "key", value: "val" }],
        hash: "#anchor",
      });
    });

    test("parses HTTP URL", () => {
      const result = parseUrl("http://localhost:3000");
      expect(result.success).toBe(true);
      expect(result.parsed?.protocol).toBe("http:");
      expect(result.parsed?.host).toBe("localhost");
      expect(result.parsed?.port).toBe("3000");
    });

    test("parses URL with encoded query values", () => {
      const result = parseUrl("https://example.com?q=hello%20world");
      expect(result.success).toBe(true);
      expect(result.parsed?.searchParams).toEqual([
        { key: "q", value: "hello world" },
      ]);
    });

    test("parses URL with empty query value", () => {
      const result = parseUrl("https://example.com?flag=");
      expect(result.success).toBe(true);
      expect(result.parsed?.searchParams).toEqual([
        { key: "flag", value: "" },
      ]);
    });

    test("rejects empty string", () => {
      const result = parseUrl("");
      expect(result.success).toBe(false);
      expect(result.error).toContain("empty");
    });

    test("rejects whitespace-only string", () => {
      const result = parseUrl("   ");
      expect(result.success).toBe(false);
    });

    test("rejects relative URL", () => {
      const result = parseUrl("/path/to/page");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("rejects URL without scheme", () => {
      const result = parseUrl("example.com/path");
      expect(result.success).toBe(false);
    });

    test("rejects malformed URL", () => {
      const result = parseUrl("not-a-valid-url");
      expect(result.success).toBe(false);
    });

    test("handles non-string input", () => {
      const result = parseUrl(123 as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Input must be a string");
    });

    test("trims leading and trailing whitespace", () => {
      const result = parseUrl("  https://example.com  ");
      expect(result.success).toBe(true);
      expect(result.parsed?.host).toBe("example.com");
    });
  });

  describe("buildUrl", () => {
    test("builds URL from parsed parts", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/path",
        searchParams: [],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/path");
    });

    test("builds URL with query params", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [
          { key: "foo", value: "bar" },
          { key: "baz", value: "qux" },
        ],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/?foo=bar&baz=qux");
    });

    test("builds URL with port", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "8080",
        pathname: "/",
        searchParams: [],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com:8080/");
    });

    test("builds URL with hash", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/page",
        searchParams: [],
        hash: "#section",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/page#section");
    });

    test("normalizes hash when missing leading #", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/page",
        searchParams: [],
        hash: "section",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/page#section");
    });

    test("encodes query param values", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [{ key: "q", value: "hello world" }],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/?q=hello%20world");
    });

    test("encodes query param keys", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [{ key: "my key", value: "val" }],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe(
        "https://example.com/?my%20key=val"
      );
    });

    test("handles protocol without trailing colon", () => {
      const parsed: ParsedUrl = {
        protocol: "https",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/");
    });

    test("handles pathname without leading slash", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "path",
        searchParams: [],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/path");
    });

    test("omits empty port", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/");
    });

    test("omits search when no params", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [],
        hash: "#x",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/#x");
    });

    test("filters out params with empty key", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "example.com",
        port: "",
        pathname: "/",
        searchParams: [
          { key: "", value: "orphan" },
          { key: "valid", value: "val" },
        ],
        hash: "",
      };
      expect(buildUrl(parsed)).toBe("https://example.com/?valid=val");
    });
  });

  describe("round-trip parse and build", () => {
    test("parse then build preserves URL", () => {
      const urls = [
        "https://example.com/",
        "https://example.com/path",
        "https://example.com/?foo=bar",
        "https://example.com/path?foo=bar#hash",
        "http://localhost:3000/api",
      ];

      for (const url of urls) {
        const parsed = parseUrl(url);
        expect(parsed.success).toBe(true);
        if (parsed.success && parsed.parsed) {
          const rebuilt = buildUrl(parsed.parsed);
          expect(rebuilt).toBe(url);
        }
      }
    });

    test("build then parse preserves structure", () => {
      const parsed: ParsedUrl = {
        protocol: "https:",
        host: "api.example.com",
        port: "8080",
        pathname: "/v1/users",
        searchParams: [
          { key: "id", value: "123" },
          { key: "sort", value: "name" },
        ],
        hash: "#results",
      };
      const built = buildUrl(parsed);
      const result = parseUrl(built);
      expect(result.success).toBe(true);
      expect(result.parsed?.host).toBe(parsed.host);
      expect(result.parsed?.port).toBe(parsed.port);
      expect(result.parsed?.pathname).toBe(parsed.pathname);
      expect(result.parsed?.searchParams).toEqual(parsed.searchParams);
      expect(result.parsed?.hash).toBe(parsed.hash);
    });
  });
});
