import { describe, expect, test } from "vitest";
import { utilities } from "@/lib/generated/utilities-index";
import { getCategoryMeta, getUtilityCategories } from "@/lib/utilities/categories";

describe("utility manifest category conformance", () => {
  test("all manifests reference a valid category id", () => {
    for (const utility of utilities) {
      expect(() => getCategoryMeta(utility.category)).not.toThrow();
    }
  });

  test("all configured categories are used by at least one utility", () => {
    const usedCategoryIds = new Set(utilities.map((utility) => utility.category));
    const definedCategoryIds = getUtilityCategories().map((category) => category.id);

    for (const categoryId of definedCategoryIds) {
      expect(usedCategoryIds.has(categoryId)).toBe(true);
    }
  });
});
