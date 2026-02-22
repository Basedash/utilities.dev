/**
 * Strength level for display
 */
export type StrengthLevel = "very-weak" | "weak" | "fair" | "strong" | "very-strong";

/**
 * Password strength analysis result
 */
export interface PasswordStrengthResult {
  score: number;
  level: StrengthLevel;
  feedback: string[];
  checks: {
    length: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
    noCommonPattern: boolean;
    noSequential: boolean;
  };
}

const MIN_LENGTH = 8;
const STRONG_LENGTH = 12;
const COMMON_PATTERNS = [
  /^password/i,
  /^12345678/,
  /^qwerty/i,
  /^letmein/i,
  /^welcome/i,
  /^monkey/i,
  /^dragon/i,
  /^master/i,
  /^sunshine/i,
  /^princess/i,
  /^football/i,
  /^iloveyou/i,
  /^admin/i,
  /^login/i,
  /^abc123/i,
  /^111111/,
  /^123123/,
];

const SEQUENTIAL_PATTERNS = [
  "0123456789",
  "abcdefghijklmnopqrstuvwxyz",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "abc",
  "123",
  "012",
  "qwe",
  "asd",
  "zxc",
];

/**
 * Checks if password contains a sequential pattern (forward or reverse).
 */
function hasSequentialPattern(password: string): boolean {
  const lower = password.toLowerCase();
  for (const seq of SEQUENTIAL_PATTERNS) {
    const rev = seq.split("").reverse().join("");
    if (lower.includes(seq) || lower.includes(rev)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if password matches common weak patterns.
 */
function hasCommonPattern(password: string): boolean {
  return COMMON_PATTERNS.some((re) => re.test(password));
}

/**
 * Analyzes password strength and returns score, level, and feedback.
 * Heuristic only; does not guarantee security.
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  const checks = {
    length: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSymbol: false,
    noCommonPattern: true,
    noSequential: true,
  };

  if (typeof password !== "string") {
    return {
      score: 0,
      level: "very-weak",
      feedback: ["Input must be a string"],
      checks,
    };
  }

  const len = password.length;

  if (len >= MIN_LENGTH) checks.length = true;
  else feedback.push(`Use at least ${MIN_LENGTH} characters`);

  if (/[a-z]/.test(password)) checks.hasLower = true;
  else feedback.push("Add lowercase letters");
  if (/[A-Z]/.test(password)) checks.hasUpper = true;
  else feedback.push("Add uppercase letters");
  if (/\d/.test(password)) checks.hasNumber = true;
  else feedback.push("Add numbers");
  if (/[^A-Za-z0-9]/.test(password)) checks.hasSymbol = true;
  else feedback.push("Add symbols (!@#$%^&* etc.)");

  if (hasCommonPattern(password)) {
    checks.noCommonPattern = false;
    feedback.push("Avoid common words or patterns (e.g. password, 123456)");
  }
  if (hasSequentialPattern(password)) {
    checks.noSequential = false;
    feedback.push("Avoid sequential characters (e.g. abc, 123)");
  }

  let score = 0;

  score += len >= STRONG_LENGTH ? 2 : len >= MIN_LENGTH ? 1 : 0;
  score += checks.hasLower ? 1 : 0;
  score += checks.hasUpper ? 1 : 0;
  score += checks.hasNumber ? 1 : 0;
  score += checks.hasSymbol ? 1 : 0;
  score += checks.noCommonPattern ? 1 : 0;
  score += checks.noSequential ? 1 : 0;

  const cappedScore = Math.min(score, 10);

  let level: StrengthLevel;
  if (cappedScore <= 2) level = "very-weak";
  else if (cappedScore <= 4) level = "weak";
  else if (cappedScore <= 6) level = "fair";
  else if (cappedScore <= 8) level = "strong";
  else level = "very-strong";

  if (feedback.length === 0) {
    feedback.push("Good variety and length. Consider using a password manager.");
  }

  return {
    score: cappedScore,
    level,
    feedback,
    checks,
  };
}
