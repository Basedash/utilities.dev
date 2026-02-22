import {
  getCategoryLabel,
  getCategorySearchTokens,
  type UtilityCategoryId,
} from "@/lib/utilities/categories";
import type { UtilityManifest } from "@/lib/utilities/types";

export interface UtilityDiscoveryFilters {
  query: string;
  category: UtilityCategoryId | "all";
}

export function filterUtilities(
  utilities: readonly UtilityManifest[],
  filters: UtilityDiscoveryFilters
): UtilityManifest[] {
  const normalizedQuery = filters.query.toLowerCase().trim();

  return utilities.filter((utility) => {
    if (filters.category !== "all" && utility.category !== filters.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const categoryTokens = getCategorySearchTokens(utility.category);
    return (
      utility.title.toLowerCase().includes(normalizedQuery) ||
      utility.description.toLowerCase().includes(normalizedQuery) ||
      utility.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      categoryTokens.some((token) => token.includes(normalizedQuery))
    );
  });
}

export function groupUtilitiesByCategory(utilities: readonly UtilityManifest[]) {
  const grouped = new Map<UtilityCategoryId, UtilityManifest[]>();

  for (const utility of utilities) {
    const categoryUtilities = grouped.get(utility.category) ?? [];
    categoryUtilities.push(utility);
    grouped.set(utility.category, categoryUtilities);
  }

  return [...grouped.entries()].map(([categoryId, categoryUtilities]) => ({
    categoryId,
    categoryLabel: getCategoryLabel(categoryId),
    utilities: categoryUtilities.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
