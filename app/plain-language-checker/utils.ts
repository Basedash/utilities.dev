/**
 * Plain-language checker: long sentences, passive markers, jargon, suggestions.
 * Heuristic only; deterministic and practical.
 */

export interface PlainLanguageResult {
  longSentences: { index: number; wordCount: number; text: string }[];
  passiveMarkers: { index: number; text: string }[];
  jargonHits: { index: number; word: string; text: string }[];
  suggestions: string[];
}

const LONG_SENTENCE_WORD_LIMIT = 25;

const PASSIVE_PATTERNS = [
  /\b(is|are|was|were|been|being)\s+[\w-]+ed\b/gi,
  /\b(is|are|was|were|been|being)\s+[\w-]+en\b/gi,
  /\b(is|are|was|were|been|being)\s+[\w-]+t\b/gi, // e.g. "is sent", "was built"
];

const JARGON_LIST = [
  "utilize",
  "leverage",
  "synergy",
  "paradigm",
  "bandwidth",
  "stakeholder",
  "granular",
  "scalable",
  "robust",
  "seamless",
  "holistic",
  "streamline",
  "optimize",
  "facilitate",
  "implement",
  "deploy",
  "integrate",
  "aggregate",
  "iterate",
  "monetize",
  "incentivize",
  "prioritize",
  "finalize",
  "architect",
  "orchestrate",
  "provision",
  "proliferate",
  "disambiguate",
  "circumvent",
  "ameliorate",
  "remediate",
  "proactive",
  "actionable",
  "viable",
  "sustainable",
  "comprehensive",
  "extensible",
  "configurable",
  "asynchronous",
  "synchronous",
  "idempotent",
  "deterministic",
  "heuristic",
  "algorithmic",
  "parametric",
  "polymorphic",
  "recursive",
  "iterative",
  "declarative",
  "imperative",
  "deprecated",
  "obsolete",
  "legacy",
  "proprietary",
  "enterprise",
  "cloud-native",
  "microservice",
  "monolithic",
  "distributed",
  "resilient",
  "fault-tolerant",
  "high-availability",
  "low-latency",
  "throughput",
  "bottleneck",
  "scalability",
  "maintainability",
  "extensibility",
  "interoperability",
  "compatibility",
  "backward-compatible",
  "forward-compatible",
];

const JARGON_SET = new Set(JARGON_LIST.map((w) => w.toLowerCase()));

function getSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getWords(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean);
}

/**
 * Checks text for plain-language issues and returns flags and suggestions.
 */
export function checkPlainLanguage(text: string): PlainLanguageResult | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sentences = getSentences(trimmed);
  if (sentences.length === 0) return null;

  const longSentences: PlainLanguageResult["longSentences"] = [];
  const passiveMarkers: PlainLanguageResult["passiveMarkers"] = [];
  const jargonHits: PlainLanguageResult["jargonHits"] = [];
  const suggestions: string[] = [];

  sentences.forEach((sent, i) => {
    const words = getWords(sent);
    const wordCount = words.length;

    if (wordCount > LONG_SENTENCE_WORD_LIMIT) {
      longSentences.push({ index: i + 1, wordCount, text: sent.slice(0, 80) + (sent.length > 80 ? "…" : "") });
    }

    for (const pattern of PASSIVE_PATTERNS) {
      const match = sent.match(pattern);
      if (match) {
        match.forEach((m) => {
          passiveMarkers.push({ index: i + 1, text: m });
        });
      }
    }

    words.forEach((w) => {
      const lower = w.toLowerCase().replace(/[^a-z-]/g, "");
      if (JARGON_SET.has(lower)) {
        jargonHits.push({ index: i + 1, word: w, text: sent.slice(0, 80) + (sent.length > 80 ? "…" : "") });
      }
    });
  });

  if (longSentences.length > 0) {
    suggestions.push(`Consider shortening ${longSentences.length} long sentence(s) (over ${LONG_SENTENCE_WORD_LIMIT} words).`);
  }
  if (passiveMarkers.length > 0) {
    suggestions.push(`Found ${passiveMarkers.length} passive-ish phrase(s). Prefer active voice where possible.`);
  }
  if (jargonHits.length > 0) {
    const unique = new Set(jargonHits.map((j) => j.word.toLowerCase()));
    suggestions.push(`Found ${jargonHits.length} jargon hit(s) (${unique.size} unique). Consider simpler alternatives.`);
  }
  if (suggestions.length === 0) {
    suggestions.push("No major plain-language issues detected. Keep it clear and concise.");
  }

  return {
    longSentences,
    passiveMarkers,
    jargonHits,
    suggestions,
  };
}
