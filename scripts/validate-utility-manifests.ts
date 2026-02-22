import { utilities } from "../lib/generated/utilities-index";
import { getUtilityCategories } from "../lib/utilities/categories";

function main(): void {
  const categories = getUtilityCategories();
  const validCategoryIds = new Set(categories.map((category) => category.id));
  const counts = new Map<string, number>();
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const utility of utilities) {
    if (!validCategoryIds.has(utility.category)) {
      errors.push(
        `Unknown category "${utility.category}" on "${utility.slug}". Add it to lib/utilities/categories.ts.`
      );
      continue;
    }

    counts.set(utility.category, (counts.get(utility.category) ?? 0) + 1);
  }

  const totalUtilities = utilities.length;
  const maxAllowedShare = 0.4;
  for (const category of categories) {
    const count = counts.get(category.id) ?? 0;
    const share = totalUtilities === 0 ? 0 : count / totalUtilities;
    if (count === 0) {
      warnings.push(`Category "${category.id}" has no utilities assigned.`);
    } else if (share > maxAllowedShare) {
      warnings.push(
        `Category "${category.id}" has ${count}/${totalUtilities} utilities (${Math.round(
          share * 100
        )}%). Consider splitting it if this trend continues.`
      );
    }
  }

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn(`[utilities:validate] Warning: ${warning}`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[utilities:validate] Error: ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `[utilities:validate] OK (${utilities.length} utilities, ${categories.length} categories)`
  );
}

main();
