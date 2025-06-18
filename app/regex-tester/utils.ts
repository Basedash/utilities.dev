/**
 * Regex match result
 */
export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups?: { [key: string]: string };
}

/**
 * Regex test result
 */
export interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
  matchCount: number;
}

/**
 * Regex flags
 */
export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  sticky: boolean;
  unicode: boolean;
  dotAll: boolean;
}

/**
 * Regex validation result
 */
export interface RegexValidationResult {
  isValid: boolean;
  error?: string;
  regex?: RegExp;
}

/**
 * Builds flag string from flags object
 */
export const buildFlagString = (flags: RegexFlags): string => {
  let flagStr = "";
  if (flags.global) flagStr += "g";
  if (flags.ignoreCase) flagStr += "i";
  if (flags.multiline) flagStr += "m";
  if (flags.sticky) flagStr += "y";
  if (flags.unicode) flagStr += "u";
  if (flags.dotAll) flagStr += "s";
  return flagStr;
};

/**
 * Validates a regex pattern
 */
export const validateRegexPattern = (
  pattern: string,
  flags: RegexFlags = {
    global: false,
    ignoreCase: false,
    multiline: false,
    sticky: false,
    unicode: false,
    dotAll: false,
  }
): RegexValidationResult => {
  if (!pattern.trim()) {
    return { isValid: false, error: "Pattern cannot be empty" };
  }

  try {
    const flagString = buildFlagString(flags);
    const regex = new RegExp(pattern, flagString);
    return { isValid: true, regex };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
    };
  }
};

/**
 * Tests a regex pattern against a test string
 */
export const testRegex = (
  pattern: string,
  testString: string,
  flags: RegexFlags = {
    global: true,
    ignoreCase: false,
    multiline: false,
    sticky: false,
    unicode: false,
    dotAll: false,
  }
): RegexTestResult => {
  const validation = validateRegexPattern(pattern, flags);

  if (!validation.isValid || !validation.regex) {
    return {
      isValid: false,
      matches: [],
      error: validation.error,
      matchCount: 0,
    };
  }

  if (!testString) {
    return {
      isValid: true,
      matches: [],
      matchCount: 0,
    };
  }

  try {
    const regex = validation.regex;
    const foundMatches: RegexMatch[] = [];

    if (flags.global) {
      let match;
      while ((match = regex.exec(testString)) !== null) {
        foundMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || undefined,
        });

        // Prevent infinite loop for zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        foundMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || undefined,
        });
      }
    }

    return {
      isValid: true,
      matches: foundMatches,
      matchCount: foundMatches.length,
    };
  } catch (error) {
    return {
      isValid: false,
      matches: [],
      error: error instanceof Error ? error.message : "Regex execution failed",
      matchCount: 0,
    };
  }
};

/**
 * Escapes special regex characters in a string
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Checks if a string matches a regex pattern
 */
export const isMatch = (
  pattern: string,
  testString: string,
  flags?: RegexFlags
): boolean => {
  const result = testRegex(pattern, testString, flags);
  return result.isValid && result.matchCount > 0;
};

/**
 * Replaces matches in a string using regex
 */
export const regexReplace = (
  pattern: string,
  testString: string,
  replacement: string,
  flags: RegexFlags = {
    global: true,
    ignoreCase: false,
    multiline: false,
    sticky: false,
    unicode: false,
    dotAll: false,
  }
): {
  result: string;
  success: boolean;
  error?: string;
  replacements: number;
} => {
  const validation = validateRegexPattern(pattern, flags);

  if (!validation.isValid || !validation.regex) {
    return {
      result: testString,
      success: false,
      error: validation.error,
      replacements: 0,
    };
  }

  try {
    const originalString = testString;
    const regex = validation.regex;
    const result = testString.replace(regex, replacement);

    // Count replacements by comparing original matches
    const testResult = testRegex(pattern, originalString, flags);
    const replacements = testResult.isValid ? testResult.matchCount : 0;

    return {
      result,
      success: true,
      replacements,
    };
  } catch (error) {
    return {
      result: testString,
      success: false,
      error:
        error instanceof Error ? error.message : "Replace operation failed",
      replacements: 0,
    };
  }
};

/**
 * Extracts all matches from a string
 */
export const extractMatches = (
  pattern: string,
  testString: string,
  flags?: RegexFlags
): string[] => {
  const result = testRegex(pattern, testString, flags);
  return result.isValid ? result.matches.map((match) => match.match) : [];
};

/**
 * Gets common regex patterns
 */
export const getCommonPatterns = (): {
  [key: string]: { pattern: string; description: string; example: string };
} => {
  return {
    email: {
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      description: "Email address validation",
      example: "user@example.com",
    },
    url: {
      pattern:
        "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
      description: "URL validation",
      example: "https://www.example.com",
    },
    phone: {
      pattern: "^[\\+]?[1-9][\\d]{0,15}$",
      description: "Phone number (international format)",
      example: "+1234567890",
    },
    ipv4: {
      pattern:
        "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
      description: "IPv4 address validation",
      example: "192.168.1.1",
    },
    creditCard: {
      pattern:
        "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
      description: "Credit card number validation",
      example: "4111111111111111",
    },
    zipCode: {
      pattern: "^\\d{5}(-\\d{4})?$",
      description: "US ZIP code validation",
      example: "12345 or 12345-6789",
    },
    hexColor: {
      pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      description: "Hex color code validation",
      example: "#FF5733",
    },
    strongPassword: {
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      description: "Strong password (8+ chars, upper, lower, digit, special)",
      example: "MyPass123!",
    },
  };
};
