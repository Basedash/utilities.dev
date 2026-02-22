/**
 * Parsed data URL structure
 */
export interface ParsedDataUrl {
  mediaType: string;
  charset?: string;
  base64: boolean;
  data: string;
  decodedData?: string;
}

/**
 * Result of parseDataUrl
 */
export interface ParseDataUrlResult {
  success: boolean;
  parsed?: ParsedDataUrl;
  error?: string;
}

/**
 * Parses a data URL (data:[<mediatype>][;base64],<data>) into components.
 * Decodes base64 data when the base64 flag is present.
 */
export function parseDataUrl(input: string): ParseDataUrlResult {
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
      error: "Input cannot be empty",
    };
  }

  if (!trimmed.toLowerCase().startsWith("data:")) {
    return {
      success: false,
      error: "Input must start with data:",
    };
  }

  const rest = trimmed.slice(5); // after "data:"
  const commaIndex = rest.indexOf(",");

  if (commaIndex < 0) {
    return {
      success: false,
      error: "Invalid data URL: missing comma separator",
    };
  }

  const header = rest.slice(0, commaIndex);
  const data = rest.slice(commaIndex + 1);

  const parts = header.split(";").filter(Boolean);
  let mediaType = "text/plain";
  let charset: string | undefined;
  let base64 = false;

  if (parts.length > 0) {
    const first = parts[0].trim();
    if (first.toLowerCase() === "base64") {
      base64 = true;
    } else {
      const charsetMatch = first.match(/^([^;]+)(?:;\s*charset=([^;]+))?$/i);
      if (charsetMatch) {
        mediaType = charsetMatch[1].trim() || "text/plain";
        charset = charsetMatch[2]?.trim();
      } else {
        mediaType = first || "text/plain";
      }

      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].trim();
        const partLower = part.toLowerCase();
        if (partLower === "base64") {
          base64 = true;
        } else if (partLower.startsWith("charset=")) {
          charset = part.slice(8).trim();
        }
      }
    }
  }

  let decodedData: string | undefined;

  if (base64) {
    if (!data) {
      return {
        success: true,
        parsed: {
          mediaType,
          charset,
          base64: true,
          data: "",
          decodedData: "",
        },
      };
    }

    try {
      const binary = atob(data.replace(/\s/g, ""));
      decodedData = decodeBinaryAsUtf8(binary);
    } catch {
      return {
        success: false,
        error: "Invalid base64 data",
      };
    }
  } else {
    try {
      decodedData = decodeURIComponent(data.replace(/\+/g, " "));
    } catch {
      decodedData = data;
    }
  }

  return {
    success: true,
    parsed: {
      mediaType,
      charset,
      base64,
      data,
      decodedData,
    },
  };
}

/**
 * Decodes binary string as UTF-8 to handle multi-byte characters.
 */
function decodeBinaryAsUtf8(binary: string): string {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}
