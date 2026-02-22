import { describe, test, expect } from "vitest";
import {
  parseLengthToPx,
  checkTextSpacing,
} from "./utils";

describe("text-spacing-checker utils", () => {
  describe("parseLengthToPx", () => {
    test("parses px values", () => {
      expect(parseLengthToPx("16px")).toBe(16);
      expect(parseLengthToPx("24px")).toBe(24);
      expect(parseLengthToPx("1.5px")).toBe(1.5);
    });

    test("parses em values relative to font size", () => {
      expect(parseLengthToPx("1em", 16)).toBe(16);
      expect(parseLengthToPx("1.5em", 16)).toBe(24);
      expect(parseLengthToPx("0.12em", 16)).toBeCloseTo(1.92);
    });

    test("parses rem values relative to 16px", () => {
      expect(parseLengthToPx("1rem")).toBe(16);
      expect(parseLengthToPx("1.5rem")).toBe(24);
    });

    test("parses unitless values", () => {
      expect(parseLengthToPx("1.5")).toBe(1.5);
      expect(parseLengthToPx("2")).toBe(2);
    });

    test("returns null for invalid input", () => {
      expect(parseLengthToPx("")).toBeNull();
      expect(parseLengthToPx("abc")).toBeNull();
      expect(parseLengthToPx("10%")).toBeNull();
    });
  });

  describe("checkTextSpacing", () => {
    test("passes for compliant CSS", () => {
      const css = `
        font-size: 16px;
        line-height: 1.5;
        letter-spacing: 0.12em;
        word-spacing: 0.16em;
        margin-bottom: 2em;
      `;
      const result = checkTextSpacing(css);
      expect(result.allPass).toBe(true);
      expect(result.fontSizePx).toBe(16);
    });

    test("fails when line-height is too low", () => {
      const css = `
        font-size: 16px;
        line-height: 1.2;
      `;
      const result = checkTextSpacing(css);
      const lineCheck = result.checks.find((c) => c.property === "line-height");
      expect(lineCheck?.pass).toBe(false);
    });

    test("passes for line-height 24px with 16px font", () => {
      const css = `
        font-size: 16px;
        line-height: 24px;
      `;
      const result = checkTextSpacing(css);
      const lineCheck = result.checks.find((c) => c.property === "line-height");
      expect(lineCheck?.pass).toBe(true);
    });

    test("uses default font size when not specified", () => {
      const css = "line-height: 1.5;";
      const result = checkTextSpacing(css);
      expect(result.fontSizePx).toBe(16);
    });

    test("is deterministic", () => {
      const css = "font-size: 16px; line-height: 1.5;";
      const a = checkTextSpacing(css);
      const b = checkTextSpacing(css);
      expect(a).toEqual(b);
    });
  });
});
