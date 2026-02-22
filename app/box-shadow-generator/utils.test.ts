import { describe, test, expect } from "vitest";
import {
  hexToRgb,
  hexAndOpacityToRgba,
  buildBoxShadowCss,
  buildBoxShadowProperty,
  DEFAULT_BOX_SHADOW_PARAMS,
  type BoxShadowParams,
} from "./utils";

describe("Box Shadow Utils", () => {
  describe("hexToRgb", () => {
    test("parses valid hex colors with hash", () => {
      expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
      expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    });

    test("parses valid hex colors without hash", () => {
      expect(hexToRgb("3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    test("handles uppercase hex", () => {
      expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    test("returns null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#gg0000")).toBeNull();
      expect(hexToRgb("#12345")).toBeNull();
      expect(hexToRgb("")).toBeNull();
    });
  });

  describe("hexAndOpacityToRgba", () => {
    test("converts hex and opacity to rgba string", () => {
      expect(hexAndOpacityToRgba("#3b82f6", 0.5)).toBe(
        "rgba(59, 130, 246, 0.5)"
      );
      expect(hexAndOpacityToRgba("#ff0000", 1)).toBe("rgba(255, 0, 0, 1)");
      expect(hexAndOpacityToRgba("#000000", 0)).toBe("rgba(0, 0, 0, 0)");
    });

    test("clamps opacity to 0-1 range", () => {
      expect(hexAndOpacityToRgba("#ffffff", 1.5)).toBe("rgba(255, 255, 255, 1)");
      expect(hexAndOpacityToRgba("#ffffff", -0.1)).toBe(
        "rgba(255, 255, 255, 0)"
      );
    });

    test("uses black for invalid hex", () => {
      expect(hexAndOpacityToRgba("invalid", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
    });
  });

  describe("buildBoxShadowCss", () => {
    test("builds standard box-shadow value", () => {
      const params: BoxShadowParams = {
        offsetX: 10,
        offsetY: 10,
        blur: 20,
        spread: 0,
        color: "#3b82f6",
        opacity: 0.5,
        inset: false,
      };
      expect(buildBoxShadowCss(params)).toBe(
        "10px 10px 20px 0px rgba(59, 130, 246, 0.5)"
      );
    });

    test("includes inset when true", () => {
      const params: BoxShadowParams = {
        offsetX: 5,
        offsetY: 5,
        blur: 10,
        spread: 2,
        color: "#000000",
        opacity: 0.3,
        inset: true,
      };
      expect(buildBoxShadowCss(params)).toBe(
        "inset 5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
      );
    });

    test("handles zero and negative values", () => {
      const params: BoxShadowParams = {
        offsetX: 0,
        offsetY: 0,
        blur: 0,
        spread: 0,
        color: "#ff0000",
        opacity: 1,
        inset: false,
      };
      expect(buildBoxShadowCss(params)).toBe(
        "0px 0px 0px 0px rgba(255, 0, 0, 1)"
      );
    });

    test("handles negative offsets", () => {
      const params: BoxShadowParams = {
        offsetX: -10,
        offsetY: -5,
        blur: 15,
        spread: -2,
        color: "#333333",
        opacity: 0.8,
        inset: false,
      };
      expect(buildBoxShadowCss(params)).toBe(
        "-10px -5px 15px -2px rgba(51, 51, 51, 0.8)"
      );
    });

    test("is deterministic for same inputs", () => {
      const params = DEFAULT_BOX_SHADOW_PARAMS;
      const result1 = buildBoxShadowCss(params);
      const result2 = buildBoxShadowCss(params);
      expect(result1).toBe(result2);
    });
  });

  describe("buildBoxShadowProperty", () => {
    test("wraps value in box-shadow property", () => {
      const params: BoxShadowParams = {
        offsetX: 10,
        offsetY: 10,
        blur: 20,
        spread: 0,
        color: "#3b82f6",
        opacity: 0.5,
        inset: false,
      };
      expect(buildBoxShadowProperty(params)).toBe(
        "box-shadow: 10px 10px 20px 0px rgba(59, 130, 246, 0.5);"
      );
    });
  });

  describe("DEFAULT_BOX_SHADOW_PARAMS", () => {
    test("has expected default values", () => {
      expect(DEFAULT_BOX_SHADOW_PARAMS).toEqual({
        offsetX: 10,
        offsetY: 10,
        blur: 20,
        spread: 0,
        color: "#3b82f6",
        opacity: 0.5,
        inset: false,
      });
    });

    test("produces valid CSS when used with buildBoxShadowCss", () => {
      const css = buildBoxShadowCss(DEFAULT_BOX_SHADOW_PARAMS);
      expect(css).toMatch(/^\d+px \d+px \d+px -?\d+px rgba\(\d+, \d+, \d+, [\d.]+\)$/);
    });
  });
});
