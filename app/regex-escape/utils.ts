/**
 * Characters that have special meaning in JavaScript regex and must be escaped
 * when matching literally. Order matters: backslash must be escaped first.
 */
const REGEX_SPECIAL = [
  "\\",
  "^",
  "$",
  ".",
  "|",
  "?",
  "*",
  "+",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
];

/**
 * Escapes special regex characters in a string so it can be used as a literal
 * pattern in a regular expression.
 *
 * Follows JavaScript regex rules. Other engines (PCRE, Python, etc.) may
 * have slightly different special character sets.
 */
export function escapeRegex(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

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
