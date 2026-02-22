/**
 * URL encoding result with status
 */
export interface UrlEncodingResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Encodes a string to URL percent-encoding (RFC 3986)
 * Uses encodeURIComponent for query parameter and path segment values
 */
export const encodeUrl = (input: string): UrlEncodingResult => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    const encoded = encodeURIComponent(input);
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
 * Decodes a URL percent-encoded string
 */
export const decodeUrl = (input: string): UrlEncodingResult => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  if (input === "") {
    return {
      result: "",
      success: true,
    };
  }

  try {
    const decoded = decodeURIComponent(input);
    return {
      result: decoded,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Invalid percent-encoded string",
    };
  }
};
