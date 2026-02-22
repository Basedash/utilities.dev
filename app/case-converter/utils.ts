/**
 * Case conversion types supported by the utility.
 */
export type CaseFormat =
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "upper_snake";

/**
 * Splits text into words, preserving boundaries from spaces, underscores,
 * hyphens, and mixed-case (camelCase/PascalCase) transitions.
 * Ambiguous inputs (e.g. "HTTPAPI") may tokenize differently than expected.
 */
export function tokenize(text: string): string[] {
  if (typeof text !== "string" || !text.trim()) {
    return [];
  }

  const normalized = text
    .replace(/[\s_-]+/g, " ")
    .trim();

  if (!normalized) return [];

  const withSpaces = normalized.replace(
    /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[0-9])(?=[a-zA-Z])|(?<=[a-zA-Z])(?=[0-9])/g,
    " "
  );

  return withSpaces
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

/**
 * Converts token array to camelCase (first word lower, rest capitalized).
 */
function toCamel(tokens: string[]): string {
  if (tokens.length === 0) return "";
  const [first, ...rest] = tokens;
  const firstLower = first.toLowerCase();
  const restCapitalized = rest.map(
    (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  );
  return firstLower + restCapitalized.join("");
}

/**
 * Converts token array to PascalCase (all words capitalized).
 */
function toPascal(tokens: string[]): string {
  if (tokens.length === 0) return "";
  return tokens
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .join("");
}

/**
 * Converts token array to snake_case.
 */
function toSnake(tokens: string[]): string {
  if (tokens.length === 0) return "";
  return tokens.map((t) => t.toLowerCase()).join("_");
}

/**
 * Converts token array to kebab-case.
 */
function toKebab(tokens: string[]): string {
  if (tokens.length === 0) return "";
  return tokens.map((t) => t.toLowerCase()).join("-");
}

/**
 * Converts token array to UPPER_SNAKE_CASE.
 */
function toUpperSnake(tokens: string[]): string {
  if (tokens.length === 0) return "";
  return tokens.map((t) => t.toUpperCase()).join("_");
}

/**
 * Converts input text to the specified case format.
 * Returns empty string for empty or whitespace-only input.
 */
export function convertCase(input: string, format: CaseFormat): string {
  if (typeof input !== "string") return "";
  const tokens = tokenize(input);
  if (tokens.length === 0) return "";

  switch (format) {
    case "camel":
      return toCamel(tokens);
    case "pascal":
      return toPascal(tokens);
    case "snake":
      return toSnake(tokens);
    case "kebab":
      return toKebab(tokens);
    case "upper_snake":
      return toUpperSnake(tokens);
    default:
      return "";
  }
}
