import { describe, test, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug", () => {
  test("converts spaces to hyphens", () => {
    expect(generateSlug("hello world")).toBe("hello-world");
    expect(generateSlug("foo bar baz")).toBe("foo-bar-baz");
  });

  test("lowercases by default", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
    expect(generateSlug("UPPERCASE")).toBe("uppercase");
  });

  test("removes diacritics by default", () => {
    expect(generateSlug("café")).toBe("cafe");
    expect(generateSlug("naïve")).toBe("naive");
    expect(generateSlug("Zürich")).toBe("zurich");
    expect(generateSlug("Señor")).toBe("senor");
  });

  test("handles underscores", () => {
    expect(generateSlug("hello_world")).toBe("hello-world");
    expect(generateSlug("foo_bar_baz")).toBe("foo-bar-baz");
  });

  test("collapses multiple hyphens", () => {
    expect(generateSlug("hello   world")).toBe("hello-world");
    expect(generateSlug("foo---bar")).toBe("foo-bar");
  });

  test("trims leading and trailing hyphens", () => {
    expect(generateSlug("  hello world  ")).toBe("hello-world");
    expect(generateSlug("---hello---")).toBe("hello");
  });

  test("removes special characters", () => {
    expect(generateSlug("hello@world!")).toBe("helloworld");
    expect(generateSlug("foo#bar$baz")).toBe("foobarbaz");
  });

  test("preserves numbers", () => {
    expect(generateSlug("item 123")).toBe("item-123");
    expect(generateSlug("2024 roadmap")).toBe("2024-roadmap");
  });

  test("handles empty and whitespace input", () => {
    expect(generateSlug("")).toBe("");
    expect(generateSlug("   ")).toBe("");
    expect(generateSlug("\n\t")).toBe("");
  });

  test("handles non-string input", () => {
    expect(generateSlug(123 as unknown as string)).toBe("");
    expect(generateSlug(null as unknown as string)).toBe("");
  });

  test("respects lowercase option", () => {
    expect(generateSlug("Hello World", { lowercase: false })).toBe("Hello-World");
    expect(generateSlug("Hello World", { lowercase: true })).toBe("hello-world");
  });

  test("respects removeDiacritics option", () => {
    expect(generateSlug("café", { removeDiacritics: false })).toBe("café");
    expect(generateSlug("café", { removeDiacritics: true })).toBe("cafe");
    expect(generateSlug("Zürich", { removeDiacritics: false })).toBe("zürich");
  });

  test("real-world blog titles", () => {
    expect(generateSlug("How to Build a React App")).toBe(
      "how-to-build-a-react-app"
    );
    expect(generateSlug("What's New in JavaScript?")).toBe(
      "what-s-new-in-javascript"
    );
  });
});
