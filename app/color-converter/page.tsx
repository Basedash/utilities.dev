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
import {
  ColorValues,
  hexToRgb,
  convertFromRgb,
  hslToRgb,
  generateRandomRgb,
} from "./utils";

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

  const updateAllFormats = useCallback(
    (rgb: { r: number; g: number; b: number }) => {
      const newColor = convertFromRgb(rgb);
      setColor(newColor);
      setInputValues({
        hex: newColor.hex,
        rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
        hsl: `${newColor.hsl.h}, ${newColor.hsl.s}%, ${newColor.hsl.l}%`,
        hsv: `${newColor.hsv.h}, ${newColor.hsv.s}%, ${newColor.hsv.v}%`,
        cmyk: `${newColor.cmyk.c}%, ${newColor.cmyk.m}%, ${newColor.cmyk.y}%, ${newColor.cmyk.k}%`,
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
    const rgb = generateRandomRgb();
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
