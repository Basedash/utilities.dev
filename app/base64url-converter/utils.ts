/**
 * Base64URL conversion result with status
 */
export interface Base64UrlResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Encodes a string to Base64URL (no padding, URL-safe chars).
 */
export function encodeBase64Url(input: string): Base64UrlResult {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    const base64url = encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return { result: base64url, success: true };
  } catch {
    return {
      result: "",
      success: false,
      error: "Unable to encode text",
    };
  }
}

/**
 * Decodes a Base64URL string.
 */
export function decodeBase64Url(input: string): Base64UrlResult {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { result: "", success: true };
  }

  if (!isValidBase64Url(trimmed)) {
    return {
      result: "",
      success: false,
      error: "Invalid Base64URL string",
    };
  }

  try {
    let base64 = trimmed.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    const decoded = decodeURIComponent(escape(atob(base64)));
    return { result: decoded, success: true };
  } catch {
    return {
      result: "",
      success: false,
      error: "Invalid Base64URL string",
    };
  }
}

/**
 * Validates if a string is valid Base64URL (alphanumeric, -, _).
 */
export function isValidBase64Url(input: string): boolean {
  if (typeof input !== "string") return false;
  if (!input.trim()) return true;

  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  if (!base64urlRegex.test(input)) return false;

  try {
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    atob(base64);
    return true;
  } catch {
    return false;
  }
}
