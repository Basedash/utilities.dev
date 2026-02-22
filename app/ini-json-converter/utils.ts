export type ConversionDirection = "ini-to-json" | "json-to-ini";

export interface ConversionResult {
  success: boolean;
  result: string;
  error?: string;
}

/**
 * Parses INI string into a nested object.
 * Sections become top-level keys; keys without a section go under "".
 */
export function iniToJson(iniString: string): ConversionResult {
  const trimmed = iniString.trim();
  if (!trimmed) {
    return { success: true, result: "{}" };
  }

  try {
    const result: Record<string, Record<string, string>> = {};
    let currentSection = "";

    const lines = trimmed.split(/\r?\n/);

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith(";") || trimmedLine.startsWith("#")) {
        continue;
      }

      const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/);
      if (sectionMatch) {
        currentSection = sectionMatch[1].trim();
        if (!result[currentSection]) {
          result[currentSection] = {};
        }
        continue;
      }

      const eqIndex = trimmedLine.indexOf("=");
      if (eqIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, eqIndex).trim();
      const value = trimmedLine.slice(eqIndex + 1).trim();

      if (!result[currentSection]) {
        result[currentSection] = {};
      }
      result[currentSection][key] = value;
    }

    const json = JSON.stringify(result, null, 2);
    return { success: true, result: json };
  } catch (error) {
    return {
      success: false,
      result: "",
      error: error instanceof Error ? error.message : "Invalid INI",
    };
  }
}

/**
 * Converts JSON object to INI string.
 * Expects object with string keys mapping to objects of string key-value pairs.
 */
export function jsonToIni(jsonString: string): ConversionResult {
  const trimmed = jsonString.trim();
  if (!trimmed) {
    return { success: true, result: "" };
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        success: false,
        result: "",
        error: "JSON must be an object",
      };
    }

    const lines: string[] = [];
    const obj = parsed as Record<string, unknown>;
    const entries = Object.entries(obj).sort(([a], [b]) => {
      if (a === "") return -1;
      if (b === "") return 1;
      return a.localeCompare(b);
    });

    for (let i = 0; i < entries.length; i++) {
      const [section, content] = entries[i];
      if (content === null || typeof content !== "object" || Array.isArray(content)) {
        continue;
      }

      const sectionObj = content as Record<string, unknown>;
      if (section) {
        if (lines.length > 0) lines.push("");
        lines.push(`[${section}]`);
      }

      for (const [key, value] of Object.entries(sectionObj)) {
        const strValue = value === null || value === undefined ? "" : String(value);
        lines.push(`${key}=${strValue}`);
      }
    }

    const result = lines.join("\n").trim();
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      result: "",
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Converts input based on direction.
 */
export function convert(
  input: string,
  direction: ConversionDirection
): ConversionResult {
  return direction === "ini-to-json" ? iniToJson(input) : jsonToIni(input);
}
