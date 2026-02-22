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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import { Copy, Plus, Trash2 } from "lucide-react";
import {
  buildLinearGradientCss,
  buildRadialGradientCss,
  createDefaultStops,
  normalizeHexColor,
  type ColorStop,
  type GradientType,
} from "./utils";
import manifest from "./manifest";

export default function CssGradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  const [radialPosition, setRadialPosition] = useState("center");
  const [stops, setStops] = useState<ColorStop[]>(createDefaultStops);

  const cssOutput = gradientType === "linear"
    ? buildLinearGradientCss(angle, stops)
    : buildRadialGradientCss(radialShape, radialPosition, stops);

  const updateStop = useCallback((index: number, updates: Partial<ColorStop>) => {
    setStops((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }, []);

  const addStop = useCallback(() => {
    setStops((prev) => {
      const last = prev[prev.length - 1];
      const newPos = last?.position !== null ? Math.min(100, (last.position ?? 0) + 10) : 50;
      return [...prev, { color: "#94a3b8", position: newPos }];
    });
  }, []);

  const removeStop = useCallback((index: number) => {
    setStops((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

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

  const positionOptions = [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top left",
    "top right",
    "bottom left",
    "bottom right",
    "50% 50%",
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Gradient Settings</CardTitle>
              <CardDescription>
                Configure gradient type, direction, and color stops
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={gradientType === "linear" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGradientType("linear")}
                  >
                    Linear
                  </Button>
                  <Button
                    variant={gradientType === "radial" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGradientType("radial")}
                  >
                    Radial
                  </Button>
                </div>
              </div>

              {/* Linear: Angle */}
              {gradientType === "linear" && (
                <div className="space-y-2">
                  <Label htmlFor="angle">Angle: {angle}°</Label>
                  <Input
                    id="angle"
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Radial: Shape & Position */}
              {gradientType === "radial" && (
                <>
                  <div className="space-y-2">
                    <Label>Shape</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={radialShape === "circle" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRadialShape("circle")}
                      >
                        Circle
                      </Button>
                      <Button
                        variant={radialShape === "ellipse" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRadialShape("ellipse")}
                      >
                        Ellipse
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="radial-position">Position</Label>
                    <select
                      id="radial-position"
                      value={radialPosition}
                      onChange={(e) => setRadialPosition(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {positionOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Color Stops */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Color Stops</Label>
                  <Button variant="outline" size="sm" onClick={addStop}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {stops.map((stop, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <input
                        type="color"
                        value={normalizeHexColor(stop.color) ?? "#3b82f6"}
                        onChange={(e) => updateStop(i, { color: e.target.value })}
                        className="h-9 w-10 cursor-pointer rounded border bg-transparent p-0"
                      />
                      <Input
                        value={stop.color}
                        onChange={(e) => updateStop(i, { color: e.target.value })}
                        placeholder="#3b82f6"
                        className="flex-1 font-mono text-sm"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={stop.position ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          updateStop(i, {
                            position: v === "" ? null : Math.max(0, Math.min(100, Number(v))),
                          });
                        }}
                        placeholder="%"
                        className="w-16 font-mono text-sm"
                      />
                      <span className="text-muted-foreground text-sm">%</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStop(i)}
                        disabled={stops.length <= 2}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview & Output */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Live preview of your gradient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-48 w-full rounded-lg border-2 border-border"
                  style={{ background: cssOutput }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  CSS Output
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(`background: ${cssOutput};`)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Copy the gradient declaration for your stylesheet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm">
                  <code>background: {cssOutput};</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
