/**
 * JSON operation result with status and metadata
 */
export interface JsonResult {
  result: string;
  success: boolean;
  error?: string;
  stats?: JsonStats;
}

/**
 * JSON statistics
 */
export interface JsonStats {
  size: number;
  lines: number;
  characters: number;
}

/**
 * JSON validation result
 */
export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  parsedValue?: unknown;
}

/**
 * Validates JSON string
 */
export const validateJson = (jsonString: string): JsonValidationResult => {
  if (!jsonString.trim()) {
    return { isValid: true }; // Empty string is considered valid (no JSON)
  }

  try {
    const parsed = JSON.parse(jsonString);
    return {
      isValid: true,
      parsedValue: parsed,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
};

/**
 * Formats JSON string with indentation
 */
export const formatJson = (
  jsonString: string,
  spaces: number = 2
): JsonResult => {
  const validation = validateJson(jsonString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!jsonString.trim()) {
    return {
      result: "",
      success: true,
      stats: { size: 0, lines: 0, characters: 0 },
    };
  }

  try {
    const formatted = JSON.stringify(validation.parsedValue, null, spaces);
    const stats = calculateJsonStats(formatted);

    return {
      result: formatted,
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to format JSON",
    };
  }
};

/**
 * Minifies JSON string
 */
export const minifyJson = (jsonString: string): JsonResult => {
  const validation = validateJson(jsonString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!jsonString.trim()) {
    return {
      result: "",
      success: true,
      stats: { size: 0, lines: 0, characters: 0 },
    };
  }

  try {
    const minified = JSON.stringify(validation.parsedValue);
    const stats = calculateJsonStats(minified);

    return {
      result: minified,
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to minify JSON",
    };
  }
};

/**
 * Calculates statistics for JSON string
 */
export const calculateJsonStats = (jsonString: string): JsonStats => {
  const lines = jsonString.split("\n").length;
  const characters = jsonString.length;
  const size = new Blob([jsonString]).size;

  return {
    size,
    lines,
    characters,
  };
};

/**
 * Formats file size in human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) return `${bytes} B`;

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Escapes JSON string for safe display
 */
export const escapeJsonString = (value: string): string => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
};

/**
 * Unescapes JSON string
 */
export const unescapeJsonString = (value: string): string => {
  let result = "";
  let i = 0;

  while (i < value.length) {
    if (value[i] === "\\" && i + 1 < value.length) {
      const nextChar = value[i + 1];
      switch (nextChar) {
        case '"':
          result += '"';
          i += 2;
          break;
        case "n":
          result += "\n";
          i += 2;
          break;
        case "r":
          result += "\r";
          i += 2;
          break;
        case "t":
          result += "\t";
          i += 2;
          break;
        case "\\":
          result += "\\";
          i += 2;
          break;
        default:
          result += value[i];
          i += 1;
          break;
      }
    } else {
      result += value[i];
      i += 1;
    }
  }

  return result;
};

/**
 * Gets JSON depth (nesting level)
 */
export const getJsonDepth = (
  obj: unknown,
  currentDepth: number = 0
): number => {
  if (obj === null || typeof obj !== "object") {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      maxDepth = Math.max(maxDepth, getJsonDepth(item, currentDepth + 1));
    }
  } else {
    for (const key in obj as Record<string, unknown>) {
      if ((obj as Record<string, unknown>).hasOwnProperty(key)) {
        maxDepth = Math.max(
          maxDepth,
          getJsonDepth((obj as Record<string, unknown>)[key], currentDepth + 1)
        );
      }
    }
  }

  return maxDepth;
};
