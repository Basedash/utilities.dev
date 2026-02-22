export const UTILITY_CATEGORIES = [
  {
    id: "data-formatting",
    label: "Data Formatting",
    description: "Format and convert structured data and text representations.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["formatting", "json", "yaml", "markdown", "case"],
  },
  {
    id: "encoding-hashing",
    label: "Encoding & Hashing",
    description: "Encode, decode, hash, and transform values for transport and integrity checks.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["encoding", "base64", "hash", "hmac", "html entity"],
  },
  {
    id: "web-http",
    label: "Web & HTTP",
    description: "Work with URLs, HTTP protocol data, and web payload details.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["http", "url", "api", "status code"],
  },
  {
    id: "security-tokens",
    label: "Security & Tokens",
    description: "Inspect and validate token structures and security-adjacent payloads.",
    seoApplicationCategory: "SecurityApplication",
    aliases: ["security", "token", "jwt", "auth"],
  },
  {
    id: "text-regex",
    label: "Text & Regex",
    description: "Analyze, transform, and validate plain text and regular expressions.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["text", "regex", "escape", "string"],
  },
  {
    id: "time-scheduling",
    label: "Time & Scheduling",
    description: "Convert timestamps and parse schedule expressions.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["time", "timestamp", "cron", "schedule"],
  },
  {
    id: "dev-productivity",
    label: "Dev Productivity",
    description: "General-purpose tools for day-to-day engineering workflows.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["development", "productivity", "diff", "uuid"],
  },
  {
    id: "color-design",
    label: "Color & Design",
    description: "Convert and inspect colors or vector assets used in UI work.",
    seoApplicationCategory: "DesignApplication",
    aliases: ["design", "color", "svg", "hex", "rgb", "hsl"],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "Evaluate and improve accessibility details for UI content and semantics.",
    seoApplicationCategory: "DeveloperApplication",
    aliases: ["a11y", "accessibility", "wcag", "aria", "readability", "alt text"],
  },
] as const;

export type UtilityCategoryMeta = (typeof UTILITY_CATEGORIES)[number];
export type UtilityCategoryId = UtilityCategoryMeta["id"];

const CATEGORY_BY_ID = new Map<UtilityCategoryId, UtilityCategoryMeta>(
  UTILITY_CATEGORIES.map((category) => [category.id, category])
);

const CATEGORY_SIMILARITY_BONUS: Partial<Record<UtilityCategoryId, UtilityCategoryId[]>> = {
  "data-formatting": ["text-regex", "web-http"],
  "encoding-hashing": ["security-tokens", "web-http"],
  "web-http": ["security-tokens", "data-formatting"],
  "security-tokens": ["encoding-hashing", "web-http"],
  "text-regex": ["data-formatting", "dev-productivity"],
  "time-scheduling": ["dev-productivity"],
  "dev-productivity": ["time-scheduling", "text-regex"],
  "color-design": [],
  accessibility: ["color-design", "text-regex", "web-http"],
};

export function getCategoryMeta(categoryId: UtilityCategoryId): UtilityCategoryMeta {
  const category = CATEGORY_BY_ID.get(categoryId);
  if (!category) {
    throw new Error(`Unknown utility category: ${categoryId}`);
  }
  return category;
}

export function getUtilityCategories(): readonly UtilityCategoryMeta[] {
  return UTILITY_CATEGORIES;
}

export function getCategoryLabel(categoryId: UtilityCategoryId): string {
  return getCategoryMeta(categoryId).label;
}

export function mapToSeoApplicationCategory(categoryId: UtilityCategoryId): string {
  return getCategoryMeta(categoryId).seoApplicationCategory;
}

export function getCategorySearchTokens(categoryId: UtilityCategoryId): string[] {
  const category = getCategoryMeta(categoryId);
  return [category.id, category.label, ...category.aliases].map((value) =>
    value.toLowerCase()
  );
}

export function getCategoryAffinityBonus(
  sourceCategory: UtilityCategoryId,
  candidateCategory: UtilityCategoryId
): number {
  if (sourceCategory === candidateCategory) {
    return 5;
  }

  return CATEGORY_SIMILARITY_BONUS[sourceCategory]?.includes(candidateCategory) ? 2 : 0;
}
