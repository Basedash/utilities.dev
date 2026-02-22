import { describe, test, expect } from "vitest";
import { jsonToYaml, yamlToJson, convert } from "./utils";

describe("JSON YAML Converter Utils", () => {
  describe("jsonToYaml", () => {
    test("converts simple JSON object to YAML", () => {
      const input = '{"name": "test", "value": 123}';
      const result = jsonToYaml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("name: test");
      expect(result.result).toContain("value: 123");
    });

    test("converts JSON array to YAML", () => {
      const input = '[1, 2, 3, "test"]';
      const result = jsonToYaml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("- 1");
      expect(result.result).toContain("- 2");
      expect(result.result).toContain("- test");
    });

    test("converts nested JSON to YAML", () => {
      const input = '{"nested": {"key": "value"}, "list": [1, 2]}';
      const result = jsonToYaml(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("nested:");
      expect(result.result).toContain("key: value");
      expect(result.result).toContain("list:");
    });

    test("handles empty string", () => {
      const result = jsonToYaml("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("handles whitespace-only string", () => {
      const result = jsonToYaml("   \n  \t  ");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for invalid JSON", () => {
      const testCases = [
        '{"name": test}',
        '{name: "test"}',
        '{"trailing": "comma",}',
        "{broken",
      ];

      testCases.forEach((input) => {
        const result = jsonToYaml(input);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.result).toBe("");
      });
    });
  });

  describe("yamlToJson", () => {
    test("converts simple YAML to JSON", () => {
      const input = "name: test\nvalue: 123";
      const result = yamlToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.name).toBe("test");
      expect(parsed.value).toBe(123);
    });

    test("converts YAML list to JSON array", () => {
      const input = "- 1\n- 2\n- test";
      const result = yamlToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed).toEqual([1, 2, "test"]);
    });

    test("converts nested YAML to JSON", () => {
      const input = "nested:\n  key: value\nlist:\n  - 1\n  - 2";
      const result = yamlToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.nested.key).toBe("value");
      expect(parsed.list).toEqual([1, 2]);
    });

    test("handles empty string", () => {
      const result = yamlToJson("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("handles whitespace-only string", () => {
      const result = yamlToJson("   \n  \t  ");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for invalid YAML", () => {
      const testCases = [
        "key: value\n  bad: indent\n    wrong",
        "invalid: [unclosed bracket",
        "  - broken: list: syntax",
      ];

      testCases.forEach((input) => {
        const result = yamlToJson(input);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.result).toBe("");
      });
    });
  });

  describe("convert", () => {
    test("json-to-yaml direction calls jsonToYaml", () => {
      const input = '{"a": 1}';
      const result = convert(input, "json-to-yaml");

      expect(result.success).toBe(true);
      expect(result.result).toContain("a: 1");
    });

    test("yaml-to-json direction calls yamlToJson", () => {
      const input = "a: 1";
      const result = convert(input, "yaml-to-json");

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.a).toBe(1);
    });
  });

  describe("round-trip", () => {
    test("JSON to YAML to JSON preserves data", () => {
      const original = '{"name":"test","values":[1,2,3],"nested":{"key":"value"}}';
      const toYaml = jsonToYaml(original);
      expect(toYaml.success).toBe(true);

      const backToJson = yamlToJson(toYaml.result);
      expect(backToJson.success).toBe(true);

      const parsed = JSON.parse(backToJson.result);
      expect(parsed).toEqual(JSON.parse(original));
    });

    test("YAML to JSON to YAML preserves data structure", () => {
      const original = "name: test\nvalues:\n  - 1\n  - 2\nnested:\n  key: value";
      const toJson = yamlToJson(original);
      expect(toJson.success).toBe(true);

      const backToYaml = jsonToYaml(toJson.result);
      expect(backToYaml.success).toBe(true);

      const roundTrip = yamlToJson(backToYaml.result);
      expect(roundTrip.success).toBe(true);
      expect(JSON.parse(roundTrip.result)).toEqual(JSON.parse(toJson.result));
    });
  });
});
