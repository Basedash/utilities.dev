import { utilities } from "@/lib/generated/utilities-index";
import type { UtilityManifest } from "@/lib/utilities/types";

function normalizeToken(token: string): string {
  return token.toLowerCase().trim();
}

function getTitleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2)
  );
}

export function getRelatedUtilities(
  source: UtilityManifest,
  limit = 4
): UtilityManifest[] {
  const sourceTags = new Set(source.tags.map(normalizeToken));
  const sourceTitleTokens = getTitleTokens(source.title);

  const ranked = utilities
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => {
      const candidateTags = candidate.tags.map(normalizeToken);
      const sharedTags = candidateTags.filter((tag) => sourceTags.has(tag)).length;
      const candidateTitleTokens = getTitleTokens(candidate.title);
      const sharedTitleTokens = [...candidateTitleTokens].filter((token) =>
        sourceTitleTokens.has(token)
      ).length;

      const score =
        (candidate.category === source.category ? 5 : 0) +
        sharedTags * 2 +
        sharedTitleTokens;

      return {
        candidate,
        score,
        sharedTags,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.sharedTags !== a.sharedTags) return b.sharedTags - a.sharedTags;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  return ranked.slice(0, limit).map((item) => item.candidate);
}
