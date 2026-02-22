import { describe, expect, test } from "vitest";
import {
  getCategoryAffinityBonus,
  getCategoryMeta,
  getUtilityCategories,
  mapToSeoApplicationCategory,
} from "@/lib/utilities/categories";

describe("utility category registry", () => {
  test("has unique category ids", () => {
    const categories = getUtilityCategories();
    const ids = categories.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("returns metadata and SEO category mapping", () => {
    expect(getCategoryMeta("web-http").label).toBe("Web & HTTP");
    expect(mapToSeoApplicationCategory("security-tokens")).toBe("SecurityApplication");
  });

  test("prefers same-category affinity over related-category affinity", () => {
    expect(getCategoryAffinityBonus("web-http", "web-http")).toBe(5);
    expect(getCategoryAffinityBonus("web-http", "security-tokens")).toBe(2);
    expect(getCategoryAffinityBonus("web-http", "color-design")).toBe(0);
  });
});
