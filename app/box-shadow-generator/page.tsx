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
import { Switch } from "@/components/ui/switch";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import { Copy } from "lucide-react";
import {
  buildBoxShadowCss,
  buildBoxShadowProperty,
  DEFAULT_BOX_SHADOW_PARAMS,
  type BoxShadowParams,
} from "./utils";
import manifest from "./manifest";

export default function BoxShadowGeneratorPage() {
  const [params, setParams] = useState<BoxShadowParams>(DEFAULT_BOX_SHADOW_PARAMS);

  const cssOutput = buildBoxShadowProperty(params);

  const updateParam = useCallback(
    <K extends keyof BoxShadowParams>(key: K, value: BoxShadowParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = cssOutput;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleNumberChange = (
    key: keyof Pick<BoxShadowParams, "offsetX" | "offsetY" | "blur" | "spread">,
    value: string
  ) => {
    const num = parseInt(value, 10);
    if (!Number.isNaN(num)) {
      updateParam(key, num);
    }
  };

  const handleOpacityChange = (value: string) => {
    const num = parseFloat(value);
    if (!Number.isNaN(num)) {
      updateParam("opacity", Math.max(0, Math.min(1, num)));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {/* Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              The shadow updates in real time as you adjust the controls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div
                className="w-48 h-32 rounded-lg border border-border bg-card flex items-center justify-center"
                style={{ boxShadow: buildBoxShadowCss(params) }}
              >
                <span className="text-sm text-muted-foreground">Sample</span>
              </div>
              <div className="flex-1 w-full space-y-2">
                <Label htmlFor="css-output">CSS Output</Label>
                <div className="flex gap-2">
                  <Input
                    id="css-output"
                    readOnly
                    value={cssOutput}
                    className="font-mono text-sm bg-muted"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>
              Adjust offset, blur, spread, color, opacity, and inset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="offset-x">Offset X (px)</Label>
                <Input
                  id="offset-x"
                  type="number"
                  value={params.offsetX}
                  onChange={(e) => handleNumberChange("offsetX", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offset-y">Offset Y (px)</Label>
                <Input
                  id="offset-y"
                  type="number"
                  value={params.offsetY}
                  onChange={(e) => handleNumberChange("offsetY", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blur">Blur (px)</Label>
                <Input
                  id="blur"
                  type="number"
                  value={params.blur}
                  min={0}
                  onChange={(e) => handleNumberChange("blur", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spread">Spread (px)</Label>
                <Input
                  id="spread"
                  type="number"
                  value={params.spread}
                  onChange={(e) => handleNumberChange("spread", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={params.color}
                    onChange={(e) => updateParam("color", e.target.value)}
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                  <Input
                    value={params.color}
                    onChange={(e) => updateParam("color", e.target.value)}
                    className="font-mono flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opacity">Opacity (0–1)</Label>
                <Input
                  id="opacity"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={params.opacity}
                  onChange={(e) => handleOpacityChange(e.target.value)}
                />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inset">Inset</Label>
                  <Switch
                    id="inset"
                    checked={params.inset}
                    onCheckedChange={(checked) => updateParam("inset", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
