/**
 * Supported hash algorithms (Web Crypto API names)
 */
export const HASH_ALGORITHMS = [
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
] as const;

export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];
type SubtleCryptoLike = Pick<SubtleCrypto, "digest">;

/**
 * Hash result with status
 */
export interface HashResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Converts an ArrayBuffer to a lowercase hex string.
 * Pure function for testability.
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validates that the algorithm is supported.
 */
export function isValidAlgorithm(algorithm: string): algorithm is HashAlgorithm {
  return HASH_ALGORITHMS.includes(algorithm as HashAlgorithm);
}

/**
 * Gets the SubtleCrypto implementation.
 * Uses Web Crypto in browser, Node crypto in test/Node environments.
 */
async function getSubtleCrypto(): Promise<SubtleCryptoLike> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    return crypto.subtle;
  }
  const { webcrypto } = await import("node:crypto");
  return webcrypto.subtle;
}

/**
 * Hashes input text with the given algorithm.
 * Returns lowercase hex string on success.
 */
export async function hashText(
  input: string,
  algorithm: HashAlgorithm,
  subtleCrypto?: SubtleCryptoLike
): Promise<HashResult> {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  if (!isValidAlgorithm(algorithm)) {
    return {
      result: "",
      success: false,
      error: `Unsupported algorithm: ${algorithm}`,
    };
  }

  try {
    const cryptoImpl = subtleCrypto ?? (await getSubtleCrypto());
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const buffer = await cryptoImpl.digest(algorithm, data);
    const hex = bufferToHex(buffer);
    return { result: hex, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Hashing failed";
    return {
      result: "",
      success: false,
      error: message,
    };
  }
}
