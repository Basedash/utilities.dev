/**
 * Supported HMAC algorithms
 */
export type HmacAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * HMAC computation result
 */
export interface HmacResult {
  result: string;
  success: boolean;
  error?: string;
}

const ALGORITHM_MAP: Record<HmacAlgorithm, string> = {
  "SHA-1": "sha1",
  "SHA-256": "sha256",
  "SHA-384": "sha384",
  "SHA-512": "sha512",
};

/**
 * Converts ArrayBuffer to lowercase hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Computes HMAC signature using Web Crypto API (browser and Node 18+)
 */
async function computeHmacWebCrypto(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm
): Promise<HmacResult> {
  const cryptoImpl =
    typeof globalThis !== "undefined" && globalThis.crypto?.subtle
      ? globalThis.crypto
      : (await import("node:crypto")).webcrypto;

  try {
    const key = await cryptoImpl.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: algorithm },
      false,
      ["sign"]
    );

    const signature = await cryptoImpl.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(message)
    );

    return {
      result: bufferToHex(signature).toLowerCase(),
      success: true,
    };
  } catch (err) {
    return {
      result: "",
      success: false,
      error: err instanceof Error ? err.message : "HMAC computation failed",
    };
  }
}

/**
 * Computes HMAC signature using Node's crypto module (for tests)
 */
async function computeHmacNode(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm
): Promise<HmacResult> {
  const { createHmac } = await import("node:crypto");
  const nodeAlgo = ALGORITHM_MAP[algorithm];
  try {
    const hash = createHmac(nodeAlgo, secret)
      .update(message, "utf8")
      .digest("hex");
    return {
      result: hash.toLowerCase(),
      success: true,
    };
  } catch (err) {
    return {
      result: "",
      success: false,
      error: err instanceof Error ? err.message : "HMAC computation failed",
    };
  }
}

/**
 * Detects if running in Node.js
 */
function isNode(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    typeof process.versions.node === "string"
  );
}

/**
 * Computes HMAC signature for a message and secret.
 * Uses Node's crypto in Node (sync path for tests), Web Crypto API in browser.
 * Output is always lowercase hex.
 */
export async function computeHmac(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm
): Promise<HmacResult> {
  if (typeof message !== "string") {
    return {
      result: "",
      success: false,
      error: "Message must be a string",
    };
  }

  if (typeof secret !== "string") {
    return {
      result: "",
      success: false,
      error: "Secret must be a string",
    };
  }

  const validAlgorithms: HmacAlgorithm[] = [
    "SHA-1",
    "SHA-256",
    "SHA-384",
    "SHA-512",
  ];
  if (!validAlgorithms.includes(algorithm)) {
    return {
      result: "",
      success: false,
      error: `Invalid algorithm. Use one of: ${validAlgorithms.join(", ")}`,
    };
  }

  if (isNode()) {
    return await computeHmacNode(message, secret, algorithm);
  }

  return computeHmacWebCrypto(message, secret, algorithm);
}

/**
 * Validates that a string is non-empty (for UI validation)
 */
export function validateInput(value: string, fieldName: string): string | null {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}
