import { describe, test, expect } from "vitest";
import {
  bufferToHex,
  isValidAlgorithm,
  hashText,
  HASH_ALGORITHMS,
  type HashAlgorithm,
} from "./utils";

describe("Hash Generator Utils", () => {
  describe("bufferToHex", () => {
    test("converts ArrayBuffer to lowercase hex string", () => {
      const buf = new Uint8Array([0x2c, 0xf2, 0x4d, 0xba]).buffer;
      expect(bufferToHex(buf)).toBe("2cf24dba");
    });

    test("handles empty buffer", () => {
      expect(bufferToHex(new ArrayBuffer(0))).toBe("");
    });

    test("pads single-digit bytes with leading zero", () => {
      const buf = new Uint8Array([0x0a, 0x0f]).buffer;
      expect(bufferToHex(buf)).toBe("0a0f");
    });

    test("handles full byte range", () => {
      const buf = new Uint8Array([0x00, 0xff]).buffer;
      expect(bufferToHex(buf)).toBe("00ff");
    });
  });

  describe("isValidAlgorithm", () => {
    test("accepts all supported algorithms", () => {
      expect(isValidAlgorithm("SHA-1")).toBe(true);
      expect(isValidAlgorithm("SHA-256")).toBe(true);
      expect(isValidAlgorithm("SHA-384")).toBe(true);
      expect(isValidAlgorithm("SHA-512")).toBe(true);
    });

    test("rejects unsupported algorithms", () => {
      expect(isValidAlgorithm("MD5")).toBe(false);
      expect(isValidAlgorithm("SHA-224")).toBe(false);
      expect(isValidAlgorithm("")).toBe(false);
      expect(isValidAlgorithm("sha-256")).toBe(false);
    });
  });

  describe("hashText", () => {
    test("hashes with SHA-256 correctly", async () => {
      const result = await hashText("hello", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toBe(
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
      );
    });

    test("hashes with SHA-1 correctly", async () => {
      const result = await hashText("hello", "SHA-1");
      expect(result.success).toBe(true);
      expect(result.result).toBe(
        "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
      );
    });

    test("hashes with SHA-384 correctly", async () => {
      const result = await hashText("hello", "SHA-384");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]{96}$/);
    });

    test("hashes with SHA-512 correctly", async () => {
      const result = await hashText("hello", "SHA-512");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]{128}$/);
    });

    test("returns lowercase hex output", async () => {
      const result = await hashText("test", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toBe(result.result.toLowerCase());
      expect(result.result).toMatch(/^[a-f0-9]+$/);
    });

    test("handles empty string", async () => {
      const result = await hashText("", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toBe(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      );
    });

    test("handles non-string input", async () => {
      const result = await hashText(123 as unknown as string, "SHA-256");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Input must be a string");
    });

    test("handles invalid algorithm", async () => {
      const result = await hashText("hello", "MD5" as HashAlgorithm);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Unsupported algorithm");
    });

    test("produces different hashes for different algorithms", async () => {
      const input = "hello";
      const results = await Promise.all(
        HASH_ALGORITHMS.map((algo) => hashText(input, algo))
      );
      const hashes = results.map((r) => r.result);
      const unique = new Set(hashes);
      expect(unique.size).toBe(HASH_ALGORITHMS.length);
    });

    test("produces consistent output for same input", async () => {
      const r1 = await hashText("consistent", "SHA-256");
      const r2 = await hashText("consistent", "SHA-256");
      expect(r1.result).toBe(r2.result);
    });
  });
});
