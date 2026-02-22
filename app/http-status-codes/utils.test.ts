import { describe, test, expect } from "vitest";
import {
  filterStatusCodes,
  getCategoryFromCode,
  groupByCategory,
  HTTP_STATUS_CODES,
  HTTP_STATUS_CATEGORIES,
  HTTP_CATEGORY_LABELS,
  type HttpStatusCategory,
  type HttpStatusEntry,
} from "./utils";

describe("HTTP Status Codes Utils", () => {
  describe("filterStatusCodes", () => {
    test("returns all codes when query is empty", () => {
      const result = filterStatusCodes("", null);
      expect(result).toHaveLength(HTTP_STATUS_CODES.length);
    });

    test("returns all codes when query is whitespace only", () => {
      const result = filterStatusCodes("   ", null);
      expect(result).toHaveLength(HTTP_STATUS_CODES.length);
    });

    test("filters by exact code", () => {
      const result = filterStatusCodes("404", null);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(404);
      expect(result[0].name).toBe("Not Found");
    });

    test("filters by code prefix", () => {
      const result = filterStatusCodes("4", null);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((e) => e.code.toString().startsWith("4"))).toBe(true);
    });

    test("filters by phrase in name", () => {
      const result = filterStatusCodes("not found", null);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((e) => e.name.toLowerCase().includes("not found"))).toBe(true);
    });

    test("filters by phrase in description", () => {
      const result = filterStatusCodes("rate limit", null);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((e) => e.description.toLowerCase().includes("rate limit"))).toBe(true);
    });

    test("search is case-insensitive", () => {
      const lower = filterStatusCodes("unauthorized", null);
      const upper = filterStatusCodes("UNAUTHORIZED", null);
      expect(lower).toEqual(upper);
      expect(lower.length).toBeGreaterThan(0);
    });

    test("respects category filter when query empty", () => {
      const result = filterStatusCodes("", "4xx");
      expect(result.every((e) => e.category === "4xx")).toBe(true);
      expect(result.length).toBeLessThan(HTTP_STATUS_CODES.length);
    });

    test("respects category filter with query", () => {
      const result = filterStatusCodes("not", "4xx");
      expect(result.every((e) => e.category === "4xx")).toBe(true);
      expect(result.some((e) => e.code === 404)).toBe(true);
    });

    test("returns empty when no match", () => {
      const result = filterStatusCodes("xyznonexistent999", null);
      expect(result).toHaveLength(0);
    });

    test("handles null query as empty", () => {
      const result = filterStatusCodes(null as unknown as string, null);
      expect(result).toHaveLength(HTTP_STATUS_CODES.length);
    });
  });

  describe("getCategoryFromCode", () => {
    test("returns 1xx for 100-199", () => {
      expect(getCategoryFromCode(100)).toBe("1xx");
      expect(getCategoryFromCode(199)).toBe("1xx");
    });

    test("returns 2xx for 200-299", () => {
      expect(getCategoryFromCode(200)).toBe("2xx");
      expect(getCategoryFromCode(299)).toBe("2xx");
    });

    test("returns 3xx for 300-399", () => {
      expect(getCategoryFromCode(300)).toBe("3xx");
      expect(getCategoryFromCode(399)).toBe("3xx");
    });

    test("returns 4xx for 400-499", () => {
      expect(getCategoryFromCode(400)).toBe("4xx");
      expect(getCategoryFromCode(404)).toBe("4xx");
      expect(getCategoryFromCode(499)).toBe("4xx");
    });

    test("returns 5xx for 500-599", () => {
      expect(getCategoryFromCode(500)).toBe("5xx");
      expect(getCategoryFromCode(599)).toBe("5xx");
    });

    test("returns null for out-of-range codes", () => {
      expect(getCategoryFromCode(99)).toBeNull();
      expect(getCategoryFromCode(600)).toBeNull();
    });
  });

  describe("groupByCategory", () => {
    test("groups entries by category", () => {
      const entries: HttpStatusEntry[] = [
        { code: 200, name: "OK", description: "Success", category: "2xx" },
        { code: 404, name: "Not Found", description: "Missing", category: "4xx" },
        { code: 201, name: "Created", description: "Created", category: "2xx" },
      ];
      const grouped = groupByCategory(entries);
      expect(grouped.get("2xx")).toHaveLength(2);
      expect(grouped.get("4xx")).toHaveLength(1);
      expect(grouped.get("1xx")).toHaveLength(0);
    });

    test("includes all categories in map", () => {
      const grouped = groupByCategory(HTTP_STATUS_CODES);
      for (const cat of HTTP_STATUS_CATEGORIES) {
        expect(grouped.has(cat)).toBe(true);
        expect(Array.isArray(grouped.get(cat))).toBe(true);
      }
    });
  });

  describe("constants", () => {
    test("HTTP_STATUS_CATEGORIES has 5 items", () => {
      expect(HTTP_STATUS_CATEGORIES).toHaveLength(5);
      expect(HTTP_STATUS_CATEGORIES).toEqual(["1xx", "2xx", "3xx", "4xx", "5xx"]);
    });

    test("HTTP_CATEGORY_LABELS has label for each category", () => {
      for (const cat of HTTP_STATUS_CATEGORIES) {
        expect(HTTP_CATEGORY_LABELS[cat as HttpStatusCategory]).toBeDefined();
        expect(typeof HTTP_CATEGORY_LABELS[cat as HttpStatusCategory]).toBe("string");
      }
    });

    test("HTTP_STATUS_CODES entries have required fields", () => {
      for (const entry of HTTP_STATUS_CODES) {
        expect(typeof entry.code).toBe("number");
        expect(typeof entry.name).toBe("string");
        expect(typeof entry.description).toBe("string");
        expect(HTTP_STATUS_CATEGORIES).toContain(entry.category);
      }
    });
  });
});
