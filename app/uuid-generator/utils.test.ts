import { describe, test, expect } from "vitest";
import {
  generateUuid,
  validateUuid,
  generateUuidBatch,
} from "./utils";

describe("UUID Generator Utils", () => {
  describe("generateUuid", () => {
    test("generates valid UUID v4 format", () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    test("generates unique UUIDs", () => {
      const set = new Set<string>();
      for (let i = 0; i < 100; i++) {
        set.add(generateUuid());
      }
      expect(set.size).toBe(100);
    });

    test("generates 36 characters including hyphens", () => {
      const uuid = generateUuid();
      expect(uuid.length).toBe(36);
      expect(uuid.split("-").length).toBe(5);
    });

    test("version digit is 4", () => {
      const uuid = generateUuid();
      const parts = uuid.split("-");
      expect(parts[2][0]).toBe("4");
    });
  });

  describe("validateUuid", () => {
    test("accepts valid UUID v4", () => {
      expect(validateUuid("550e8400-e29b-41d4-a716-446655440000")).toEqual({
        valid: true,
      });
      expect(validateUuid("f47ac10b-58cc-4372-a567-0e02b2c3d479")).toEqual({
        valid: true,
      });
      expect(validateUuid("550E8400-E29B-41D4-A716-446655440000")).toEqual({
        valid: true,
      });
    });

    test("rejects empty or whitespace-only input", () => {
      expect(validateUuid("")).toEqual({
        valid: false,
        error: "Enter a UUID to validate",
      });
      expect(validateUuid("   ")).toEqual({
        valid: false,
        error: "Enter a UUID to validate",
      });
    });

    test("rejects non-string input", () => {
      expect(validateUuid(123 as unknown as string)).toEqual({
        valid: false,
        error: "Input must be a string",
      });
    });

    test("rejects invalid characters", () => {
      expect(validateUuid("550e8400-e29b-41d4-a716-44665544000g")).toEqual({
        valid: false,
        error: "UUID must contain only hex digits (0-9, a-f) and hyphens",
      });
    });

    test("rejects wrong segment count", () => {
      expect(validateUuid("550e8400-e29b-41d4-a716")).toEqual({
        valid: false,
        error: "UUID must have 5 hyphen-separated segments (8-4-4-4-12)",
      });
      expect(validateUuid("550e8400e29b41d4a716446655440000")).toEqual({
        valid: false,
        error: "UUID must have 5 hyphen-separated segments (8-4-4-4-12)",
      });
    });

    test("rejects wrong segment lengths", () => {
      expect(validateUuid("550e840-e29b-41d4-a716-446655440000")).toEqual({
        valid: false,
        error: "Segment 1 should be 8 characters, got 7",
      });
    });

    test("rejects non-v4 version", () => {
      expect(validateUuid("550e8400-e29b-11d4-a716-446655440000")).toEqual({
        valid: false,
        error: "Not a valid UUID v4 (version digit must be 4)",
      });
    });

    test("rejects invalid variant", () => {
      expect(validateUuid("550e8400-e29b-41d4-0716-446655440000")).toEqual({
        valid: false,
        error:
          "Invalid variant bits (first char of 4th segment must be 8, 9, a, or b)",
      });
    });

    test("trims whitespace before validation", () => {
      expect(validateUuid("  550e8400-e29b-41d4-a716-446655440000  ")).toEqual({
        valid: true,
      });
    });
  });

  describe("generateUuidBatch", () => {
    test("generates requested count of UUIDs", () => {
      const batch = generateUuidBatch(5);
      expect(batch.length).toBe(5);
      batch.forEach((uuid) => {
        expect(validateUuid(uuid).valid).toBe(true);
      });
    });

    test("generates unique UUIDs in batch", () => {
      const batch = generateUuidBatch(50);
      const set = new Set(batch);
      expect(set.size).toBe(50);
    });

    test("clamps count to max 1000", () => {
      const batch = generateUuidBatch(2000);
      expect(batch.length).toBe(1000);
    });

    test("returns empty array for invalid count", () => {
      expect(generateUuidBatch(0)).toEqual([]);
      expect(generateUuidBatch(-1)).toEqual([]);
      expect(generateUuidBatch(1.5)).toEqual([]);
      expect(generateUuidBatch(NaN)).toEqual([]);
    });

    test("returns single UUID for count 1", () => {
      const batch = generateUuidBatch(1);
      expect(batch.length).toBe(1);
      expect(validateUuid(batch[0]).valid).toBe(true);
    });
  });
});
