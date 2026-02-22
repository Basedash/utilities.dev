"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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
import { Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import manifest from "./manifest";
import { checkTextSpacing } from "./utils";

const DEFAULT_CSS = `font-size: 16px;
line-height: 1.5;
letter-spacing: 0.12em;
word-spacing: 0.16em;
margin-bottom: 2em;`;

export default function TextSpacingCheckerPage() {
  const [css, setCss] = useState(DEFAULT_CSS);

  const result = useMemo(() => checkTextSpacing(css), [css]);

  const handleClear = () => setCss("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                CSS Input
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 min-w-9 shrink-0 touch-manipulation"
                  aria-label="Clear CSS"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Enter or paste CSS declarations (font-size, line-height, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="css-input">CSS</Label>
                <Textarea
                  id="css-input"
                  placeholder="font-size: 16px;&#10;line-height: 1.5;&#10;..."
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WCAG 1.4.12 Results</CardTitle>
              <CardDescription>
                Pass/fail against text spacing minimums
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {result && (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold tabular-nums">
                      {result.fontSizePx}px
                    </span>
                    <Badge variant="outline">Font size</Badge>
                  </div>
                  <div
                    className={
                      result.allPass
                        ? "rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40 p-3"
                        : "rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40 p-3"
                    }
                  >
                    <span
                      className={`flex items-center gap-2 font-medium ${
                        result.allPass
                          ? "text-emerald-800 dark:text-emerald-200"
                          : "text-amber-800 dark:text-amber-200"
                      }`}
                    >
                      {result.allPass ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      {result.allPass ? "All checks pass" : "Some checks need attention"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.checks.map((check) => (
                      <div
                        key={check.property}
                        className="rounded-lg border border-border px-4 py-3 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{check.property}</span>
                          {check.pass ? (
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
                        <div className="text-sm text-muted-foreground">
                          <code className="bg-muted px-1.5 py-0.5 rounded">
                            {check.value}
                          </code>
                          {check.computedPx !== null && (
                            <span className="ml-2">
                              ({check.computedPx.toFixed(2)}px)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {check.guidance}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
