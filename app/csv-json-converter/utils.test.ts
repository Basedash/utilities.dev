import { describe, test, expect } from "vitest";
import {
  csvToJson,
  jsonToCsv,
  convert,
} from "./utils";

describe("CSV JSON Converter Utils", () => {
  describe("csvToJson", () => {
    test("converts simple CSV to JSON", () => {
      const input = "name,age,city\nAlice,30,NYC\nBob,25,LA";
      const result = csvToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toEqual({ name: "Alice", age: "30", city: "NYC" });
      expect(parsed[1]).toEqual({ name: "Bob", age: "25", city: "LA" });
    });

    test("converts CSV with quoted fields", () => {
      const input = 'name,description\nAlice,"Hello, World"\nBob,"Say ""Hi"""';
      const result = csvToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed[0].description).toBe("Hello, World");
      expect(parsed[1].description).toBe('Say "Hi"');
    });

    test("handles empty string", () => {
      const result = csvToJson("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("[]");
    });

    test("handles single header row", () => {
      const input = "a,b,c";
      const result = csvToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed).toHaveLength(0);
    });

    test("handles custom delimiter", () => {
      const input = "name;age;city\nAlice;30;NYC";
      const result = csvToJson(input, ";");

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed[0]).toEqual({ name: "Alice", age: "30", city: "NYC" });
    });

    test("handles uneven columns", () => {
      const input = "a,b,c\n1,2\n1,2,3,4";
      const result = csvToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed[0]).toEqual({ a: "1", b: "2", c: "" });
      expect(parsed[1]).toEqual({ a: "1", b: "2", c: "3" });
    });
  });

  describe("jsonToCsv", () => {
    test("converts JSON array to CSV", () => {
      const input = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';
      const result = jsonToCsv(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("name,age");
      expect(result.result).toContain("Alice,30");
      expect(result.result).toContain("Bob,25");
    });

    test("escapes fields with commas", () => {
      const input = '[{"a":"x,y","b":"z"}]';
      const result = jsonToCsv(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain('"x,y"');
    });

    test("escapes fields with quotes", () => {
      const input = '[{"a":"say \\"hi\\""}]';
      const result = jsonToCsv(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain('"say ""hi"""');
    });

    test("handles empty array", () => {
      const result = jsonToCsv("[]");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("handles empty string", () => {
      const result = jsonToCsv("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for non-array JSON", () => {
      const result = jsonToCsv('{"a":1}');
      expect(result.success).toBe(false);
      expect(result.error).toContain("array");
    });

    test("returns error for array of non-objects", () => {
      const result = jsonToCsv("[1,2,3]");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("handles custom delimiter", () => {
      const input = '[{"a":"1","b":"2"}]';
      const result = jsonToCsv(input, ";");

      expect(result.success).toBe(true);
      expect(result.result).toContain("a;b");
      expect(result.result).toContain("1;2");
    });
  });

  describe("convert", () => {
    test("csv-to-json direction", () => {
      const input = "x,y\n1,2";
      const result = convert(input, "csv-to-json");

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed[0]).toEqual({ x: "1", y: "2" });
    });

    test("json-to-csv direction", () => {
      const input = '[{"x":"1","y":"2"}]';
      const result = convert(input, "json-to-csv");

      expect(result.success).toBe(true);
      expect(result.result).toContain("x,y");
      expect(result.result).toContain("1,2");
    });
  });

  describe("round-trip", () => {
    test("CSV to JSON to CSV preserves data", () => {
      const original = "name,age\nAlice,30\nBob,25";
      const toJson = csvToJson(original);
      expect(toJson.success).toBe(true);

      const backToCsv = jsonToCsv(toJson.result);
      expect(backToCsv.success).toBe(true);
      expect(backToCsv.result).toContain("name,age");
      expect(backToCsv.result).toContain("Alice,30");
      expect(backToCsv.result).toContain("Bob,25");
    });

    test("JSON to CSV to JSON preserves structure", () => {
      const original = '[{"a":"1","b":"2"},{"a":"3","b":"4"}]';
      const toCsv = jsonToCsv(original);
      expect(toCsv.success).toBe(true);

      const backToJson = csvToJson(toCsv.result);
      expect(backToJson.success).toBe(true);
      const parsed = JSON.parse(backToJson.result);
      expect(parsed[0]).toEqual({ a: "1", b: "2" });
      expect(parsed[1]).toEqual({ a: "3", b: "4" });
    });
  });
});
