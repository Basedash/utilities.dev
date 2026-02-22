import { describe, test, expect } from "vitest";
import { computeCrc32 } from "./utils";

describe("CRC32 Checksum Utils", () => {
  describe("computeCrc32", () => {
    test("computes known CRC32 values", () => {
      // "hello" - common test vector
      const hello = computeCrc32("hello");
      expect(hello.success).toBe(true);
      expect(hello.result).toMatch(/^[a-f0-9]{8}$/);
      expect(hello.result).toBe("3610a686");

      const empty = computeCrc32("");
      expect(empty.success).toBe(true);
      expect(empty.result).toBe("00000000");
    });

    test("returns lowercase 8-char hex", () => {
      const result = computeCrc32("test");
      expect(result.success).toBe(true);
      expect(result.result).toBe(result.result.toLowerCase());
      expect(result.result).toHaveLength(8);
      expect(result.result).toMatch(/^[a-f0-9]{8}$/);
    });

    test("handles empty string", () => {
      expect(computeCrc32("")).toEqual({
        result: "00000000",
        success: true,
      });
    });

    test("handles Unicode", () => {
      const result = computeCrc32("🚀");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]{8}$/);
    });

    test("handles non-string input", () => {
      expect(computeCrc32(123 as unknown as string)).toEqual({
        result: "",
        success: false,
        error: "Input must be a string",
      });
    });

    test("is deterministic", () => {
      const r1 = computeCrc32("consistent");
      const r2 = computeCrc32("consistent");
      expect(r1.result).toBe(r2.result);
    });

    test("produces different output for different input", () => {
      const r1 = computeCrc32("a");
      const r2 = computeCrc32("b");
      expect(r1.result).not.toBe(r2.result);
    });

    test("handles long strings", () => {
      const long = "a".repeat(10000);
      const result = computeCrc32(long);
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]{8}$/);
    });

    test("handles special characters", () => {
      const result = computeCrc32("!@#$%^&*()\n\t");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]{8}$/);
    });
  });
});
