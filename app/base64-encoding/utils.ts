/**
 * Base64 encoding result with status
 */
export interface Base64Result {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Encodes a string to Base64
 */
export const encodeBase64 = (input: string): Base64Result => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    // Use btoa with proper UTF-8 encoding
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return {
      result: encoded,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Unable to encode text",
    };
  }
};

/**
 * Decodes a Base64 string
 */
export const decodeBase64 = (input: string): Base64Result => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  // Handle empty string as a special case - empty string encodes to empty string
  if (!input.trim()) {
    return {
      result: "",
      success: true,
    };
  }

  if (!isValidBase64(input)) {
    return {
      result: "",
      success: false,
      error: "Invalid base64 string",
    };
  }

  try {
    // Use atob with proper UTF-8 decoding
    const decoded = decodeURIComponent(escape(atob(input)));
    return {
      result: decoded,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Invalid base64 string",
    };
  }
};

/**
 * Validates if a string is valid Base64
 */
export const isValidBase64 = (input: string): boolean => {
  if (typeof input !== "string") return false;

  // Empty string is valid Base64 (encodes to empty string)
  if (!input.trim()) return true;

  // Check Base64 format: only contains valid characters and proper padding
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(input)) return false;

  // Check length: must be multiple of 4
  if (input.length % 4 !== 0) return false;

  // Check padding: can only be at the end
  const paddingIndex = input.indexOf("=");
  if (paddingIndex !== -1) {
    // If there's padding, it must be at the end
    const paddingPart = input.substring(paddingIndex);
    if (!/^={1,2}$/.test(paddingPart)) return false;
  }

  try {
    // Test if we can decode it
    atob(input);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets information about Base64 encoded string
 */
export const getBase64Info = (input: string) => {
  const originalSize = new TextEncoder().encode(input).length;
  const encodedSize = encodeBase64(input).result.length;
  const overhead = encodedSize - originalSize;
  const overheadPercentage =
    originalSize > 0 ? (overhead / originalSize) * 100 : 0;

  return {
    originalSize,
    encodedSize,
    overhead,
    overheadPercentage: Math.round(overheadPercentage * 100) / 100,
  };
};
