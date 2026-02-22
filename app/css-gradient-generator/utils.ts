/**
 * CSS Gradient Generator - deterministic utilities for building gradient CSS strings.
 */

export interface ColorStop {
  color: string;
  position: number | null;
}

export type GradientType = "linear" | "radial";

export type LinearDirection =
  | "to top"
  | "to top right"
  | "to right"
  | "to bottom right"
  | "to bottom"
  | "to bottom left"
  | "to left"
  | "to top left";

/** Maps angle (0-360) to CSS direction keyword for common values. */
const ANGLE_TO_DIRECTION: Record<number, LinearDirection> = {
  0: "to top",
  45: "to top right",
  90: "to right",
  135: "to bottom right",
  180: "to bottom",
  225: "to bottom left",
  270: "to left",
  315: "to top left",
};

/**
 * Normalizes a hex color to #RRGGBB format.
 * Returns null if invalid.
 */
export function normalizeHexColor(hex: string): string | null {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const match = /^#([a-f\d]{3}|[a-f\d]{6})$/i.exec(withHash);
  if (!match) return null;
  const value = match[1];
  if (value.length === 3) {
    return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`.toLowerCase();
  }
  return `#${value}`.toLowerCase();
}

/**
 * Validates that a string is a valid CSS color (hex, rgb, hsl, or named).
 * For deterministic output we prefer hex; this validates common formats.
 */
export function isValidCssColor(color: string): boolean {
  const trimmed = color.trim();
  if (!trimmed) return false;
  if (normalizeHexColor(trimmed)) return true;
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(trimmed)) return true;
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(trimmed)) return true;
  if (/^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/i.test(trimmed)) return true;
  if (/^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*[\d.]+\s*\)$/i.test(trimmed)) return true;
  return false;
}

/**
 * Formats a color stop for CSS output.
 * Position is clamped to 0-100 and formatted as percentage.
 */
export function formatColorStop(color: string, position: number | null): string {
  if (position === null || position === undefined) {
    return color.trim();
  }
  const clamped = Math.max(0, Math.min(100, position));
  return `${color.trim()} ${clamped}%`;
}

/**
 * Builds the stops portion of a gradient (color1 pos1%, color2 pos2%, ...).
 */
export function buildGradientStops(stops: ColorStop[]): string {
  return stops
    .filter((s) => isValidCssColor(s.color))
    .map((s) => formatColorStop(s.color, s.position))
    .join(", ");
}

/**
 * Converts angle (0-360) to CSS linear-gradient direction.
 * Uses keyword when angle exactly matches a standard direction, otherwise uses deg.
 */
export function angleToDirection(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  const standardAngles = [0, 45, 90, 135, 180, 225, 270, 315] as const;
  const match = standardAngles.find((a) => Math.abs(a - normalized) < 0.5);
  return match !== undefined ? ANGLE_TO_DIRECTION[match] : `${Math.round(normalized)}deg`;
}

/**
 * Builds a linear-gradient CSS string.
 */
export function buildLinearGradientCss(
  angleOrDirection: number | string,
  stops: ColorStop[]
): string {
  const stopsStr = buildGradientStops(stops);
  if (!stopsStr) return "linear-gradient(to bottom, #000000, #ffffff)";

  const direction =
    typeof angleOrDirection === "number"
      ? angleToDirection(angleOrDirection)
      : angleOrDirection.trim();

  return `linear-gradient(${direction}, ${stopsStr})`;
}

/**
 * Builds a radial-gradient CSS string.
 * shape: "circle" | "ellipse"
 * position: "center" | "top" | "bottom" | "left" | "right" | custom like "50% 50%"
 */
export function buildRadialGradientCss(
  shape: "circle" | "ellipse",
  position: string,
  stops: ColorStop[]
): string {
  const stopsStr = buildGradientStops(stops);
  if (!stopsStr) return "radial-gradient(circle at center, #000000, #ffffff)";

  const positionPart = position.trim() || "center";
  const shapePart = shape === "ellipse" ? "ellipse" : "circle";

  return `radial-gradient(${shapePart} at ${positionPart}, ${stopsStr})`;
}

/**
 * Creates default color stops for a new gradient.
 */
export function createDefaultStops(): ColorStop[] {
  return [
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 50 },
    { color: "#ec4899", position: 100 },
  ];
}
