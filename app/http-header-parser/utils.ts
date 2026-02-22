/**
 * Parsed HTTP header
 */
export interface ParsedHeader {
  name: string;
  value: string;
}

/**
 * Result of parseHttpHeaders
 */
export interface ParseHttpHeadersResult {
  success: boolean;
  headers?: ParsedHeader[];
  statusLine?: string;
  error?: string;
}

/**
 * Parses raw HTTP header text (e.g. from request/response copy-paste).
 * Handles CRLF and LF line endings. First line starting with HTTP/ is treated as status line.
 */
export function parseHttpHeaders(input: string): ParseHttpHeadersResult {
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
      headers: [],
    };
  }

  const lines = trimmed.split(/\r?\n/);
  const headers: ParsedHeader[] = [];
  let statusLine: string | undefined;

  for (const line of lines) {
    const trimmedLine = line.trimEnd();
    if (!trimmedLine) continue;

    // Detect HTTP status line (HTTP/1.1 200 OK, HTTP/2 200, etc.)
    if (trimmedLine.startsWith("HTTP/")) {
      statusLine = trimmedLine;
      continue;
    }

    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex < 0) {
      // No colon - treat as malformed, skip or could be continuation
      continue;
    }

    const name = trimmedLine.slice(0, colonIndex).trim();
    const value = trimmedLine.slice(colonIndex + 1).trim();

    if (name) {
      headers.push({ name, value });
    }
  }

  return {
    success: true,
    headers,
    statusLine,
  };
}

/**
 * Formats parsed headers back to raw header text.
 */
export function formatHttpHeaders(
  headers: ParsedHeader[],
  statusLine?: string
): string {
  if (!Array.isArray(headers)) {
    return "";
  }

  const parts: string[] = [];
  if (statusLine) {
    parts.push(statusLine);
  }
  for (const { name, value } of headers) {
    if (name) {
      parts.push(`${name}: ${value}`);
    }
  }
  return parts.join("\r\n");
}
