/**
 * Key-value pair for query string parameters
 */
export interface QueryParam {
  key: string;
  value: string;
}

/**
 * Result of parseQueryString - either success with params or error
 */
export interface ParseQueryStringResult {
  success: boolean;
  params?: QueryParam[];
  error?: string;
}

/**
 * Parses a query string (with or without leading ?) into key-value pairs.
 * Handles URL-encoded values and duplicate keys (last value wins).
 */
export function parseQueryString(input: string): ParseQueryStringResult {
  if (typeof input !== "string") {
    return {
      success: false,
      error: "Input must be a string",
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: true,
      params: [],
    };
  }

  let queryPart = trimmed.startsWith("?") ? trimmed.slice(1) : trimmed;

  // If input looks like a full URL, extract the query string
  if (trimmed.includes("://")) {
    try {
      const url = new URL(trimmed);
      queryPart = url.search ? url.search.slice(1) : "";
    } catch {
      // Not a valid URL, use as-is
    }
  }
  const params: QueryParam[] = [];
  const seen = new Map<string, number>();

  try {
    for (const pair of queryPart.split("&")) {
      if (!pair) continue;

      const eqIndex = pair.indexOf("=");
      const key =
        eqIndex >= 0
          ? decodeURIComponent(pair.slice(0, eqIndex).replace(/\+/g, " "))
          : decodeURIComponent(pair.replace(/\+/g, " "));
      const value =
        eqIndex >= 0
          ? decodeURIComponent(pair.slice(eqIndex + 1).replace(/\+/g, " "))
          : "";

      const existingIndex = seen.get(key);
      if (existingIndex !== undefined) {
        params[existingIndex] = { key, value };
      } else {
        seen.set(key, params.length);
        params.push({ key, value });
      }
    }

    return {
      success: true,
      params,
    };
  } catch {
    return {
      success: false,
      error: "Invalid query string format",
    };
  }
}

/**
 * Builds a query string from an array of key-value pairs.
 * Skips params with empty key. URL-encodes keys and values.
 */
export function buildQueryString(params: QueryParam[]): string {
  if (!Array.isArray(params) || params.length === 0) {
    return "";
  }

  const encoded = params
    .filter((p) => p.key !== "")
    .map(
      (p) =>
        `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
    );

  return encoded.join("&");
}
