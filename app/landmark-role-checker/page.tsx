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
import { analyzeLandmarks } from "./utils";

const PLACEHOLDER = `<header><h1>Site</h1></header>
<nav><a href="/">Home</a></nav>
<main><p>Content</p></main>
<footer><p>© 2024</p></footer>`;

export default function LandmarkRoleCheckerPage() {
  const [html, setHtml] = useState("");

  const result = useMemo(() => analyzeLandmarks(html), [html]);

  const handleClear = () => setHtml("");

  const elements = result.landmarks.filter((l) => l.source === "element");
  const ariaLandmarks = result.landmarks.filter((l) => l.source === "aria");
  const hasIssues = result.landmarks.some(
    (l) => l.status === "missing" || l.status === "duplicate"
  );

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
                Paste HTML to analyze landmark structure
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
                Landmark presence and duplicate analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {html.trim() ? (
                <>
                  {hasIssues && (
                    <div
                      className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40 px-3 py-2"
                      aria-label="Issues found"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {result.summary.missing.length > 0 &&
                          `${result.summary.missing.length} missing`}
                        {result.summary.missing.length > 0 &&
                          result.summary.duplicates.length > 0 &&
                          ", "}
                        {result.summary.duplicates.length > 0 &&
                          `${result.summary.duplicates.length} duplicate(s)`}
                      </span>
                    </div>
                  )}

                  {!hasIssues && result.summary.present > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40 px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        No landmark issues found
                      </span>
                    </div>
                  )}

                  <section aria-label="Semantic elements">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Semantic elements
                    </h3>
                    <ul className="space-y-1.5">
                      {elements.map((l) => (
                        <li
                          key={l.type}
                          className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
                            l.status === "ok"
                              ? "border-border"
                              : l.status === "missing"
                                ? "border-muted"
                                : "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30"
                          }`}
                        >
                          <code className="font-mono">&lt;{l.type}&gt;</code>
                          <span
                            className={
                              l.status === "ok"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : l.status === "missing"
                                  ? "text-muted-foreground"
                                  : "text-amber-700 dark:text-amber-400"
                            }
                          >
                            {l.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section aria-label="ARIA landmark roles">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      ARIA landmark roles
                    </h3>
                    <ul className="space-y-1.5">
                      {ariaLandmarks.map((l) => (
                        <li
                          key={l.type}
                          className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
                            l.status === "ok"
                              ? "border-border"
                              : l.status === "missing"
                                ? "border-muted"
                                : "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30"
                          }`}
                        >
                          <code className="font-mono">role=&quot;{l.type}&quot;</code>
                          <span
                            className={
                              l.status === "ok"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : l.status === "missing"
                                  ? "text-muted-foreground"
                                  : "text-amber-700 dark:text-amber-400"
                            }
                          >
                            {l.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Paste HTML to see landmark analysis.
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
