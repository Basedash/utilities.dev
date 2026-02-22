import { describe, test, expect } from "vitest";
import { tokenize, convertCase, type CaseFormat } from "./utils";

describe("tokenize", () => {
  test("splits on spaces", () => {
    expect(tokenize("hello world")).toEqual(["hello", "world"]);
    expect(tokenize("foo bar baz")).toEqual(["foo", "bar", "baz"]);
  });

  test("splits on underscores", () => {
    expect(tokenize("hello_world")).toEqual(["hello", "world"]);
    expect(tokenize("foo_bar_baz")).toEqual(["foo", "bar", "baz"]);
  });

  test("splits on hyphens", () => {
    expect(tokenize("hello-world")).toEqual(["hello", "world"]);
    expect(tokenize("foo-bar-baz")).toEqual(["foo", "bar", "baz"]);
  });

  test("splits on mixed delimiters", () => {
    expect(tokenize("hello_world-foo bar")).toEqual([
      "hello",
      "world",
      "foo",
      "bar",
    ]);
  });

  test("splits camelCase", () => {
    expect(tokenize("helloWorld")).toEqual(["hello", "World"]);
    expect(tokenize("fooBarBaz")).toEqual(["foo", "Bar", "Baz"]);
  });

  test("splits PascalCase", () => {
    expect(tokenize("HelloWorld")).toEqual(["Hello", "World"]);
    expect(tokenize("FooBarBaz")).toEqual(["Foo", "Bar", "Baz"]);
  });

  test("splits acronyms before lowercase", () => {
    expect(tokenize("getHTTPResponse")).toEqual(["get", "HTTP", "Response"]);
    expect(tokenize("parseXML")).toEqual(["parse", "XML"]);
    expect(tokenize("XMLParser")).toEqual(["XML", "Parser"]);
  });

  test("handles numbers at boundaries", () => {
    expect(tokenize("item2")).toEqual(["item", "2"]);
    expect(tokenize("item2Count")).toEqual(["item", "2", "Count"]);
  });

  test("returns empty array for empty or whitespace input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
    expect(tokenize("\n\t")).toEqual([]);
  });

  test("handles single word", () => {
    expect(tokenize("hello")).toEqual(["hello"]);
    expect(tokenize("Hello")).toEqual(["Hello"]);
  });

  test("handles non-string input", () => {
    expect(tokenize(123 as unknown as string)).toEqual([]);
    expect(tokenize(null as unknown as string)).toEqual([]);
  });

  test("trims and normalizes multiple spaces", () => {
    expect(tokenize("  foo   bar  ")).toEqual(["foo", "bar"]);
  });
});

describe("convertCase", () => {
  const formats: CaseFormat[] = [
    "camel",
    "pascal",
    "snake",
    "kebab",
    "upper_snake",
  ];

  test("camelCase conversion", () => {
    expect(convertCase("hello world", "camel")).toBe("helloWorld");
    expect(convertCase("foo_bar_baz", "camel")).toBe("fooBarBaz");
    expect(convertCase("HELLO WORLD", "camel")).toBe("helloWorld");
    expect(convertCase("getHTTPResponse", "camel")).toBe("getHttpResponse");
  });

  test("PascalCase conversion", () => {
    expect(convertCase("hello world", "pascal")).toBe("HelloWorld");
    expect(convertCase("foo_bar_baz", "pascal")).toBe("FooBarBaz");
    expect(convertCase("getHTTPResponse", "pascal")).toBe("GetHttpResponse");
  });

  test("snake_case conversion", () => {
    expect(convertCase("hello world", "snake")).toBe("hello_world");
    expect(convertCase("HelloWorld", "snake")).toBe("hello_world");
    expect(convertCase("foo-bar-baz", "snake")).toBe("foo_bar_baz");
  });

  test("kebab-case conversion", () => {
    expect(convertCase("hello world", "kebab")).toBe("hello-world");
    expect(convertCase("HelloWorld", "kebab")).toBe("hello-world");
    expect(convertCase("foo_bar_baz", "kebab")).toBe("foo-bar-baz");
  });

  test("UPPER_SNAKE_CASE conversion", () => {
    expect(convertCase("hello world", "upper_snake")).toBe("HELLO_WORLD");
    expect(convertCase("HelloWorld", "upper_snake")).toBe("HELLO_WORLD");
    expect(convertCase("foo-bar-baz", "upper_snake")).toBe("FOO_BAR_BAZ");
  });

  test("returns empty string for empty input", () => {
    formats.forEach((format) => {
      expect(convertCase("", format)).toBe("");
      expect(convertCase("   ", format)).toBe("");
    });
  });

  test("handles non-string input", () => {
    formats.forEach((format) => {
      expect(convertCase(123 as unknown as string, format)).toBe("");
      expect(convertCase(null as unknown as string, format)).toBe("");
    });
  });

  test("single word preserves in each format", () => {
    expect(convertCase("hello", "camel")).toBe("hello");
    expect(convertCase("hello", "pascal")).toBe("Hello");
    expect(convertCase("hello", "snake")).toBe("hello");
    expect(convertCase("hello", "kebab")).toBe("hello");
    expect(convertCase("hello", "upper_snake")).toBe("HELLO");
  });

  test("round-trip through tokenize is consistent", () => {
    const inputs = [
      "hello world",
      "foo_bar_baz",
      "hello-world",
      "helloWorld",
      "HelloWorld",
      "getHTTPResponse",
    ];
    inputs.forEach((input) => {
      const snake = convertCase(input, "snake");
      const backToCamel = convertCase(snake, "camel");
      expect(backToCamel).toBe(convertCase(backToCamel, "camel"));
    });
  });

  test("numbers in input are preserved", () => {
    expect(convertCase("item 2 count", "camel")).toBe("item2Count");
    expect(convertCase("item 2 count", "snake")).toBe("item_2_count");
    expect(convertCase("item 2 count", "kebab")).toBe("item-2-count");
  });
});
