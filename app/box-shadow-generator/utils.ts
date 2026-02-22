export interface BoxShadowParams {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

/**
 * Parses a HEX color string to RGB values.
 * Returns null for invalid hex.
 */
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Converts hex color and opacity to rgba() string.
 * Uses #000000 with opacity 1 if hex is invalid.
 */
export const hexAndOpacityToRgba = (hex: string, opacity: number): string => {
  const rgb = hexToRgb(hex);
  const r = rgb?.r ?? 0;
  const g = rgb?.g ?? 0;
  const b = rgb?.b ?? 0;
  const a = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Builds a CSS box-shadow declaration string from parameters.
 * Deterministic: same inputs always produce the same output.
 */
export const buildBoxShadowCss = (params: BoxShadowParams): string => {
  const { offsetX, offsetY, blur, spread, color, opacity, inset } = params;
  const rgba = hexAndOpacityToRgba(color, opacity);
  const parts = [
    inset ? "inset" : null,
    `${offsetX}px`,
    `${offsetY}px`,
    `${blur}px`,
    `${spread}px`,
    rgba,
  ].filter(Boolean) as string[];
  return parts.join(" ");
};

/**
 * Builds a full CSS property string: "box-shadow: <value>"
 */
export const buildBoxShadowProperty = (params: BoxShadowParams): string => {
  const value = buildBoxShadowCss(params);
  return `box-shadow: ${value};`;
};

/**
 * Default box-shadow parameters for initial state.
 */
export const DEFAULT_BOX_SHADOW_PARAMS: BoxShadowParams = {
  offsetX: 10,
  offsetY: 10,
  blur: 20,
  spread: 0,
  color: "#3b82f6",
  opacity: 0.5,
  inset: false,
};
