/**
 * Readability metrics: Flesch Reading Ease and Flesch-Kincaid Grade Level.
 * Uses approximate syllable counting for English text.
 */

export interface ReadabilityResult {
  fleschReadingEase: number;
  gradeLevel: number;
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
}

/**
 * Approximate syllable count for a word using vowel-group heuristics.
 * Deterministic and practical for English.
 */
export function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length === 0) return 0;

  let count = 0;
  const vowels = /[aeiouy]/;
  let prevVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const isVowel = vowels.test(cleaned[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  // Silent e at end
  if (cleaned.endsWith("e") && count > 1 && !cleaned.endsWith("le")) {
    count--;
  }
  // Common suffixes
  if (cleaned.endsWith("ed") && cleaned.length > 3) {
    const beforeEd = cleaned.slice(0, -2);
    if (!/[aeiouy]/.test(beforeEd)) count--;
  }
  if (cleaned.endsWith("es") && cleaned.length > 3) {
    const beforeEs = cleaned.slice(0, -2);
    if (beforeEs.endsWith("s") || beforeEs.endsWith("x") || beforeEs.endsWith("z")) {
      count--;
    }
  }

  return Math.max(1, count);
}

/**
 * Splits text into words (non-empty tokens).
 */
export function getWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Splits text into sentences (split on . ! ?).
 */
export function getSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Computes Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words).
 * Higher = easier to read. Range typically 0–100.
 */
export function fleschReadingEase(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 0;
  const asl = words / sentences;
  const asw = syllables / words;
  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  return Math.round(score * 10) / 10;
}

/**
 * Computes Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59.
 * Approximate U.S. school grade.
 */
export function fleschKincaidGradeLevel(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 0;
  const asl = words / sentences;
  const asw = syllables / words;
  const grade = 0.39 * asl + 11.8 * asw - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

/**
 * Computes full readability metrics from text.
 */
export function computeReadability(text: string): ReadabilityResult | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const words = getWords(trimmed);
  const sentences = getSentences(trimmed);
  if (words.length === 0 || sentences.length === 0) return null;

  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  return {
    fleschReadingEase: fleschReadingEase(words.length, sentences.length, syllableCount),
    gradeLevel: fleschKincaidGradeLevel(words.length, sentences.length, syllableCount),
    wordCount: words.length,
    sentenceCount: sentences.length,
    syllableCount,
  };
}
