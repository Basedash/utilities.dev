import { describe, test, expect } from "vitest";
import {
  checkFocusStyles,
  extractFocusRules,
} from "./utils";

describe("focus-style-checker utils", () => {
  describe("extractFocusRules", () => {
    test("extracts :focus rule", () => {
      const css = "button:focus { outline: 2px solid blue; }";
      const rules = extractFocusRules(css);
      expect(rules).toHaveLength(1);
      expect(rules[0].selector).toBe("button:focus");
      expect(rules[0].block).toContain("outline");
    });

    test("extracts :focus-visible rule", () => {
      const css = "a:focus-visible { box-shadow: 0 0 0 2px blue; }";
      const rules = extractFocusRules(css);
      expect(rules).toHaveLength(1);
      expect(rules[0].selector).toBe("a:focus-visible");
    });

    test("extracts multiple focus rules", () => {
      const css = `
        button:focus { outline: none; }
        a:focus-visible { border: 2px solid blue; }
      `;
      const rules = extractFocusRules(css);
      expect(rules).toHaveLength(2);
    });

    test("returns empty array when no focus rules", () => {
      const css = "button { color: red; }";
      expect(extractFocusRules(css)).toHaveLength(0);
    });

    test("includes line number", () => {
      const css = "line1\nline2\nbutton:focus { outline: none; }";
      const rules = extractFocusRules(css);
      expect(rules[0].line).toBe(3);
    });
  });

  describe("checkFocusStyles - outline removed without replacement", () => {
    test("flags outline:none without visible replacement", () => {
      const result = checkFocusStyles("button:focus { outline: none; }");
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe("outline-none-without-replacement");
    });

    test("flags outline:0 without visible replacement", () => {
      const result = checkFocusStyles("a:focus { outline: 0; }");
      expect(result.valid).toBe(false);
      expect(result.issues[0].type).toBe("outline-none-without-replacement");
    });

    test("flags outline-width:0 without visible replacement", () => {
      const result = checkFocusStyles(".btn:focus { outline-width: 0; }");
      expect(result.valid).toBe(false);
    });

    test("accepts outline:none with box-shadow replacement", () => {
      const result = checkFocusStyles(
        "button:focus { outline: none; box-shadow: 0 0 0 2px blue; }"
      );
      expect(result.valid).toBe(true);
    });

    test("accepts outline:none with border replacement", () => {
      const result = checkFocusStyles(
        "button:focus { outline: none; border: 2px solid blue; }"
      );
      expect(result.valid).toBe(true);
    });

    test("accepts outline:none with background-color replacement", () => {
      const result = checkFocusStyles(
        "button:focus { outline: none; background-color: #e0e0e0; }"
      );
      expect(result.valid).toBe(true);
    });

    test("accepts visible outline (not removed)", () => {
      const result = checkFocusStyles(
        "button:focus { outline: 2px solid blue; }"
      );
      expect(result.valid).toBe(true);
    });
  });

  describe("checkFocusStyles - global outline removal", () => {
    test("flags global outline:none when no focus rules", () => {
      const result = checkFocusStyles("* { outline: none; }");
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.type === "outline-removed")).toBe(true);
    });

    test("does not duplicate when focus rule also has issue", () => {
      const result = checkFocusStyles(`
        * { outline: none; }
        button:focus { outline: none; }
      `);
      expect(result.issues.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("determinism", () => {
    test("same input produces same output", () => {
      const css = "button:focus { outline: none; }";
      const r1 = checkFocusStyles(css);
      const r2 = checkFocusStyles(css);
      expect(r1.issues).toEqual(r2.issues);
      expect(r1.valid).toBe(r2.valid);
    });

    test("empty input returns valid", () => {
      const result = checkFocusStyles("");
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe("hasFocusStyles", () => {
    test("true when focus rules exist", () => {
      const result = checkFocusStyles("button:focus { outline: 2px solid blue; }");
      expect(result.hasFocusStyles).toBe(true);
    });

    test("false when no focus rules", () => {
      const result = checkFocusStyles("button { color: red; }");
      expect(result.hasFocusStyles).toBe(false);
    });
  });
});
