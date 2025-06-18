"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, AlertCircle, Shuffle } from "lucide-react";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorConverterPage() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 },
  });
  const [inputValues, setInputValues] = useState({
    hex: "#3b82f6",
    rgb: "59, 130, 246",
    hsl: "217, 91%, 60%",
    hsv: "217, 76%, 96%",
    cmyk: "76%, 47%, 0%, 4%",
  });
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Color conversion utilities
  const hexToRgb = (
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

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbToHsl = (
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
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
  };

  const hslToRgb = (
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } => {
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

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
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
  };

  const rgbToHsv = (
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
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
      v: Math.round(v * 100),
    };
  };

  const rgbToCmyk = (
    r: number,
    g: number,
    b: number
  ): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  const updateAllFormats = useCallback(
    (rgb: { r: number; g: number; b: number }) => {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      const newColor = { hex, rgb, hsl, hsv, cmyk };
      setColor(newColor);
      setInputValues({
        hex,
        rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
        hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`,
        hsv: `${hsv.h}, ${hsv.s}%, ${hsv.v}%`,
        cmyk: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`,
      });
      setIsValid(true);
      setErrorMessage("");
    },
    []
  );

  const handleHexChange = (value: string) => {
    setInputValues({ ...inputValues, hex: value });
    const rgb = hexToRgb(value);
    if (rgb) {
      updateAllFormats(rgb);
    } else if (value.length >= 3) {
      setIsValid(false);
      setErrorMessage("Invalid HEX color format");
    }
  };

  const handleRgbChange = (value: string) => {
    setInputValues({ ...inputValues, rgb: value });
    const match = value.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      if (r <= 255 && g <= 255 && b <= 255) {
        updateAllFormats({ r, g, b });
      } else {
        setIsValid(false);
        setErrorMessage("RGB values must be between 0-255");
      }
    } else if (value.length > 5) {
      setIsValid(false);
      setErrorMessage("Invalid RGB format (use: r, g, b)");
    }
  };

  const handleHslChange = (value: string) => {
    setInputValues({ ...inputValues, hsl: value });
    const match = value.match(/^\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*$/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      if (h <= 360 && s <= 100 && l <= 100) {
        const rgb = hslToRgb(h, s, l);
        updateAllFormats(rgb);
      } else {
        setIsValid(false);
        setErrorMessage("HSL values: H(0-360), S(0-100%), L(0-100%)");
      }
    } else if (value.length > 5) {
      setIsValid(false);
      setErrorMessage("Invalid HSL format (use: h, s%, l%)");
    }
  };

  const generateRandomColor = () => {
    const rgb = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    };
    updateAllFormats(rgb);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    const defaultColor = { r: 128, g: 128, b: 128 };
    updateAllFormats(defaultColor);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Color Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert colors between different formats with live preview
          </p>
        </div>

        {/* Status */}
        {!isValid && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Invalid Color Format
                  </span>
                  <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                    {errorMessage}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Color Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Color Preview
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomColor}
                  className="h-8 px-2"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div
                className="w-32 h-32 rounded-lg border-2 border-border shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Current Color</Badge>
                  <span className="font-mono text-lg font-medium">
                    {color.hex}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the inputs below to convert between different color
                  formats. The preview updates in real-time as you type.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Format Inputs */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* HEX */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HEX
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(color.hex)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Hexadecimal color notation (#RRGGBB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="hex-input">HEX Value</Label>
                <Input
                  id="hex-input"
                  value={inputValues.hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#3b82f6"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* RGB */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                RGB
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`rgb(${inputValues.rgb})`)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Red, Green, Blue (0-255 each)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="rgb-input">RGB Values</Label>
                <Input
                  id="rgb-input"
                  value={inputValues.rgb}
                  onChange={(e) => handleRgbChange(e.target.value)}
                  placeholder="59, 130, 246"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* HSL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HSL
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`hsl(${inputValues.hsl})`)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Hue, Saturation, Lightness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="hsl-input">HSL Values</Label>
                <Input
                  id="hsl-input"
                  value={inputValues.hsl}
                  onChange={(e) => handleHslChange(e.target.value)}
                  placeholder="217, 91%, 60%"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* HSV */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HSV
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`hsv(${inputValues.hsv})`)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Hue, Saturation, Value/Brightness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="hsv-input">HSV Values</Label>
                <Input
                  id="hsv-input"
                  value={inputValues.hsv}
                  readOnly
                  className="font-mono bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* CMYK */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                CMYK
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`cmyk(${inputValues.cmyk})`)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Cyan, Magenta, Yellow, Key (Black) - Used in printing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="cmyk-input">CMYK Values</Label>
                <Input
                  id="cmyk-input"
                  value={inputValues.cmyk}
                  readOnly
                  className="font-mono bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Color Formats</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Format Descriptions:
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <strong>HEX:</strong> Hexadecimal notation, widely used in
                    web development
                  </li>
                  <li>
                    <strong>RGB:</strong> Red, Green, Blue values (0-255),
                    common in digital displays
                  </li>
                  <li>
                    <strong>HSL:</strong> Hue, Saturation, Lightness - intuitive
                    for designers
                  </li>
                  <li>
                    <strong>HSV:</strong> Hue, Saturation, Value - similar to
                    HSL but different lightness calculation
                  </li>
                  <li>
                    <strong>CMYK:</strong> Cyan, Magenta, Yellow, Key (Black) -
                    used in printing
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Usage Tips:
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>• HEX is most common for CSS and web development</li>
                  <li>• RGB is perfect for programmatic color manipulation</li>
                  <li>
                    • HSL is great for creating color variations and themes
                  </li>
                  <li>
                    • Use the random button to discover new color combinations
                  </li>
                  <li>
                    • Click copy buttons to quickly use colors in your projects
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
