import { describe, test, expect } from "vitest";
import {
  validateJson,
  formatJson,
  minifyJson,
  calculateJsonStats,
  formatBytes,
  escapeJsonString,
  unescapeJsonString,
  getJsonDepth,
} from "./utils";

describe("JSON Formatter Utils", () => {
  describe("validateJson", () => {
    test("validates correct JSON objects", () => {
      const result = validateJson('{"name": "test", "value": 123}');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toEqual({ name: "test", value: 123 });
    });

    test("validates correct JSON arrays", () => {
      const result = validateJson('[1, 2, 3, "test"]');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toEqual([1, 2, 3, "test"]);
    });

    test("validates primitive JSON values", () => {
      expect(validateJson("123").isValid).toBe(true);
      expect(validateJson('"hello"').isValid).toBe(true);
      expect(validateJson("true").isValid).toBe(true);
      expect(validateJson("null").isValid).toBe(true);
    });

    test("handles empty string as valid", () => {
      const result = validateJson("");
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBeUndefined();
    });

    test("handles whitespace-only string as valid", () => {
      const result = validateJson("   \n  \t  ");
      expect(result.isValid).toBe(true);
    });

    test("rejects invalid JSON", () => {
      const testCases = [
        '{"name": test}', // unquoted value
        '{name: "test"}', // unquoted key
        '{"name": "test",}', // trailing comma
        '{{"nested": "invalid"}}', // double opening brace
        "undefined",
        "function() {}",
        "{broken",
      ];

      testCases.forEach((json) => {
        const result = validateJson(json);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });

  describe("formatJson", () => {
    test("formats valid JSON with default spacing", () => {
      const input = '{"name":"test","values":[1,2,3]}';
      const result = formatJson(input);

      expect(result.success).toBe(true);
      expect(result.result).toBe(
        '{\n  "name": "test",\n  "values": [\n    1,\n    2,\n    3\n  ]\n}'
      );
      expect(result.stats).toBeDefined();
    });

    test("formats with custom spacing", () => {
      const input = '{"name":"test"}';
      const result = formatJson(input, 4);

      expect(result.success).toBe(true);
      expect(result.result).toBe('{\n    "name": "test"\n}');
    });

    test("handles empty string", () => {
      const result = formatJson("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
      expect(result.stats).toEqual({ size: 0, lines: 0, characters: 0 });
    });

    test("returns error for invalid JSON", () => {
      const result = formatJson('{"invalid": json}');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.result).toBe("");
    });

    test("formats complex nested structures", () => {
      const input =
        '{"users":[{"id":1,"name":"Alice","settings":{"theme":"dark","notifications":true}}]}';
      const result = formatJson(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain('"users": [');
      expect(result.result).toContain('    "id": 1,');
      expect(result.result).toContain('      "theme": "dark"');
    });
  });

  describe("minifyJson", () => {
    test("minifies formatted JSON", () => {
      const input =
        '{\n  "name": "test",\n  "values": [\n    1,\n    2,\n    3\n  ]\n}';
      const result = minifyJson(input);

      expect(result.success).toBe(true);
      expect(result.result).toBe('{"name":"test","values":[1,2,3]}');
    });

    test("handles already minified JSON", () => {
      const input = '{"name":"test","values":[1,2,3]}';
      const result = minifyJson(input);

      expect(result.success).toBe(true);
      expect(result.result).toBe('{"name":"test","values":[1,2,3]}');
    });

    test("handles empty string", () => {
      const result = minifyJson("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for invalid JSON", () => {
      const result = minifyJson('{"invalid": json}');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("removes all unnecessary whitespace", () => {
      const input = `{
        "name"  :  "test"  ,
        "array"  :  [  1  ,  2  ,  3  ]  ,
        "nested"  :  {
          "value"  :  true
        }
      }`;
      const result = minifyJson(input);

      expect(result.success).toBe(true);
      expect(result.result).toBe(
        '{"name":"test","array":[1,2,3],"nested":{"value":true}}'
      );
    });
  });

  describe("calculateJsonStats", () => {
    test("calculates stats for simple JSON", () => {
      const json = '{"name":"test"}';
      const stats = calculateJsonStats(json);

      expect(stats.characters).toBe(json.length);
      expect(stats.lines).toBe(1);
      expect(stats.size).toBe(json.length);
    });

    test("calculates stats for multiline JSON", () => {
      const json = '{\n  "name": "test"\n}';
      const stats = calculateJsonStats(json);

      expect(stats.characters).toBe(json.length);
      expect(stats.lines).toBe(3);
      expect(stats.size).toBeGreaterThanOrEqual(json.length);
    });

    test("handles empty string", () => {
      const stats = calculateJsonStats("");
      expect(stats.characters).toBe(0);
      expect(stats.lines).toBe(1);
      expect(stats.size).toBe(0);
    });
  });

  describe("formatBytes", () => {
    test("formats bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(512)).toBe("512 B");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1536)).toBe("1.5 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1073741824)).toBe("1 GB");
    });

    test("handles large numbers", () => {
      expect(formatBytes(1099511627776)).toBe("1099511627776 B"); // Over GB range
    });

    test("handles decimal precision", () => {
      expect(formatBytes(1234)).toBe("1.2 KB");
      expect(formatBytes(1234567)).toBe("1.2 MB");
    });
  });

  describe("escapeJsonString", () => {
    test("escapes special characters", () => {
      expect(escapeJsonString("hello\nworld")).toBe("hello\\nworld");
      expect(escapeJsonString('quote"test')).toBe('quote\\"test');
      expect(escapeJsonString("backslash\\test")).toBe("backslash\\\\test");
      expect(escapeJsonString("tab\ttest")).toBe("tab\\ttest");
      expect(escapeJsonString("carriage\rtest")).toBe("carriage\\rtest");
    });

    test("handles multiple escape characters", () => {
      const input = 'line1\nline2\tindented"quoted"\\backslash\rcarriage';
      const expected =
        'line1\\nline2\\tindented\\"quoted\\"\\\\backslash\\rcarriage';
      expect(escapeJsonString(input)).toBe(expected);
    });

    test("handles empty string", () => {
      expect(escapeJsonString("")).toBe("");
    });
  });

  describe("unescapeJsonString", () => {
    test("unescapes special characters", () => {
      expect(unescapeJsonString("hello\\nworld")).toBe("hello\nworld");
      expect(unescapeJsonString('quote\\"test')).toBe('quote"test');
      expect(unescapeJsonString("backslash\\\\test")).toBe("backslash\\test");
      expect(unescapeJsonString("tab\\ttest")).toBe("tab\ttest");
      expect(unescapeJsonString("carriage\\rtest")).toBe("carriage\rtest");
    });

    test("handles round-trip escaping", () => {
      const testStrings = [
        "hello\nworld",
        'quote"test',
        "backslash\\test",
        "tab\ttest",
        "carriage\rtest",
        'mixed\n"content\\with\ttabs\r',
      ];

      testStrings.forEach((original) => {
        const escaped = escapeJsonString(original);
        const unescaped = unescapeJsonString(escaped);
        expect(unescaped).toBe(original);
      });
    });
  });

  describe("getJsonDepth", () => {
    test("calculates depth for primitive values", () => {
      expect(getJsonDepth(null)).toBe(0);
      expect(getJsonDepth(123)).toBe(0);
      expect(getJsonDepth("string")).toBe(0);
      expect(getJsonDepth(true)).toBe(0);
    });

    test("calculates depth for flat objects and arrays", () => {
      expect(getJsonDepth({})).toBe(0);
      expect(getJsonDepth([])).toBe(0);
      expect(getJsonDepth({ name: "test", value: 123 })).toBe(1);
      expect(getJsonDepth([1, 2, 3])).toBe(1);
    });

    test("calculates depth for nested structures", () => {
      const nested = {
        level1: {
          level2: {
            level3: {
              value: "deep",
            },
          },
        },
      };
      expect(getJsonDepth(nested)).toBe(4);
    });

    test("calculates depth for mixed nested structures", () => {
      const complex = {
        users: [
          {
            id: 1,
            profile: {
              settings: {
                theme: "dark",
              },
            },
          },
        ],
      };
      expect(getJsonDepth(complex)).toBe(5);
    });

    test("calculates depth for arrays with nested objects", () => {
      const arrayDepth = [[[1, 2, 3]]];
      expect(getJsonDepth(arrayDepth)).toBe(3);
    });
  });

  describe("integration tests", () => {
    test("format and minify preserve data integrity", () => {
      const testObjects = [
        { name: "test", values: [1, 2, 3] },
        [
          { id: 1, active: true },
          { id: 2, active: false },
        ],
        { nested: { deep: { value: "test" } } },
        null,
        "simple string",
        [1, "mixed", true, null, { object: "in array" }],
      ];

      testObjects.forEach((obj) => {
        const originalJson = JSON.stringify(obj);

        // Format and minify should preserve data
        const formatted = formatJson(originalJson);
        const minified = minifyJson(formatted.result);

        expect(formatted.success).toBe(true);
        expect(minified.success).toBe(true);
        expect(JSON.parse(minified.result)).toEqual(obj);
      });
    });

    test("handles malformed JSON gracefully", () => {
      const malformedJson = [
        '{"unclosed": ',
        '{duplicate: "key", duplicate: "value"}',
        '{"trailing": "comma",}',
        "undefined",
        "{broken syntax here}",
      ];

      malformedJson.forEach((json) => {
        const validation = validateJson(json);
        const formatted = formatJson(json);
        const minified = minifyJson(json);

        expect(validation.isValid).toBe(false);
        expect(formatted.success).toBe(false);
        expect(minified.success).toBe(false);
      });
    });
  });
});
