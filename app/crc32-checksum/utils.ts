/**
 * CRC32 checksum result with status
 */
export interface Crc32Result {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Precomputed CRC32 lookup table (IEEE polynomial, reflected).
 */
const CRC32_TABLE = new Uint32Array(256);

function initCrc32Table(): void {
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    CRC32_TABLE[i] = crc >>> 0;
  }
}

initCrc32Table();

/**
 * Computes CRC32 checksum of input string (UTF-8 encoded).
 * Returns unsigned 32-bit hex string (8 chars, lowercase).
 */
export function computeCrc32(input: string): Crc32Result {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let crc = 0xffffffff;

    for (let i = 0; i < bytes.length; i++) {
      crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }

    crc = (crc ^ 0xffffffff) >>> 0;
    const hex = crc.toString(16).padStart(8, "0");
    return { result: hex, success: true };
  } catch {
    return {
      result: "",
      success: false,
      error: "Unable to compute checksum",
    };
  }
}
