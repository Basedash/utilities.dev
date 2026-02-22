/**
 * HTTP status code entry with code, name, description, and category
 */
export interface HttpStatusEntry {
  code: number;
  name: string;
  description: string;
  category: HttpStatusCategory;
}

/**
 * HTTP status code category (1xx, 2xx, 3xx, 4xx, 5xx)
 */
export type HttpStatusCategory = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

/**
 * All supported HTTP status categories in display order
 */
export const HTTP_STATUS_CATEGORIES: HttpStatusCategory[] = [
  "1xx",
  "2xx",
  "3xx",
  "4xx",
  "5xx",
];

/**
 * Category labels for display
 */
export const HTTP_CATEGORY_LABELS: Record<HttpStatusCategory, string> = {
  "1xx": "Informational",
  "2xx": "Success",
  "3xx": "Redirection",
  "4xx": "Client Error",
  "5xx": "Server Error",
};

/**
 * HTTP status codes reference data (common codes developers encounter)
 */
export const HTTP_STATUS_CODES: HttpStatusEntry[] = [
  { code: 100, name: "Continue", description: "Server received request headers; client should send body.", category: "1xx" },
  { code: 101, name: "Switching Protocols", description: "Server agrees to switch protocol per Upgrade header.", category: "1xx" },
  { code: 102, name: "Processing", description: "Server is processing request; prevents client timeout.", category: "1xx" },
  { code: 103, name: "Early Hints", description: "Server sends preliminary headers before final response.", category: "1xx" },
  { code: 200, name: "OK", description: "Request succeeded; response body contains result.", category: "2xx" },
  { code: 201, name: "Created", description: "Resource created; Location header often points to new resource.", category: "2xx" },
  { code: 202, name: "Accepted", description: "Request accepted for processing; may complete later.", category: "2xx" },
  { code: 203, name: "Non-Authoritative Information", description: "Transformed response from proxy; may differ from origin.", category: "2xx" },
  { code: 204, name: "No Content", description: "Success with no response body; common for DELETE or PUT.", category: "2xx" },
  { code: 205, name: "Reset Content", description: "Client should reset document view that sent the request.", category: "2xx" },
  { code: 206, name: "Partial Content", description: "Range request fulfilled; body contains requested byte range.", category: "2xx" },
  { code: 207, name: "Multi-Status", description: "WebDAV; body contains multiple status codes.", category: "2xx" },
  { code: 208, name: "Already Reported", description: "WebDAV; members already enumerated in prior response.", category: "2xx" },
  { code: 226, name: "IM Used", description: "Server fulfilled GET with instance-manipulation.", category: "2xx" },
  { code: 300, name: "Multiple Choices", description: "Multiple representations; client or server chooses one.", category: "3xx" },
  { code: 301, name: "Moved Permanently", description: "Resource moved permanently; use new URI in Location.", category: "3xx" },
  { code: 302, name: "Found", description: "Temporary redirect; method may change to GET.", category: "3xx" },
  { code: 303, name: "See Other", description: "Redirect to different URI via GET.", category: "3xx" },
  { code: 304, name: "Not Modified", description: "Cached response still valid; no body returned.", category: "3xx" },
  { code: 307, name: "Temporary Redirect", description: "Temporary redirect; method and body preserved.", category: "3xx" },
  { code: 308, name: "Permanent Redirect", description: "Permanent redirect; method and body preserved.", category: "3xx" },
  { code: 400, name: "Bad Request", description: "Request malformed or invalid; client should fix and retry.", category: "4xx" },
  { code: 401, name: "Unauthorized", description: "Authentication required; include credentials.", category: "4xx" },
  { code: 402, name: "Payment Required", description: "Reserved for future use; payment systems.", category: "4xx" },
  { code: 403, name: "Forbidden", description: "Server understood request but refuses to authorize.", category: "4xx" },
  { code: 404, name: "Not Found", description: "Resource not found at requested URI.", category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: "Method not allowed for this resource; Allow header lists valid methods.", category: "4xx" },
  { code: 406, name: "Not Acceptable", description: "No representation matches Accept headers.", category: "4xx" },
  { code: 408, name: "Request Timeout", description: "Server timed out waiting for request.", category: "4xx" },
  { code: 409, name: "Conflict", description: "Request conflicts with current server state.", category: "4xx" },
  { code: 410, name: "Gone", description: "Resource no longer available; no forwarding address.", category: "4xx" },
  { code: 413, name: "Payload Too Large", description: "Request body exceeds server limits.", category: "4xx" },
  { code: 414, name: "URI Too Long", description: "Request URI exceeds server limits.", category: "4xx" },
  { code: 415, name: "Unsupported Media Type", description: "Content-Type not supported by server.", category: "4xx" },
  { code: 422, name: "Unprocessable Entity", description: "Syntax valid but semantic errors; often validation failures.", category: "4xx" },
  { code: 429, name: "Too Many Requests", description: "Rate limit exceeded; Retry-After may indicate when to retry.", category: "4xx" },
  { code: 431, name: "Request Header Fields Too Large", description: "Request headers exceed server limits.", category: "4xx" },
  { code: 500, name: "Internal Server Error", description: "Unexpected server error; generic fallback.", category: "5xx" },
  { code: 501, name: "Not Implemented", description: "Server does not support the request method.", category: "5xx" },
  { code: 502, name: "Bad Gateway", description: "Invalid response from upstream server.", category: "5xx" },
  { code: 503, name: "Service Unavailable", description: "Server temporarily overloaded or down.", category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: "Upstream server did not respond in time.", category: "5xx" },
  { code: 505, name: "HTTP Version Not Supported", description: "HTTP version not supported by server.", category: "5xx" },
];

/**
 * Derives category from status code (e.g. 404 -> "4xx")
 */
export function getCategoryFromCode(code: number): HttpStatusCategory | null {
  if (code >= 100 && code < 200) return "1xx";
  if (code >= 200 && code < 300) return "2xx";
  if (code >= 300 && code < 400) return "3xx";
  if (code >= 400 && code < 500) return "4xx";
  if (code >= 500 && code < 600) return "5xx";
  return null;
}

/**
 * Filters HTTP status codes by search query and optional category.
 * Matches code (exact or prefix) or phrase in name/description (case-insensitive).
 */
export function filterStatusCodes(
  query: string,
  categoryFilter: HttpStatusCategory | null
): HttpStatusEntry[] {
  const trimmed = (query ?? "").trim().toLowerCase();
  const byCategory = categoryFilter
    ? HTTP_STATUS_CODES.filter((e) => e.category === categoryFilter)
    : HTTP_STATUS_CODES;

  if (!trimmed) {
    return byCategory;
  }

  const codeNum = parseInt(trimmed, 10);
  const isNumeric = !Number.isNaN(codeNum);

  return byCategory.filter((entry) => {
    if (isNumeric) {
      if (entry.code === codeNum) return true;
      if (entry.code.toString().startsWith(trimmed)) return true;
      return false;
    }
    const searchable = `${entry.code} ${entry.name} ${entry.description}`.toLowerCase();
    return searchable.includes(trimmed);
  });
}

/**
 * Groups status codes by category for display
 */
export function groupByCategory(
  entries: HttpStatusEntry[]
): Map<HttpStatusCategory, HttpStatusEntry[]> {
  const map = new Map<HttpStatusCategory, HttpStatusEntry[]>();
  for (const cat of HTTP_STATUS_CATEGORIES) {
    map.set(cat, []);
  }
  for (const entry of entries) {
    const list = map.get(entry.category);
    if (list) list.push(entry);
  }
  return map;
}
