import { Code } from "lucide-react";
import { describe, expect, test } from "vitest";
import { filterUtilities, groupUtilitiesByCategory } from "@/lib/utilities/discovery";
import type { UtilityManifest } from "@/lib/utilities/types";

function createManifest(
  id: string,
  title: string,
  category: UtilityManifest["category"],
  tags: string[]
): UtilityManifest {
  return {
    id,
    slug: id,
    title,
    description: `${title} description`,
    category,
    tags,
    icon: Code,
    content: {
      intro: "intro",
      trustNote: "trust",
      howToSteps: ["one", "two", "three"],
      about: "about",
      useCases: ["one", "two", "three"],
      faqs: [],
    },
  };
}

const mockUtilities: UtilityManifest[] = [
  createManifest("json-formatter", "JSON Formatter", "data-formatting", ["json", "format"]),
  createManifest("url-parser", "URL Parser", "web-http", ["url", "query"]),
  createManifest("regex-tester", "Regex Tester", "text-regex", ["regex", "match"]),
];

describe("utility discovery", () => {
  test("filters by query across category aliases", () => {
    const results = filterUtilities(mockUtilities, {
      query: "http",
      category: "all",
    });

    expect(results.map((utility) => utility.id)).toEqual(["url-parser"]);
  });

  test("composes text query with selected category filter", () => {
    const results = filterUtilities(mockUtilities, {
      query: "json",
      category: "data-formatting",
    });

    expect(results.map((utility) => utility.id)).toEqual(["json-formatter"]);
  });

  test("groups utilities by category and sorts group members by title", () => {
    const grouped = groupUtilitiesByCategory([
      createManifest("b", "B Title", "data-formatting", ["b"]),
      createManifest("a", "A Title", "data-formatting", ["a"]),
      createManifest("c", "C Title", "web-http", ["c"]),
    ]);

    expect(grouped).toHaveLength(2);
    expect(grouped[0]?.utilities.map((utility) => utility.title)).toEqual([
      "A Title",
      "B Title",
    ]);
  });
});
