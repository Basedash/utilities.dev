/**
 * Result type for escape/unescape operations
 */
export interface EscapeResult {
  result: string;
  success: boolean;
  error?: string;
}

export type EscapeMode = "json" | "javascript" | "regex" | "newline-tab";
export type EscapeAction = "escape" | "unescape";

const JSON_ESCAPE_MAP: Record<string, string> = {
  "\\": "\\\\",
  '"': '\\"',
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
};

const REGEX_SPECIAL = [".", "*", "+", "?", "^", "$", "{", "}", "[", "]", "(", ")", "|", "\\"];

function escapeJsonString(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (JSON_ESCAPE_MAP[c] !== undefined) {
      result += JSON_ESCAPE_MAP[c];
    } else if (c.charCodeAt(0) < 32) {
      result += "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
    } else {
      result += c;
    }
  }
  return result;
}

function unescapeJsonLike(input: string, supportHexEscape: boolean): EscapeResult {
  const escapeMap: Record<string, string> = {
    "\\": "\\",
    '"': '"',
    "'": "'",
    n: "\n",
    r: "\r",
    t: "\t",
    b: "\b",
    f: "\f",
  };
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "\\" && i + 1 < input.length) {
      const next = input[i + 1];
      if (escapeMap[next] !== undefined) {
        result += escapeMap[next];
        i++;
      } else if (next === "u" && i + 5 < input.length) {
        const hex = input.slice(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          result += String.fromCharCode(parseInt(hex, 16));
          i += 5;
        } else {
          return { result: "", success: false, error: "Invalid \\u escape sequence" };
        }
      } else if (next === "x" && i + 3 < input.length && supportHexEscape) {
        const hex = input.slice(i + 2, i + 4);
        if (/^[0-9a-fA-F]{2}$/.test(hex)) {
          result += String.fromCharCode(parseInt(hex, 16));
          i += 3;
        } else {
          return { result: "", success: false, error: "Invalid \\x escape sequence" };
        }
      } else {
        return { result: "", success: false, error: "Invalid escape sequence" };
      }
    } else {
      result += c;
    }
  }
  return { result, success: true };
}

function unescapeJsonString(input: string): EscapeResult {
  try {
    const wrapped = '"' + input + '"';
    const parsed = JSON.parse(wrapped);
    if (typeof parsed !== "string") {
      return { result: "", success: false, error: "Invalid JSON string content" };
    }
    return { result: parsed, success: true };
  } catch {
    return unescapeJsonLike(input, false); // JSON has no \x
  }
}

function escapeJavaScriptString(input: string): string {
  let result = escapeJsonString(input);
  result = result.replace(/'/g, "\\'");
  return result;
}

function unescapeJavaScriptString(input: string): EscapeResult {
  try {
    const wrapped = '"' + input + '"';
    const parsed = JSON.parse(wrapped);
    if (typeof parsed !== "string") {
      return { result: "", success: false, error: "Invalid JavaScript string content" };
    }
    return { result: parsed, success: true };
  } catch {
    return unescapeJsonLike(input, true); // JS supports \xXX
  }
}

function escapeRegexLiteral(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (REGEX_SPECIAL.includes(c)) {
      result += "\\" + c;
    } else {
      result += c;
    }
  }
  return result;
}

function unescapeRegexLiteral(input: string): EscapeResult {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "\\" && i + 1 < input.length) {
      result += input[i + 1];
      i++;
    } else {
      result += c;
    }
  }
  return { result, success: true };
}

function escapeNewlineTabVisible(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function unescapeNewlineTabVisible(input: string): EscapeResult {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "\\" && i + 1 < input.length) {
      const next = input[i + 1];
      if (next === "n") {
        result += "\n";
        i++;
      } else if (next === "r") {
        result += "\r";
        i++;
      } else if (next === "t") {
        result += "\t";
        i++;
      } else if (next === "\\") {
        result += "\\";
        i++;
      } else {
        result += c;
      }
    } else {
      result += c;
    }
  }
  return { result, success: true };
}

function validateInput(input: unknown): string | null {
  if (typeof input !== "string") {
    return "Input must be a string";
  }
  return null;
}

/**
 * Escape or unescape text for the given mode and action.
 */
export function escapeUnescape(
  input: string,
  mode: EscapeMode,
  action: EscapeAction
): EscapeResult {
  const err = validateInput(input);
  if (err) {
    return { result: "", success: false, error: err };
  }

  if (action === "escape") {
    switch (mode) {
      case "json":
        return { result: escapeJsonString(input), success: true };
      case "javascript":
        return { result: escapeJavaScriptString(input), success: true };
      case "regex":
        return { result: escapeRegexLiteral(input), success: true };
      case "newline-tab":
        return { result: escapeNewlineTabVisible(input), success: true };
      default:
        return { result: "", success: false, error: "Unknown mode" };
    }
  } else {
    switch (mode) {
      case "json":
        return unescapeJsonString(input);
      case "javascript":
        return unescapeJavaScriptString(input);
      case "regex":
        return unescapeRegexLiteral(input);
      case "newline-tab":
        return unescapeNewlineTabVisible(input);
      default:
        return { result: "", success: false, error: "Unknown mode" };
    }
  }
}
