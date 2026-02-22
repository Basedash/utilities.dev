/**
 * Parsed URL structure with editable query params
 */
export interface ParsedUrl {
  protocol: string;
  host: string;
  port: string;
  pathname: string;
  searchParams: Array<{ key: string; value: string }>;
  hash: string;
}

/**
 * Result of parseUrl - either success with parsed data or error
 */
export interface ParseUrlResult {
  success: boolean;
  parsed?: ParsedUrl;
  error?: string;
}

/**
 * Parses a URL string into protocol, host, port, pathname, query params, and hash.
 * Returns an error for invalid or relative URLs.
 */
export function parseUrl(input: string): ParseUrlResult {
  if (typeof input !== "string") {
    return {
      success: false,
      error: "Input must be a string",
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      error: "URL cannot be empty",
    };
  }

  try {
    const url = new URL(trimmed);

    const searchParams: Array<{ key: string; value: string }> = [];
    url.searchParams.forEach((value, key) => {
      searchParams.push({ key, value });
    });

    return {
      success: true,
      parsed: {
        protocol: url.protocol,
        host: url.hostname,
        port: url.port,
        pathname: url.pathname,
        searchParams,
        hash: url.hash,
      },
    };
  } catch {
    return {
      success: false,
      error: "Invalid URL. Use an absolute URL with a scheme (e.g. https://example.com).",
    };
  }
}

/**
 * Builds a full URL string from parsed parts.
 * Handles optional port and empty query/hash.
 */
export function buildUrl(parsed: ParsedUrl): string {
  const protocol = parsed.protocol.endsWith(":")
    ? parsed.protocol
    : `${parsed.protocol}:`;
  const host = parsed.host || "";
  const port = parsed.port ? `:${parsed.port}` : "";
  const origin = `${protocol}//${host}${port}`;

  const pathname = parsed.pathname || "/";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  const search =
    parsed.searchParams.length > 0
      ? "?" +
        parsed.searchParams
          .filter((p) => p.key !== "")
          .map(
            (p) =>
              `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
          )
          .join("&")
      : "";

  const hash = parsed.hash
    ? parsed.hash.startsWith("#")
      ? parsed.hash
      : `#${parsed.hash}`
    : "";

  return `${origin}${path}${search}${hash}`;
}
