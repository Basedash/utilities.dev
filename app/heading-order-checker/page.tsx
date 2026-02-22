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
import { Button } from "@/components/ui/button";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { analyzeHeadingOrder } from "./utils";

const PLACEHOLDER = `<h1>Page Title</h1>
<h2>Section One</h2>
<h3>Subsection</h3>
<h2>Section Two</h2>`;

export default function HeadingOrderCheckerPage() {
  const [html, setHtml] = useState("");

  const result = useMemo(() => analyzeHeadingOrder(html), [html]);

  const handleClear = () => setHtml("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                HTML Input
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label="Clear input"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Paste an HTML snippet to analyze heading structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="html-input">HTML</Label>
                <Textarea
                  id="html-input"
                  placeholder={PLACEHOLDER}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="min-h-[240px] resize-y font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Extracted headings and accessibility findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.headings.length > 0 ? (
                <>
                  <section aria-label="Heading outline">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Heading outline
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {result.headings.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 font-mono"
                        >
                          <span className="text-muted-foreground w-8">
                            h{h.level}
                          </span>
                          <span className="truncate">
                            {h.text || "(empty)"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {result.findings.length > 0 ? (
                    <section aria-label="Findings">
                      <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Findings
                      </h3>
                      <ul className="space-y-2">
                        {result.findings.map((f, i) => (
                          <li
                            key={i}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              f.severity === "error"
                                ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
                                : "border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40"
                            }`}
                          >
                            <span className="font-medium">{f.message}</span>
                            {f.detail && (
                              <p className="mt-1 text-muted-foreground">
                                {f.detail}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40 px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        No heading structure issues found
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Paste HTML to see heading analysis.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
