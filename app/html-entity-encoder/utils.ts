/**
 * HTML entity conversion result with status
 */
export interface HtmlEntityResult {
  result: string;
  success: boolean;
  error?: string;
}

/** Characters that must be encoded in HTML and their entity names */
const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** Common HTML named entities for decoding (entity name without & and ; -> char) */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00A0",
  copy: "\u00A9",
  reg: "\u00AE",
  trade: "\u2122",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bull: "\u2022",
  middot: "\u00B7",
  deg: "\u00B0",
  plusmn: "\u00B1",
  frac12: "\u00BD",
  frac14: "\u00BC",
  frac34: "\u00BE",
  euro: "\u20AC",
  pound: "\u00A3",
  yen: "\u00A5",
  cent: "\u00A2",
  iexcl: "\u00A1",
  sect: "\u00A7",
  para: "\u00B6",
  sup1: "\u00B9",
  sup2: "\u00B2",
  sup3: "\u00B3",
  acute: "\u00B4",
  micro: "\u00B5",
  cedil: "\u00B8",
  ordm: "\u00BA",
  ordf: "\u00AA",
  not: "\u00AC",
  shy: "\u00AD",
  macr: "\u00AF",
  Agrave: "\u00C0",
  Aacute: "\u00C1",
  Acirc: "\u00C2",
  Atilde: "\u00C3",
  Auml: "\u00C4",
  Aring: "\u00C5",
  AElig: "\u00C6",
  Ccedil: "\u00C7",
  Egrave: "\u00C8",
  Eacute: "\u00C9",
  Ecirc: "\u00CA",
  Euml: "\u00CB",
  Igrave: "\u00CC",
  Iacute: "\u00CD",
  Icirc: "\u00CE",
  Iuml: "\u00CF",
  ETH: "\u00D0",
  Ntilde: "\u00D1",
  Ograve: "\u00D2",
  Oacute: "\u00D3",
  Ocirc: "\u00D4",
  Otilde: "\u00D5",
  Ouml: "\u00D6",
  Oslash: "\u00D8",
  Ugrave: "\u00D9",
  Uacute: "\u00DA",
  Ucirc: "\u00DB",
  Uuml: "\u00DC",
  Yacute: "\u00DD",
  THORN: "\u00DE",
  szlig: "\u00DF",
  agrave: "\u00E0",
  aacute: "\u00E1",
  acirc: "\u00E2",
  atilde: "\u00E3",
  auml: "\u00E4",
  aring: "\u00E5",
  aelig: "\u00E6",
  ccedil: "\u00E7",
  egrave: "\u00E8",
  eacute: "\u00E9",
  ecirc: "\u00EA",
  euml: "\u00EB",
  igrave: "\u00EC",
  iacute: "\u00ED",
  icirc: "\u00EE",
  iuml: "\u00EF",
  eth: "\u00F0",
  ntilde: "\u00F1",
  ograve: "\u00F2",
  oacute: "\u00F3",
  ocirc: "\u00F4",
  otilde: "\u00F5",
  ouml: "\u00F6",
  oslash: "\u00F8",
  ugrave: "\u00F9",
  uacute: "\u00FA",
  ucirc: "\u00FB",
  uuml: "\u00FC",
  yacute: "\u00FD",
  thorn: "\u00FE",
  yuml: "\u00FF",
};

/**
 * Encodes special characters to HTML entities.
 * Encodes: & < > " '
 */
export const encodeHtmlEntities = (input: string): HtmlEntityResult => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    let result = "";
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      result += ENCODE_MAP[char] ?? char;
    }
    return { result, success: true };
  } catch {
    return {
      result: "",
      success: false,
      error: "Unable to encode text",
    };
  }
};

/** Regex for entity pattern: &name; or &#decimal; or &#xhex; (semicolon required for named) */
const ENTITY_REGEX = /&(?:#(\d+)|#x([0-9a-fA-F]+)|#X([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g;

/**
 * Decodes HTML entities to characters.
 * Supports named entities, decimal (&#123;), and hex (&#x7B; or &#X7B;).
 * Unknown named entities are left as-is.
 */
export const decodeHtmlEntities = (input: string): HtmlEntityResult => {
  if (typeof input !== "string") {
    return {
      result: "",
      success: false,
      error: "Input must be a string",
    };
  }

  try {
    const result = input.replace(
      ENTITY_REGEX,
      (match, decimal, hexLower, hexUpper, name) => {
        const hex = hexLower ?? hexUpper;
        if (decimal !== undefined) {
          const code = parseInt(decimal, 10);
          if (code >= 0 && code <= 0x10ffff) {
            return String.fromCodePoint(code);
          }
          return match;
        }
        if (hex !== undefined) {
          const code = parseInt(hex, 16);
          if (code >= 0 && code <= 0x10ffff) {
            return String.fromCodePoint(code);
          }
          return match;
        }
        if (name !== undefined) {
          const decoded = NAMED_ENTITIES[name];
          return decoded ?? match;
        }
        return match;
      }
    );
    return { result, success: true };
  } catch {
    return {
      result: "",
      success: false,
      error: "Unable to decode text",
    };
  }
};
