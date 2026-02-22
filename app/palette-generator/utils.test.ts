import { describe, test, expect } from "vitest";
import {
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  generatePalette,
  toCssVariables,
  toCssRgbVariables,
  toHexMap,
  toCssOutput,
} from "./utils";

describe("Palette Generator Utils", () => {
  describe("hexToRgb", () => {
    test("parses valid hex with hash", () => {
      expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    test("parses valid hex without hash", () => {
      expect(hexToRgb("3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("trims whitespace", () => {
      expect(hexToRgb("  #3b82f6  ")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("returns null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#gg0000")).toBeNull();
      expect(hexToRgb("#12345")).toBeNull();
      expect(hexToRgb("")).toBeNull();
    });
  });

  describe("rgbToHsl / hslToRgb", () => {
    test("round-trip preserves color within rounding", () => {
      const rgb = { r: 59, g: 130, b: 246 };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const back = hslToRgb(hsl.h, hsl.s, hsl.l);
      expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1);
    });

    test("primary colors convert correctly", () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    });
  });

  describe("rgbToHex", () => {
    test("converts RGB to hex", () => {
      expect(rgbToHex(59, 130, 246)).toBe("#3b82f6");
      expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    });

    test("clamps out-of-range values", () => {
      expect(rgbToHex(-1, 300, 128)).toBe("#00ff80");
    });
  });

  describe("generatePalette", () => {
    test("returns null for invalid hex", () => {
      expect(generatePalette("invalid")).toBeNull();
      expect(generatePalette("")).toBeNull();
    });

    test("generates deterministic output for same input", () => {
      const a = generatePalette("#3b82f6");
      const b = generatePalette("#3b82f6");
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      expect(a!.swatches).toHaveLength(b!.swatches.length);
      a!.swatches.forEach((s, i) => {
        expect(s.hex).toBe(b!.swatches[i].hex);
        expect(s.name).toBe(b!.swatches[i].name);
      });
    });

    test("base color at 500 matches input", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const swatch500 = palette!.swatches.find((s) => s.name === "500");
      expect(swatch500).toBeDefined();
      expect(swatch500!.hex.toLowerCase()).toBe("#3b82f6");
    });

    test("lighter shades (50–400) have higher lightness than base", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const baseL = palette!.swatches.find((s) => s.name === "500")!.hsl.l;
      for (const name of ["50", "100", "200", "300", "400"]) {
        const s = palette!.swatches.find((sw) => sw.name === name);
        expect(s!.hsl.l).toBeGreaterThanOrEqual(baseL);
      }
    });

    test("darker shades (600–950) have lower lightness than base", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const baseL = palette!.swatches.find((s) => s.name === "500")!.hsl.l;
      for (const name of ["600", "700", "800", "900", "950"]) {
        const s = palette!.swatches.find((sw) => sw.name === name);
        expect(s!.hsl.l).toBeLessThanOrEqual(baseL);
      }
    });

    test("uses custom scale when provided", () => {
      const palette = generatePalette("#ff0000", [100, 500, 900]);
      expect(palette).not.toBeNull();
      expect(palette!.swatches).toHaveLength(3);
      expect(palette!.swatches.map((s) => s.name)).toEqual(["100", "500", "900"]);
    });

    test("preserves hue and saturation across scale", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const baseH = palette!.swatches.find((s) => s.name === "500")!.hsl.h;
      const baseS = palette!.swatches.find((s) => s.name === "500")!.hsl.s;
      for (const swatch of palette!.swatches) {
        expect(swatch.hsl.h).toBe(baseH);
        expect(swatch.hsl.s).toBe(baseS);
      }
    });

    test("normalizes baseHex to include hash", () => {
      const palette = generatePalette("3b82f6");
      expect(palette).not.toBeNull();
      expect(palette!.baseHex).toBe("#3b82f6");
    });
  });

  describe("toCssVariables", () => {
    test("produces valid CSS variable declarations", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const css = toCssVariables(palette!, "primary");
      expect(css).toContain("--primary-500: #3b82f6");
      expect(css).toContain("--primary-50:");
      expect(css).toContain("--primary-950:");
    });

    test("uses custom prefix", () => {
      const palette = generatePalette("#ff0000", [500]);
      expect(palette).not.toBeNull();
      const css = toCssVariables(palette!, "brand");
      expect(css).toContain("--brand-500:");
    });
  });

  describe("toCssRgbVariables", () => {
    test("produces rgb variables for opacity support", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const css = toCssRgbVariables(palette!);
      expect(css).toContain("--color-500-rgb: 59 130 246");
    });
  });

  describe("toHexMap", () => {
    test("produces name: hex pairs", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const map = toHexMap(palette!);
      expect(map).toContain("500: #3b82f6");
      expect(map.split("\n").length).toBe(palette!.swatches.length);
    });
  });

  describe("toCssOutput", () => {
    test("produces :root block with variables", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const output = toCssOutput(palette!);
      expect(output.variables).toContain(":root {");
      expect(output.variables).toContain("}");
      expect(output.hexMap).toBe(toHexMap(palette!));
    });

    test("includes rgb variables when requested", () => {
      const palette = generatePalette("#3b82f6");
      expect(palette).not.toBeNull();
      const output = toCssOutput(palette!, { includeRgb: true });
      expect(output.variables).toContain("-rgb:");
    });
  });
});
