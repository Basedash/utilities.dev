"use client";

import { useMemo, useState } from "react";
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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import { Check, X, AlertCircle } from "lucide-react";
import { hexToRgb, rgbToHex, checkWcag, formatRatio } from "./utils";
import manifest from "./manifest";

const DEFAULT_TEXT = "#000000";
const DEFAULT_BG = "#ffffff";

export default function ColorContrastCheckerPage() {
  const [textHex, setTextHex] = useState(DEFAULT_TEXT);
  const [bgHex, setBgHex] = useState(DEFAULT_BG);

  const textRgb = useMemo(() => hexToRgb(textHex), [textHex]);
  const bgRgb = useMemo(() => hexToRgb(bgHex), [bgHex]);

  const result = useMemo(() => {
    if (!textRgb || !bgRgb) return null;
    return checkWcag(textRgb, bgRgb);
  }, [textRgb, bgRgb]);

  const isValid = textRgb !== null && bgRgb !== null;

  const wcagRows = result
    ? [
        { label: "WCAG AA Normal (4.5:1)", pass: result.aaNormal },
        { label: "WCAG AA Large (3:1)", pass: result.aaLarge },
        { label: "WCAG AAA Normal (7:1)", pass: result.aaaNormal },
        { label: "WCAG AAA Large (4.5:1)", pass: result.aaaLarge },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {!isValid && (
          <Card className="mb-6 border-2 border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-800 dark:text-amber-200">
                  Enter valid HEX colors (e.g. #000000 or #fff)
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Enter text and background colors in HEX format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-color">Text color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={textRgb ? rgbToHex(textRgb) : textHex}
                    onChange={(e) => setTextHex(e.target.value)}
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                  <Input
                    value={textHex}
                    onChange={(e) => setTextHex(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgRgb ? rgbToHex(bgRgb) : bgHex}
                    onChange={(e) => setBgHex(e.target.value)}
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                  <Input
                    value={bgHex}
                    onChange={(e) => setBgHex(e.target.value)}
                    placeholder="#ffffff"
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Sample text on your chosen background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[120px] rounded-lg border-2 border-border p-6 flex flex-col justify-center"
                style={{ backgroundColor: isValid ? bgHex : "#e5e7eb" }}
              >
                <p
                  className="text-lg font-medium"
                  style={{ color: isValid ? textHex : "#6b7280" }}
                >
                  Sample text
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: isValid ? textHex : "#6b7280" }}
                >
                  Body text at normal size for contrast evaluation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>WCAG Contrast Results</CardTitle>
              <CardDescription>
                Pass/fail for normal and large text per WCAG 2.1
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold tabular-nums">
                  {formatRatio(result.ratio)}
                </span>
                <Badge variant="outline" className="font-mono">
                  Contrast ratio
                </Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {wcagRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {row.label}
                    </span>
                    {row.pass ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                        Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                        <X className="h-4 w-4" />
                        Fail
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
