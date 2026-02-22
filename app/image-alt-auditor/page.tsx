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
import { Badge } from "@/components/ui/badge";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { auditImageAlt } from "./utils";

const PLACEHOLDER = `<img src="hero.jpg" alt="Hero banner">
<img src="icon.png">
<img src="deco.gif" alt="">`;

export default function ImageAltAuditorPage() {
  const [html, setHtml] = useState("");

  const result = useMemo(() => auditImageAlt(html), [html]);

  const handleClear = () => setHtml("");

  const hasIssues =
    result.summary.missing > 0 ||
    result.summary.empty > 0 ||
    result.summary.suspicious > 0;

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
                Paste HTML containing img tags to audit alt text
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
                Image list and alt text summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.summary.total > 0 ? (
                <>
                  <section aria-label="Summary">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        Total: {result.summary.total}
                      </Badge>
                      <Badge
                        variant={result.summary.ok > 0 ? "default" : "outline"}
                        className={
                          result.summary.ok > 0
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : ""
                        }
                      >
                        OK: {result.summary.ok}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          result.summary.missing > 0
                            ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                            : ""
                        }
                      >
                        Missing: {result.summary.missing}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          result.summary.empty > 0
                            ? "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                            : ""
                        }
                      >
                        Empty: {result.summary.empty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          result.summary.suspicious > 0
                            ? "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                            : ""
                        }
                      >
                        Suspicious: {result.summary.suspicious}
                      </Badge>
                    </div>
                  </section>

                  {hasIssues && (
                    <section
                      className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40 px-3 py-2"
                      aria-label="Issues found"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {result.summary.missing +
                          result.summary.empty +
                          result.summary.suspicious}{" "}
                        image(s) need review
                      </span>
                    </section>
                  )}

                  {!hasIssues && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40 px-3 py-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        No alt text issues found
                      </span>
                    </div>
                  )}

                  <section aria-label="Image list">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Images
                    </h3>
                    <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                      {result.images.map((img) => (
                        <li
                          key={img.index}
                          className={`rounded border px-3 py-2 text-sm ${
                            img.status === "ok"
                              ? "border-border"
                              : img.status === "missing"
                                ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30"
                                : "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30"
                          }`}
                        >
                          <span className="font-mono text-muted-foreground">
                            #{img.index}
                          </span>{" "}
                          <span className="font-mono truncate block">
                            {img.src}
                          </span>
                          <span className="text-muted-foreground">
                            {img.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Paste HTML with img tags to see the audit.
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
