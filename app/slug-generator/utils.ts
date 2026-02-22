export interface SlugOptions {
  /** Convert to lowercase (default: true) */
  lowercase?: boolean;
  /** Replace accented chars with ASCII equivalents (default: true) */
  removeDiacritics?: boolean;
}

const DEFAULT_OPTIONS: Required<SlugOptions> = {
  lowercase: true,
  removeDiacritics: true,
};

/**
 * Basic diacritic map for common accented characters.
 * Covers Latin-1 supplement and common European characters.
 */
const DIACRITIC_MAP: Record<string, string> = {
  "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "æ": "ae",
  "è": "e", "é": "e", "ê": "e", "ë": "e",
  "ì": "i", "í": "i", "î": "i", "ï": "i",
  "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "œ": "oe",
  "ù": "u", "ú": "u", "û": "u", "ü": "u",
  "ý": "y", "ÿ": "y",
  "ñ": "n", "ç": "c", "ß": "ss",
  "À": "a", "Á": "a", "Â": "a", "Ã": "a", "Ä": "a", "Å": "a", "Æ": "ae",
  "È": "e", "É": "e", "Ê": "e", "Ë": "e",
  "Ì": "i", "Í": "i", "Î": "i", "Ï": "i",
  "Ò": "o", "Ó": "o", "Ô": "o", "Õ": "o", "Ö": "o", "Ø": "o", "Œ": "oe",
  "Ù": "u", "Ú": "u", "Û": "u", "Ü": "u",
  "Ý": "y",
  "Ñ": "n", "Ç": "c",
};

/**
 * Removes diacritics from a string using a character map.
 * Characters not in the map are left unchanged.
 */
function removeDiacritics(input: string): string {
  return input
    .split("")
    .map((c) => DIACRITIC_MAP[c] ?? c)
    .join("");
}

/**
 * Generates a URL-friendly slug from text.
 *
 * - Replaces spaces and punctuation with hyphens
 * - Optionally lowercases and removes diacritics
 * - Collapses multiple hyphens and trims
 */
export function generateSlug(
  input: string,
  options: SlugOptions = {}
): string {
  if (typeof input !== "string") {
    return "";
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = input.trim();

  if (!result) {
    return "";
  }

  if (opts.removeDiacritics) {
    result = removeDiacritics(result);
  }

  if (opts.lowercase) {
    result = result.toLowerCase();
  }

  // Replace spaces and common punctuation with hyphens
  result = result.replace(/[\s_.,;:!?'"()[\]{}]+/g, "-");

  // Remove any character that isn't alphanumeric or hyphen
  // When diacritics are kept, allow Latin extended (e.g. é, ñ)
  const allowedChars = opts.removeDiacritics
    ? /[^a-z0-9-]/gi
    : /[^a-zA-Z0-9\u00C0-\u017F-]/g;
  result = result.replace(allowedChars, "");

  // Collapse multiple hyphens
  result = result.replace(/-+/g, "-");

  // Trim leading and trailing hyphens
  result = result.replace(/^-+|-+$/g, "");

  return result;
}
