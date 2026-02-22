/**
 * UUID validation result with status and optional error
 */
export interface ValidateUuidResult {
  valid: boolean;
  error?: string;
}

/**
 * RFC 4122 UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * y must be 8, 9, a, or b (variant bits)
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generates a single UUID v4 using crypto.randomUUID when available,
 * otherwise falls back to manual generation with crypto.getRandomValues.
 */
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return generateUuidFallback();
}

/**
 * Fallback UUID v4 generation for environments without crypto.randomUUID.
 * Uses crypto.getRandomValues for randomness.
 */
function generateUuidFallback(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuidBytes(bytes);
}

function formatUuidBytes(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Validates a string as a UUID (RFC 4122 format).
 * Accepts both uppercase and lowercase hex.
 */
export function validateUuid(input: string): ValidateUuidResult {
  if (typeof input !== "string") {
    return { valid: false, error: "Input must be a string" };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "Enter a UUID to validate" };
  }

  if (UUID_V4_REGEX.test(trimmed)) {
    return { valid: true };
  }

  if (!/^[0-9a-f-]+$/i.test(trimmed)) {
    return {
      valid: false,
      error: "UUID must contain only hex digits (0-9, a-f) and hyphens",
    };
  }

  const parts = trimmed.split("-");
  if (parts.length !== 5) {
    return {
      valid: false,
      error: "UUID must have 5 hyphen-separated segments (8-4-4-4-12)",
    };
  }

  const lengths = [8, 4, 4, 4, 12];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length !== lengths[i]) {
      return {
        valid: false,
        error: `Segment ${i + 1} should be ${lengths[i]} characters, got ${parts[i].length}`,
      };
    }
  }

  if (parts[2][0] !== "4") {
    return {
      valid: false,
      error: "Not a valid UUID v4 (version digit must be 4)",
    };
  }

  const variantChar = parts[3][0].toLowerCase();
  if (!["8", "9", "a", "b"].includes(variantChar)) {
    return {
      valid: false,
      error: "Invalid variant bits (first char of 4th segment must be 8, 9, a, or b)",
    };
  }

  return { valid: false, error: "Invalid UUID format" };
}

/**
 * Generates multiple UUIDs.
 */
export function generateUuidBatch(count: number): string[] {
  if (typeof count !== "number" || count < 1 || !Number.isInteger(count)) {
    return [];
  }
  const max = 1000;
  const safeCount = Math.min(Math.max(1, count), max);
  const result: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    result.push(generateUuid());
  }
  return result;
}
