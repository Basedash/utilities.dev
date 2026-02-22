import { describe, test, expect } from "vitest";
import { computeHmac, validateInput, type HmacAlgorithm } from "./utils";

describe("HMAC Generator Utils", () => {
  const algorithms: HmacAlgorithm[] = [
    "SHA-1",
    "SHA-256",
    "SHA-384",
    "SHA-512",
  ];

  describe("computeHmac", () => {
    test("returns lowercase hex output", async () => {
      const result = await computeHmac("message", "secret", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]+$/);
      expect(result.result).toBe(result.result.toLowerCase());
    });

    test("produces deterministic output for same inputs", async () => {
      const r1 = await computeHmac("hello", "key", "SHA-256");
      const r2 = await computeHmac("hello", "key", "SHA-256");
      expect(r1.result).toBe(r2.result);
    });

    test("different messages produce different hashes", async () => {
      const r1 = await computeHmac("msg1", "secret", "SHA-256");
      const r2 = await computeHmac("msg2", "secret", "SHA-256");
      expect(r1.result).not.toBe(r2.result);
    });

    test("different secrets produce different hashes", async () => {
      const r1 = await computeHmac("message", "secret1", "SHA-256");
      const r2 = await computeHmac("message", "secret2", "SHA-256");
      expect(r1.result).not.toBe(r2.result);
    });

    test("supports all algorithms", async () => {
      for (const algo of algorithms) {
        const result = await computeHmac("test", "secret", algo);
        expect(result.success).toBe(true);
        expect(result.result.length).toBeGreaterThan(0);
        expect(result.result).toMatch(/^[a-f0-9]+$/);
      }
    });

    test("output length matches expected digest size", async () => {
      const expectedLengths: Record<HmacAlgorithm, number> = {
        "SHA-1": 40,
        "SHA-256": 64,
        "SHA-384": 96,
        "SHA-512": 128,
      };
      for (const algo of algorithms) {
        const result = await computeHmac("x", "y", algo);
        expect(result.result.length).toBe(expectedLengths[algo]);
      }
    });

    test("handles empty message", async () => {
      const result = await computeHmac("", "secret", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]+$/);
    });

    test("handles empty secret", async () => {
      const result = await computeHmac("message", "", "SHA-256");
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]+$/);
    });

    test("handles special characters in message and secret", async () => {
      const result = await computeHmac(
        "hello\nworld\t!@#$",
        "sec\r\nret",
        "SHA-256"
      );
      expect(result.success).toBe(true);
      expect(result.result).toMatch(/^[a-f0-9]+$/);
    });

    test("handles non-string message", async () => {
      const result = await computeHmac(
        123 as unknown as string,
        "secret",
        "SHA-256"
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe("Message must be a string");
    });

    test("handles non-string secret", async () => {
      const result = await computeHmac(
        "message",
        null as unknown as string,
        "SHA-256"
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe("Secret must be a string");
    });

    test("handles invalid algorithm", async () => {
      const result = await computeHmac(
        "message",
        "secret",
        "INVALID" as HmacAlgorithm
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid algorithm");
    });

    test("produces known HMAC-SHA256 for RFC 4231 test vector", async () => {
      const result = await computeHmac(
        "Hi There",
        Buffer.from(
          "0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b",
          "hex"
        ).toString("latin1"),
        "SHA-256"
      );
      expect(result.success).toBe(true);
      expect(result.result).toBe(
        "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7"
      );
    });
  });

  describe("validateInput", () => {
    test("returns null for non-empty string", () => {
      expect(validateInput("hello", "Message")).toBeNull();
      expect(validateInput("  text  ", "Secret")).toBeNull();
    });

    test("returns error for empty string", () => {
      expect(validateInput("", "Message")).toBe("Message is required");
      expect(validateInput("   ", "Secret")).toBe("Secret is required");
    });

    test("returns error for non-string", () => {
      expect(validateInput(123 as unknown as string, "Field")).toBe(
        "Field must be a string"
      );
    });
  });
});
