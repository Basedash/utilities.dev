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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { checkFormLabels } from "./utils";
import manifest from "./manifest";

const PLACEHOLDER = `<form>
  <label for="email">Email</label>
  <input type="text" id="email" name="email">
  <input type="text" id="name" placeholder="Name">
  <button type="submit">Submit</button>
</form>`;

export default function FormLabelCheckerPage() {
  const [html, setHtml] = useState("");

  const result = useMemo(() => checkFormLabels(html), [html]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>HTML Input</CardTitle>
              <CardDescription>
                Paste HTML containing form controls to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="html-input" className="sr-only">
                HTML snippet
              </Label>
              <Textarea
                id="html-input"
                placeholder={PLACEHOLDER}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="min-h-[280px] resize-y font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Findings</CardTitle>
              <CardDescription>
                Accessibility issues found in the pasted HTML
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!html.trim() ? (
                <p className="text-sm text-muted-foreground">
                  Paste HTML above to see findings.
                </p>
              ) : result.findings.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="font-medium">No issues found</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {result.summary.total} total
                    </Badge>
                    {result.summary.errors > 0 && (
                      <Badge variant="destructive">
                        {result.summary.errors} error
                        {result.summary.errors !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    {result.summary.warnings > 0 && (
                      <Badge variant="secondary">
                        {result.summary.warnings} warning
                        {result.summary.warnings !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {result.findings.map((finding, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-lg border border-border px-3 py-2"
                      >
                        <AlertCircle
                          className={`h-5 w-5 shrink-0 ${
                            finding.severity === "error"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{finding.message}</p>
                          {finding.selector && (
                            <code className="mt-1 block text-xs text-muted-foreground">
                              {finding.selector}
                            </code>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
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
