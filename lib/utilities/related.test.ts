import { describe, expect, test } from "vitest";
import { utilitiesById } from "@/lib/generated/utilities-index";
import { getRelatedUtilities } from "@/lib/utilities/related";

describe("getRelatedUtilities", () => {
  test("prioritizes same-category matches when available", () => {
    const source = utilitiesById.get("regex-tester");
    expect(source).toBeDefined();

    const related = getRelatedUtilities(source!, 4);
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((utility) => utility.id === "text-escape-unescape")).toBe(true);
  });

  test("gives similar categories an advantage over distant categories", () => {
    const source = utilitiesById.get("json-formatter");
    expect(source).toBeDefined();

    const related = getRelatedUtilities(source!, 20);
    const webHttpIndex = related.findIndex((utility) => utility.id === "url-parser");
    const designIndex = related.findIndex((utility) => utility.id === "color-converter");

    expect(webHttpIndex).toBeGreaterThanOrEqual(0);
    expect(designIndex).toBeGreaterThanOrEqual(0);
    expect(webHttpIndex).toBeLessThan(designIndex);
  });
});
