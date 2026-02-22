"use client";

import { useState, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import { Copy, AlertCircle } from "lucide-react";
import manifest from "./manifest";
import { generatePalette, toCssOutput } from "./utils";

const DEFAULT_HEX = "#3b82f6";

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex.trim());
}

export default function PaletteGeneratorPage() {
  const [baseHex, setBaseHex] = useState(DEFAULT_HEX);
  const [cssPrefix, setCssPrefix] = useState("color");
  const [includeRgb, setIncludeRgb] = useState(true);

  const trimmedHex = baseHex.trim();
  const validHex = isValidHex(trimmedHex);
  const normalizedHex = validHex
    ? trimmedHex.startsWith("#")
      ? trimmedHex
      : `#${trimmedHex}`
    : null;

  const palette = useMemo(() => {
    if (!normalizedHex) return null;
    return generatePalette(normalizedHex);
  }, [normalizedHex]);

  const cssOutput = useMemo(() => {
    if (!palette) return null;
    return toCssOutput(palette, { prefix: cssPrefix, includeRgb });
  }, [palette, cssPrefix, includeRgb]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleHexChange = (value: string) => {
    setBaseHex(value);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {!validHex && trimmedHex.length >= 3 && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="text-sm text-red-800 dark:text-red-200">
                    Enter a valid six-digit HEX color (e.g. #3b82f6)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Base Color Input */}
          <Card>
            <CardHeader>
              <CardTitle>Base Color</CardTitle>
              <CardDescription>
                Enter a HEX color to generate shades and tints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-hex">HEX Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="base-hex"
                    type="text"
                    value={baseHex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#3b82f6"
                    className="font-mono flex-1"
                  />
                  <input
                    type="color"
                    value={normalizedHex ?? "#3b82f6"}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
                    title="Pick color"
                  />
                </div>
              </div>
              {palette && (
                <div className="flex items-center gap-3 pt-2">
                  <div
                    className="h-12 w-12 shrink-0 rounded-lg border-2 border-border"
                    style={{ backgroundColor: normalizedHex ?? undefined }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Base color (500) used for the palette scale
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Options */}
          <Card>
            <CardHeader>
              <CardTitle>Output Options</CardTitle>
              <CardDescription>
                Configure CSS variable prefix and format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="css-prefix">CSS Variable Prefix</Label>
                <Input
                  id="css-prefix"
                  value={cssPrefix}
                  onChange={(e) => setCssPrefix(e.target.value)}
                  placeholder="color"
                  className="font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-rgb">Include RGB variables for opacity</Label>
                <Switch
                  id="include-rgb"
                  checked={includeRgb}
                  onCheckedChange={setIncludeRgb}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Palette Swatches */}
        {palette && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Generated Palette</CardTitle>
              <CardDescription>
                Scale from 50 (lightest) to 950 (darkest). 500 is your base color.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {palette.swatches.map((swatch) => (
                  <div
                    key={swatch.name}
                    className="group relative flex flex-col items-center"
                  >
                    <div
                      className="h-14 w-14 rounded-lg border-2 border-border shadow-sm transition-transform group-hover:scale-105 md:h-16 md:w-16"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="mt-1 text-xs font-medium text-muted-foreground">
                      {swatch.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {swatch.hex}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CSS Output */}
        {cssOutput && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  CSS Variables
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(cssOutput.variables)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Copy into your stylesheet :root block
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono">
                  {cssOutput.variables}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Hex Map
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(cssOutput.hexMap)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Name-to-hex mapping for config or docs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono">
                  {cssOutput.hexMap}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
