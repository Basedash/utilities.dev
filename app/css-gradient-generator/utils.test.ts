import { describe, test, expect } from "vitest";
import {
  normalizeHexColor,
  isValidCssColor,
  formatColorStop,
  buildGradientStops,
  angleToDirection,
  buildLinearGradientCss,
  buildRadialGradientCss,
  createDefaultStops,
  type ColorStop,
} from "./utils";

describe("normalizeHexColor", () => {
  test("normalizes 6-digit hex with hash", () => {
    expect(normalizeHexColor("#3b82f6")).toBe("#3b82f6");
    expect(normalizeHexColor("#FF0000")).toBe("#ff0000");
    expect(normalizeHexColor("#000000")).toBe("#000000");
    expect(normalizeHexColor("#ffffff")).toBe("#ffffff");
  });

  test("normalizes 6-digit hex without hash", () => {
    expect(normalizeHexColor("3b82f6")).toBe("#3b82f6");
    expect(normalizeHexColor("ff0000")).toBe("#ff0000");
  });

  test("expands 3-digit shorthand", () => {
    expect(normalizeHexColor("#fff")).toBe("#ffffff");
    expect(normalizeHexColor("#f00")).toBe("#ff0000");
    expect(normalizeHexColor("#000")).toBe("#000000");
    expect(normalizeHexColor("abc")).toBe("#aabbcc");
  });

  test("returns null for invalid hex", () => {
    expect(normalizeHexColor("")).toBeNull();
    expect(normalizeHexColor("invalid")).toBeNull();
    expect(normalizeHexColor("#gg0000")).toBeNull();
    expect(normalizeHexColor("#12345")).toBeNull();
    expect(normalizeHexColor("#1234567")).toBeNull();
  });
});

describe("isValidCssColor", () => {
  test("accepts valid hex colors", () => {
    expect(isValidCssColor("#3b82f6")).toBe(true);
    expect(isValidCssColor("#fff")).toBe(true);
    expect(isValidCssColor("3b82f6")).toBe(true);
  });

  test("accepts valid rgb colors", () => {
    expect(isValidCssColor("rgb(255, 0, 0)")).toBe(true);
    expect(isValidCssColor("rgb(59, 130, 246)")).toBe(true);
  });

  test("accepts valid rgba colors", () => {
    expect(isValidCssColor("rgba(255, 0, 0, 0.5)")).toBe(true);
    expect(isValidCssColor("rgba(59, 130, 246, 1)")).toBe(true);
  });

  test("accepts valid hsl colors", () => {
    expect(isValidCssColor("hsl(217, 91%, 60%)")).toBe(true);
    expect(isValidCssColor("hsl(0, 0%, 50%)")).toBe(true);
  });

  test("accepts valid hsla colors", () => {
    expect(isValidCssColor("hsla(217, 91%, 60%, 0.8)")).toBe(true);
  });

  test("rejects invalid colors", () => {
    expect(isValidCssColor("")).toBe(false);
    expect(isValidCssColor("   ")).toBe(false);
    expect(isValidCssColor("notacolor")).toBe(false);
  });
});

describe("formatColorStop", () => {
  test("formats color with position", () => {
    expect(formatColorStop("#3b82f6", 0)).toBe("#3b82f6 0%");
    expect(formatColorStop("#ff0000", 50)).toBe("#ff0000 50%");
    expect(formatColorStop("rgb(0,0,0)", 100)).toBe("rgb(0,0,0) 100%");
  });

  test("formats color without position", () => {
    expect(formatColorStop("#3b82f6", null)).toBe("#3b82f6");
    expect(formatColorStop("#fff", undefined as unknown as null)).toBe("#fff");
  });

  test("clamps position to 0-100", () => {
    expect(formatColorStop("#000", -10)).toBe("#000 0%");
    expect(formatColorStop("#000", 150)).toBe("#000 100%");
  });
});

describe("buildGradientStops", () => {
  test("builds stops from valid color stops", () => {
    const stops: ColorStop[] = [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 50 },
      { color: "#ec4899", position: 100 },
    ];
    expect(buildGradientStops(stops)).toBe(
      "#3b82f6 0%, #8b5cf6 50%, #ec4899 100%"
    );
  });

  test("filters invalid colors", () => {
    const stops: ColorStop[] = [
      { color: "#3b82f6", position: 0 },
      { color: "invalid", position: 50 },
      { color: "#ec4899", position: 100 },
    ];
    expect(buildGradientStops(stops)).toBe("#3b82f6 0%, #ec4899 100%");
  });

  test("handles empty stops", () => {
    expect(buildGradientStops([])).toBe("");
  });

  test("handles all invalid stops", () => {
    expect(buildGradientStops([{ color: "x", position: 0 }])).toBe("");
  });
});

describe("angleToDirection", () => {
  test("maps standard angles to keywords", () => {
    expect(angleToDirection(0)).toBe("to top");
    expect(angleToDirection(45)).toBe("to top right");
    expect(angleToDirection(90)).toBe("to right");
    expect(angleToDirection(135)).toBe("to bottom right");
    expect(angleToDirection(180)).toBe("to bottom");
    expect(angleToDirection(225)).toBe("to bottom left");
    expect(angleToDirection(270)).toBe("to left");
    expect(angleToDirection(315)).toBe("to top left");
  });

  test("normalizes negative and overflow angles", () => {
    expect(angleToDirection(-90)).toBe("to left");
    expect(angleToDirection(360)).toBe("to top");
    expect(angleToDirection(450)).toBe("to right");
  });

  test("uses deg for non-standard angles", () => {
    expect(angleToDirection(30)).toBe("30deg");
    expect(angleToDirection(60)).toBe("60deg");
    expect(angleToDirection(75)).toBe("75deg");
  });
});

describe("buildLinearGradientCss", () => {
  test("builds linear gradient with angle", () => {
    const stops: ColorStop[] = [
      { color: "#3b82f6", position: 0 },
      { color: "#ec4899", position: 100 },
    ];
    expect(buildLinearGradientCss(90, stops)).toBe(
      "linear-gradient(to right, #3b82f6 0%, #ec4899 100%)"
    );
  });

  test("builds linear gradient with direction keyword", () => {
    const stops: ColorStop[] = [
      { color: "#000", position: 0 },
      { color: "#fff", position: 100 },
    ];
    expect(buildLinearGradientCss("to bottom right", stops)).toBe(
      "linear-gradient(to bottom right, #000 0%, #fff 100%)"
    );
  });

  test("returns fallback for empty stops", () => {
    expect(buildLinearGradientCss(90, [])).toBe(
      "linear-gradient(to bottom, #000000, #ffffff)"
    );
  });

  test("builds gradient with single stop", () => {
    const stops: ColorStop[] = [{ color: "#3b82f6", position: 50 }];
    expect(buildLinearGradientCss(180, stops)).toBe(
      "linear-gradient(to bottom, #3b82f6 50%)"
    );
  });
});

describe("buildRadialGradientCss", () => {
  test("builds radial gradient with circle at center", () => {
    const stops: ColorStop[] = [
      { color: "#3b82f6", position: 0 },
      { color: "#ec4899", position: 100 },
    ];
    expect(buildRadialGradientCss("circle", "center", stops)).toBe(
      "radial-gradient(circle at center, #3b82f6 0%, #ec4899 100%)"
    );
  });

  test("builds radial gradient with ellipse", () => {
    const stops: ColorStop[] = [
      { color: "#fff", position: 0 },
      { color: "#000", position: 100 },
    ];
    expect(buildRadialGradientCss("ellipse", "50% 50%", stops)).toBe(
      "radial-gradient(ellipse at 50% 50%, #fff 0%, #000 100%)"
    );
  });

  test("returns fallback for empty stops", () => {
    expect(buildRadialGradientCss("circle", "center", [])).toBe(
      "radial-gradient(circle at center, #000000, #ffffff)"
    );
  });

  test("handles position keywords", () => {
    const stops: ColorStop[] = [
      { color: "#f00", position: 0 },
      { color: "#0f0", position: 100 },
    ];
    expect(buildRadialGradientCss("circle", "top left", stops)).toBe(
      "radial-gradient(circle at top left, #f00 0%, #0f0 100%)"
    );
  });
});

describe("createDefaultStops", () => {
  test("returns exactly 3 stops", () => {
    const stops = createDefaultStops();
    expect(stops).toHaveLength(3);
  });

  test("returns valid color stops with positions 0, 50, 100", () => {
    const stops = createDefaultStops();
    expect(stops[0]).toEqual({ color: "#3b82f6", position: 0 });
    expect(stops[1]).toEqual({ color: "#8b5cf6", position: 50 });
    expect(stops[2]).toEqual({ color: "#ec4899", position: 100 });
  });

  test("default stops produce valid gradient", () => {
    const stops = createDefaultStops();
    const css = buildLinearGradientCss(90, stops);
    expect(css).toContain("linear-gradient");
    expect(css).toContain("#3b82f6");
    expect(css).toContain("#8b5cf6");
    expect(css).toContain("#ec4899");
  });
});
