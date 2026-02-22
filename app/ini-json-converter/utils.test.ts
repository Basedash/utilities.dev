import { describe, test, expect } from "vitest";
import {
  iniToJson,
  jsonToIni,
  convert,
} from "./utils";

describe("INI JSON Converter Utils", () => {
  describe("iniToJson", () => {
    test("converts simple INI to JSON", () => {
      const input = "[section]\nkey=value\nother=123";
      const result = iniToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.section).toEqual({ key: "value", other: "123" });
    });

    test("converts INI with global section", () => {
      const input = "global=yes\n[section]\nkey=value";
      const result = iniToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed[""]).toEqual({ global: "yes" });
      expect(parsed.section).toEqual({ key: "value" });
    });

    test("ignores comments and empty lines", () => {
      const input = "; comment\n# also comment\n[sec]\nkey=val\n\nother=thing";
      const result = iniToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.sec).toEqual({ key: "val", other: "thing" });
    });

    test("handles empty string", () => {
      const result = iniToJson("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("{}");
    });

    test("handles values with equals sign", () => {
      const input = "[sec]\npath=/usr/bin=/extra";
      const result = iniToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.sec.path).toBe("/usr/bin=/extra");
    });

    test("handles multiple sections", () => {
      const input = "[a]\nx=1\n[b]\ny=2";
      const result = iniToJson(input);

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.a).toEqual({ x: "1" });
      expect(parsed.b).toEqual({ y: "2" });
    });
  });

  describe("jsonToIni", () => {
    test("converts JSON object to INI", () => {
      const input = '{"section":{"key":"value","other":"123"}}';
      const result = jsonToIni(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("[section]");
      expect(result.result).toContain("key=value");
      expect(result.result).toContain("other=123");
    });

    test("converts with global section", () => {
      const input = '{"":{"global":"yes"},"section":{"key":"value"}}';
      const result = jsonToIni(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("global=yes");
      expect(result.result).toContain("[section]");
      expect(result.result).toContain("key=value");
    });

    test("handles empty object", () => {
      const result = jsonToIni("{}");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("handles empty string", () => {
      const result = jsonToIni("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    test("returns error for non-object JSON", () => {
      const result = jsonToIni("[1,2,3]");
      expect(result.success).toBe(false);
      expect(result.error).toContain("object");
    });

    test("skips non-object section values", () => {
      const input = '{"sec":"invalid","valid":{"a":"1"}}';
      const result = jsonToIni(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("[valid]");
      expect(result.result).toContain("a=1");
    });

    test("converts numeric values to strings", () => {
      const input = '{"sec":{"num":42}}';
      const result = jsonToIni(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain("num=42");
    });
  });

  describe("convert", () => {
    test("ini-to-json direction", () => {
      const input = "[x]\na=1";
      const result = convert(input, "ini-to-json");

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result);
      expect(parsed.x).toEqual({ a: "1" });
    });

    test("json-to-ini direction", () => {
      const input = '{"x":{"a":"1"}}';
      const result = convert(input, "json-to-ini");

      expect(result.success).toBe(true);
      expect(result.result).toContain("[x]");
      expect(result.result).toContain("a=1");
    });
  });

  describe("round-trip", () => {
    test("INI to JSON to INI preserves structure", () => {
      const original = "[section]\nkey=value\nother=123";
      const toJson = iniToJson(original);
      expect(toJson.success).toBe(true);

      const backToIni = jsonToIni(toJson.result);
      expect(backToIni.success).toBe(true);
      expect(backToIni.result).toContain("[section]");
      expect(backToIni.result).toContain("key=value");
      expect(backToIni.result).toContain("other=123");
    });

    test("JSON to INI to JSON preserves data", () => {
      const original = '{"a":{"x":"1","y":"2"},"b":{"z":"3"}}';
      const toIni = jsonToIni(original);
      expect(toIni.success).toBe(true);

      const backToJson = iniToJson(toIni.result);
      expect(backToJson.success).toBe(true);
      const parsed = JSON.parse(backToJson.result);
      expect(parsed.a).toEqual({ x: "1", y: "2" });
      expect(parsed.b).toEqual({ z: "3" });
    });
  });
});
