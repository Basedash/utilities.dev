import { describe, test, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  convertFromRgb,
  generateRandomRgb,
} from "./utils";

describe("Color Conversion Utils", () => {
  describe("hexToRgb", () => {
    test("converts valid hex colors with hash", () => {
      expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    test("converts valid hex colors without hash", () => {
      expect(hexToRgb("3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
      expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    test("handles uppercase hex colors", () => {
      expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("3B82F6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("returns null for invalid hex colors", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#gg0000")).toBeNull();
      expect(hexToRgb("#12345")).toBeNull(); // too short
      expect(hexToRgb("#1234567")).toBeNull(); // too long
      expect(hexToRgb("")).toBeNull();
    });
  });

  describe("rgbToHex", () => {
    test("converts RGB values to hex", () => {
      expect(rgbToHex(59, 130, 246)).toBe("#3b82f6");
      expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
      expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
      expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    });

    test("handles single digit hex values with padding", () => {
      expect(rgbToHex(1, 2, 3)).toBe("#010203");
      expect(rgbToHex(15, 16, 17)).toBe("#0f1011");
    });
  });

  describe("rgbToHsl", () => {
    test("converts RGB to HSL for primary colors", () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 }); // red
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 }); // green
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 }); // blue
    });

    test("converts RGB to HSL for grayscale colors", () => {
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 }); // black
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 }); // white
      expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 }); // gray
    });

    test("converts RGB to HSL for complex colors", () => {
      const result = rgbToHsl(59, 130, 246);
      expect(result.h).toBe(217);
      expect(result.s).toBe(91);
      expect(result.l).toBe(60);
    });
  });

  describe("hslToRgb", () => {
    test("converts HSL to RGB for primary colors", () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 }); // red
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 }); // green
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 }); // blue
    });

    test("converts HSL to RGB for grayscale colors", () => {
      expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 }); // black
      expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 }); // white
      expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 }); // gray
    });

    test("round trip conversion RGB->HSL->RGB should be consistent", () => {
      const originalRgb = { r: 59, g: 130, b: 246 };
      const hsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
      const backToRgb = hslToRgb(hsl.h, hsl.s, hsl.l);

      // Allow for small rounding differences
      expect(Math.abs(backToRgb.r - originalRgb.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(backToRgb.g - originalRgb.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(backToRgb.b - originalRgb.b)).toBeLessThanOrEqual(1);
    });
  });

  describe("rgbToHsv", () => {
    test("converts RGB to HSV for primary colors", () => {
      expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 }); // red
      expect(rgbToHsv(0, 255, 0)).toEqual({ h: 120, s: 100, v: 100 }); // green
      expect(rgbToHsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 }); // blue
    });

    test("converts RGB to HSV for grayscale colors", () => {
      expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 }); // black
      expect(rgbToHsv(255, 255, 255)).toEqual({ h: 0, s: 0, v: 100 }); // white
      expect(rgbToHsv(128, 128, 128)).toEqual({ h: 0, s: 0, v: 50 }); // gray
    });

    test("converts RGB to HSV for complex colors", () => {
      const result = rgbToHsv(59, 130, 246);
      expect(result.h).toBe(217);
      expect(result.s).toBe(76);
      expect(result.v).toBe(96);
    });
  });

  describe("rgbToCmyk", () => {
    test("converts RGB to CMYK for primary colors", () => {
      expect(rgbToCmyk(255, 0, 0)).toEqual({ c: 0, m: 100, y: 100, k: 0 }); // red
      expect(rgbToCmyk(0, 255, 0)).toEqual({ c: 100, m: 0, y: 100, k: 0 }); // green
      expect(rgbToCmyk(0, 0, 255)).toEqual({ c: 100, m: 100, y: 0, k: 0 }); // blue
    });

    test("converts RGB to CMYK for grayscale colors", () => {
      expect(rgbToCmyk(0, 0, 0)).toEqual({ c: 0, m: 0, y: 0, k: 100 }); // black
      expect(rgbToCmyk(255, 255, 255)).toEqual({ c: 0, m: 0, y: 0, k: 0 }); // white
    });

    test("converts RGB to CMYK for complex colors", () => {
      const result = rgbToCmyk(59, 130, 246);
      expect(result.c).toBe(76);
      expect(result.m).toBe(47);
      expect(result.y).toBe(0);
      expect(result.k).toBe(4);
    });
  });

  describe("convertFromRgb", () => {
    test("generates all color formats from RGB", () => {
      const rgb = { r: 59, g: 130, b: 246 };
      const result = convertFromRgb(rgb);

      expect(result.hex).toBe("#3b82f6");
      expect(result.rgb).toEqual(rgb);
      expect(result.hsl).toEqual({ h: 217, s: 91, l: 60 });
      expect(result.hsv).toEqual({ h: 217, s: 76, v: 96 });
      expect(result.cmyk).toEqual({ c: 76, m: 47, y: 0, k: 4 });
    });

    test("handles edge cases", () => {
      // Black
      const black = convertFromRgb({ r: 0, g: 0, b: 0 });
      expect(black.hex).toBe("#000000");
      expect(black.hsl).toEqual({ h: 0, s: 0, l: 0 });
      expect(black.hsv).toEqual({ h: 0, s: 0, v: 0 });
      expect(black.cmyk).toEqual({ c: 0, m: 0, y: 0, k: 100 });

      // White
      const white = convertFromRgb({ r: 255, g: 255, b: 255 });
      expect(white.hex).toBe("#ffffff");
      expect(white.hsl).toEqual({ h: 0, s: 0, l: 100 });
      expect(white.hsv).toEqual({ h: 0, s: 0, v: 100 });
      expect(white.cmyk).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    });
  });

  describe("generateRandomRgb", () => {
    test("generates valid RGB values", () => {
      for (let i = 0; i < 10; i++) {
        const rgb = generateRandomRgb();
        expect(rgb.r).toBeGreaterThanOrEqual(0);
        expect(rgb.r).toBeLessThanOrEqual(255);
        expect(rgb.g).toBeGreaterThanOrEqual(0);
        expect(rgb.g).toBeLessThanOrEqual(255);
        expect(rgb.b).toBeGreaterThanOrEqual(0);
        expect(rgb.b).toBeLessThanOrEqual(255);
        expect(Number.isInteger(rgb.r)).toBe(true);
        expect(Number.isInteger(rgb.g)).toBe(true);
        expect(Number.isInteger(rgb.b)).toBe(true);
      }
    });

    test("generates different colors on subsequent calls", () => {
      const colors = new Set();
      for (let i = 0; i < 50; i++) {
        const rgb = generateRandomRgb();
        colors.add(`${rgb.r},${rgb.g},${rgb.b}`);
      }
      // With 50 attempts, we should get at least some different colors
      // This is probabilistic, but very likely to pass
      expect(colors.size).toBeGreaterThan(10);
    });
  });

  describe("Edge cases and error handling", () => {
    test("handles boundary RGB values correctly", () => {
      // Test with boundary values
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff");

      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });

      expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
      expect(rgbToHsv(255, 255, 255)).toEqual({ h: 0, s: 0, v: 100 });

      expect(rgbToCmyk(0, 0, 0)).toEqual({ c: 0, m: 0, y: 0, k: 100 });
      expect(rgbToCmyk(255, 255, 255)).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    });

    test("handles mid-range values correctly", () => {
      const rgb = { r: 128, g: 128, b: 128 };
      const result = convertFromRgb(rgb);

      expect(result.hex).toBe("#808080");
      expect(result.hsl.s).toBe(0); // Should be grayscale
      expect(result.hsv.s).toBe(0); // Should be grayscale
    });
  });
});
