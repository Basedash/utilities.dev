export type ConversionDirection = "csv-to-json" | "json-to-csv";

export interface ConversionResult {
  success: boolean;
  result: string;
  error?: string;
}

const DEFAULT_DELIMITER = ",";

/**
 * Parses a CSV row respecting quoted fields.
 */
function parseCsvRow(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (inQuotes) {
      current += char;
    } else if (char === delimiter) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Escapes a field for CSV output.
 */
function escapeCsvField(field: string): string {
  if (
    field.includes('"') ||
    field.includes(",") ||
    field.includes("\n") ||
    field.includes("\r")
  ) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

/**
 * Converts CSV string to JSON array of objects (first row as headers).
 */
export function csvToJson(
  csvString: string,
  delimiter: string = DEFAULT_DELIMITER
): ConversionResult {
  const trimmed = csvString.trim();
  if (!trimmed) {
    return { success: true, result: "[]" };
  }

  try {
    const lines = trimmed.split(/\r?\n/).filter((line) => line.length > 0);
    if (lines.length === 0) {
      return { success: true, result: "[]" };
    }

    const headers = parseCsvRow(lines[0], delimiter);
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvRow(lines[i], delimiter);
      const row: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j] ?? "";
      }
      rows.push(row);
    }

    const json = JSON.stringify(rows, null, 2);
    return { success: true, result: json };
  } catch (error) {
    return {
      success: false,
      result: "",
      error: error instanceof Error ? error.message : "Invalid CSV",
    };
  }
}

/**
 * Converts JSON array of objects to CSV string.
 */
export function jsonToCsv(
  jsonString: string,
  delimiter: string = DEFAULT_DELIMITER
): ConversionResult {
  const trimmed = jsonString.trim();
  if (!trimmed) {
    return { success: true, result: "" };
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        result: "",
        error: "JSON must be an array of objects",
      };
    }

    if (parsed.length === 0) {
      return { success: true, result: "" };
    }

    const first = parsed[0];
    if (first === null || typeof first !== "object" || Array.isArray(first)) {
      return {
        success: false,
        result: "",
        error: "JSON array must contain objects",
      };
    }

    const headers = Object.keys(first as Record<string, unknown>);
    const lines: string[] = [headers.map(escapeCsvField).join(delimiter)];

    for (const item of parsed) {
      if (item === null || typeof item !== "object") {
        continue;
      }
      const obj = item as Record<string, unknown>;
      const values = headers.map((h) =>
        escapeCsvField(String(obj[h] ?? ""))
      );
      lines.push(values.join(delimiter));
    }

    return { success: true, result: lines.join("\n") };
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
  direction: ConversionDirection,
  delimiter: string = DEFAULT_DELIMITER
): ConversionResult {
  return direction === "csv-to-json"
    ? csvToJson(input, delimiter)
    : jsonToCsv(input, delimiter);
}
