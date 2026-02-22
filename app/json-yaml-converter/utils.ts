import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type ConversionDirection = "json-to-yaml" | "yaml-to-json";

export interface ConversionResult {
  success: boolean;
  result: string;
  error?: string;
}

/**
 * Converts JSON string to YAML string.
 */
export function jsonToYaml(jsonString: string): ConversionResult {
  const trimmed = jsonString.trim();
  if (!trimmed) {
    return { success: true, result: "" };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const yaml = stringifyYaml(parsed, { indent: 2 });
    return { success: true, result: yaml };
  } catch (error) {
    return {
      success: false,
      result: "",
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Converts YAML string to JSON string.
 */
export function yamlToJson(yamlString: string): ConversionResult {
  const trimmed = yamlString.trim();
  if (!trimmed) {
    return { success: true, result: "" };
  }

  try {
    const parsed = parseYaml(trimmed);
    const json = JSON.stringify(parsed, null, 2);
    return { success: true, result: json };
  } catch (error) {
    return {
      success: false,
      result: "",
      error: error instanceof Error ? error.message : "Invalid YAML",
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
  return direction === "json-to-yaml" ? jsonToYaml(input) : yamlToJson(input);
}
