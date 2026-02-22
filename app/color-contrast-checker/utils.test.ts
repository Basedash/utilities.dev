import { describe, test, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  relativeLuminance,
  contrastRatio,
  checkWcag,
  formatRatio,
  WCAG_RATIOS,
} from "./utils";

describe("color-contrast-checker utils", () => {
  describe("hexToRgb", () => {
    test("parses 6-digit hex with hash", () => {
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("parses 6-digit hex without hash", () => {
      expect(hexToRgb("000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    test("parses 3-digit shorthand hex", () => {
      expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#0f0")).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb("#00f")).toEqual({ r: 0, g: 0, b: 255 });
    });

    test("handles uppercase hex", () => {
      expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#3B82F6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("round-trips with rgbToHex", () => {
      const hex = "#3b82f6";
      const rgb = hexToRgb(hex)!;
      expect(rgbToHex(rgb)).toBe("#3b82f6");
    });

    test("returns null for invalid hex", () => {
      expect(hexToRgb("")).toBeNull();
      expect(hexToRgb("#")).toBeNull();
      expect(hexToRgb("#12")).toBeNull();
      expect(hexToRgb("#1234")).toBeNull();
      expect(hexToRgb("#12345")).toBeNull();
      expect(hexToRgb("#1234567")).toBeNull();
      expect(hexToRgb("#gg0000")).toBeNull();
      expect(hexToRgb("invalid")).toBeNull();
    });
  });

  describe("relativeLuminance", () => {
    test("black has luminance 0", () => {
      expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    });

    test("white has luminance 1", () => {
      expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1);
    });

    test("mid gray has ~0.5 luminance", () => {
      const l = relativeLuminance({ r: 128, g: 128, b: 128 });
      expect(l).toBeGreaterThan(0.2);
      expect(l).toBeLessThan(0.3);
    });

    test("green contributes most to luminance", () => {
      const lGreen = relativeLuminance({ r: 0, g: 255, b: 0 });
      const lRed = relativeLuminance({ r: 255, g: 0, b: 0 });
      const lBlue = relativeLuminance({ r: 0, g: 0, b: 255 });
      expect(lGreen).toBeGreaterThan(lRed);
      expect(lRed).toBeGreaterThan(lBlue);
    });

    test("is deterministic for same input", () => {
      const rgb = { r: 59, g: 130, b: 246 };
      expect(relativeLuminance(rgb)).toBe(relativeLuminance(rgb));
    });
  });

  describe("contrastRatio", () => {
    test("black on white is 21", () => {
      expect(contrastRatio(1, 0)).toBe(21);
      expect(contrastRatio(0, 1)).toBe(21);
    });

    test("white on white is 1", () => {
      expect(contrastRatio(1, 1)).toBe(1);
    });

    test("black on black is 1", () => {
      expect(contrastRatio(0, 0)).toBe(1);
    });

    test("order of arguments does not matter", () => {
      expect(contrastRatio(0.5, 0.1)).toBe(contrastRatio(0.1, 0.5));
    });

    test("known WCAG reference: #777 on #fff is ~4.5", () => {
      const l777 = relativeLuminance(hexToRgb("#777777")!);
      const lfff = relativeLuminance(hexToRgb("#ffffff")!);
      const ratio = contrastRatio(l777, lfff);
      expect(ratio).toBeGreaterThanOrEqual(4.4);
      expect(ratio).toBeLessThanOrEqual(4.6);
    });
  });

  describe("checkWcag", () => {
    test("black text on white background passes all levels", () => {
      const result = checkWcag(
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 }
      );
      expect(result.ratio).toBe(21);
      expect(result.aaNormal).toBe(true);
      expect(result.aaLarge).toBe(true);
      expect(result.aaaNormal).toBe(true);
      expect(result.aaaLarge).toBe(true);
    });

    test("white text on black background passes all levels", () => {
      const result = checkWcag(
        { r: 255, g: 255, b: 255 },
        { r: 0, g: 0, b: 0 }
      );
      expect(result.ratio).toBe(21);
      expect(result.aaNormal).toBe(true);
      expect(result.aaLarge).toBe(true);
      expect(result.aaaNormal).toBe(true);
      expect(result.aaaLarge).toBe(true);
    });

    test("low contrast fails all levels", () => {
      const result = checkWcag(
        { r: 200, g: 200, b: 200 },
        { r: 210, g: 210, b: 210 }
      );
      expect(result.ratio).toBeLessThan(2);
      expect(result.aaNormal).toBe(false);
      expect(result.aaLarge).toBe(false);
      expect(result.aaaNormal).toBe(false);
      expect(result.aaaLarge).toBe(false);
    });

    test("ratio ~4.5 passes AA normal and large, fails AAA normal", () => {
      const result = checkWcag(
        hexToRgb("#767676")!,
        hexToRgb("#ffffff")!
      );
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      expect(result.ratio).toBeLessThan(5);
      expect(result.aaNormal).toBe(true);
      expect(result.aaLarge).toBe(true);
      expect(result.aaaNormal).toBe(false);
      expect(result.aaaLarge).toBe(true);
    });

    test("ratio ~7 passes all levels", () => {
      const result = checkWcag(
        hexToRgb("#595959")!,
        hexToRgb("#ffffff")!
      );
      expect(result.ratio).toBeGreaterThanOrEqual(7);
      expect(result.aaaNormal).toBe(true);
      expect(result.aaaLarge).toBe(true);
    });
  });

  describe("formatRatio", () => {
    test("formats ratio with two decimals", () => {
      expect(formatRatio(4.5)).toBe("4.50:1");
      expect(formatRatio(21)).toBe("21.00:1");
      expect(formatRatio(4.523)).toBe("4.52:1");
    });
  });

  describe("WCAG_RATIOS", () => {
    test("constants match WCAG 2.1 spec", () => {
      expect(WCAG_RATIOS.aaNormal).toBe(4.5);
      expect(WCAG_RATIOS.aaLarge).toBe(3);
      expect(WCAG_RATIOS.aaaNormal).toBe(7);
      expect(WCAG_RATIOS.aaaLarge).toBe(4.5);
    });
  });
});
