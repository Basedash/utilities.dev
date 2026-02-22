/**
 * Palette generator utilities.
 * Deterministic generation of shades and tints from a base color using HSL.
 */

export interface PaletteSwatch {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface GeneratedPalette {
  swatches: PaletteSwatch[];
  baseHex: string;
}

export interface CssOutput {
  variables: string;
  hexMap: string;
}

/** Default scale: 50 (lightest) through 950 (darkest), 500 = base. Matches common design system scales. */
const DEFAULT_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Parses a HEX color string to RGB. Returns null for invalid input.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB to HSL. All values use 0–255 (RGB) or 0–360/0–100 (HSL).
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB.
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts RGB to HEX.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Maps a scale value (50–950) to a lightness percentage.
 * 500 = base lightness. 50 = very light, 950 = very dark.
 * Deterministic: same scale value always maps to same lightness.
 */
function scaleToLightness(scaleValue: number, baseLightness: number): number {
  const t = (scaleValue - 500) / 500; // -0.9 to 0.9
  if (t === 0) return baseLightness;
  if (t > 0) {
    // Darker: interpolate from base toward minL
    const minL = 5;
    return baseLightness + t * (minL - baseLightness);
  }
  // Lighter (t < 0): interpolate from base toward maxL; -t is positive
  const maxL = 98;
  return baseLightness - t * (maxL - baseLightness);
}

/**
 * Generates a deterministic palette from a base HEX color.
 * Same input always produces the same output.
 */
export function generatePalette(
  baseHex: string,
  scale: readonly number[] = DEFAULT_SCALE
): GeneratedPalette | null {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return null;

  const baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const swatches: PaletteSwatch[] = [];

  for (const value of scale) {
    if (value === 500) {
      swatches.push({
        name: "500",
        hex: baseHex.startsWith("#") ? baseHex : `#${baseHex}`,
        rgb,
        hsl: baseHsl,
      });
      continue;
    }
    const l = scaleToLightness(value, baseHsl.l);
    const clampedL = Math.max(0, Math.min(100, l));
    const resultRgb = hslToRgb(baseHsl.h, baseHsl.s, clampedL);
    const hex = rgbToHex(resultRgb.r, resultRgb.g, resultRgb.b);

    swatches.push({
      name: String(value),
      hex,
      rgb: resultRgb,
      hsl: { h: baseHsl.h, s: baseHsl.s, l: clampedL },
    });
  }

  return {
    swatches,
    baseHex: baseHex.startsWith("#") ? baseHex : `#${baseHex}`,
  };
}

/**
 * Produces CSS variable declarations for the palette.
 */
export function toCssVariables(palette: GeneratedPalette, prefix = "color"): string {
  return palette.swatches
    .map((s) => `  --${prefix}-${s.name}: ${s.hex};`)
    .join("\n");
}

/**
 * Produces a CSS rgb() variable block for use with opacity (e.g. rgb(var(--color-500-rgb) / 0.5)).
 */
export function toCssRgbVariables(palette: GeneratedPalette, prefix = "color"): string {
  return palette.swatches
    .map(
      (s) =>
        `  --${prefix}-${s.name}-rgb: ${s.rgb.r} ${s.rgb.g} ${s.rgb.b};`
    )
    .join("\n");
}

/**
 * Produces a simple hex map (name: value) for documentation or config.
 */
export function toHexMap(palette: GeneratedPalette): string {
  return palette.swatches.map((s) => `${s.name}: ${s.hex}`).join("\n");
}

/**
 * Produces combined CSS output suitable for copy-paste into stylesheets.
 */
export function toCssOutput(
  palette: GeneratedPalette,
  options: { prefix?: string; includeRgb?: boolean } = {}
): CssOutput {
  const prefix = options.prefix ?? "color";
  const variables =
    `:root {\n${toCssVariables(palette, prefix)}` +
    (options.includeRgb ? `\n\n/* RGB for use with rgb(var(--${prefix}-500-rgb) / 0.5) */\n${toCssRgbVariables(palette, prefix)}` : "") +
    `\n}`;
  return {
    variables,
    hexMap: toHexMap(palette),
  };
}
