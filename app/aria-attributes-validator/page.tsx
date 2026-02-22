"use client";

import { useState, useMemo } from "react";
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
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { validateAriaAttributes, type AriaValidationIssue } from "./utils";
import manifest from "./manifest";

const DEFAULT_HTML = `<button aria-label="Close">×</button>
<div role="button">Click me</div>
<input aria-describedby="hint" aria-labelledby="label" />
<div aria-foo="invalid">test</div>`;

function issueTypeIcon(type: AriaValidationIssue["type"]) {
  switch (type) {
    case "invalid-attribute":
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    case "malformed-id-ref":
      return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case "role-label-mismatch":
      return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    default:
      return null;
  }
}

function issueTypeBadge(type: AriaValidationIssue["type"]) {
  const labels: Record<AriaValidationIssue["type"], string> = {
    "invalid-attribute": "Invalid attribute",
    "malformed-id-ref": "Malformed ID ref",
    "role-label-mismatch": "Role/label mismatch",
  };
  return labels[type];
}

export default function AriaAttributesValidatorPage() {
  const [html, setHtml] = useState(DEFAULT_HTML);

  const result = useMemo(() => validateAriaAttributes(html), [html]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>HTML Input</CardTitle>
              <CardDescription>
                Paste HTML snippets to validate ARIA attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="html-input">HTML snippet</Label>
                <Textarea
                  id="html-input"
                  placeholder="<div aria-label='...'>...</div>"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="min-h-[280px] resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>
                Issues found in your HTML
              </CardDescription>
            </CardHeader>
            <CardContent>
              {html.trim() ? (
                result.valid ? (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/40">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      No ARIA issues found
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} found
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {result.issues.map((issue, idx) => (
                        <li
                          key={idx}
                          className="rounded-lg border border-border bg-muted/50 p-3"
                        >
                          <div className="flex items-start gap-2">
                            {issueTypeIcon(issue.type)}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {issueTypeBadge(issue.type)}
                                </Badge>
                                {issue.line != null && (
                                  <span className="text-xs text-muted-foreground">
                                    Line {issue.line}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-foreground">{issue.message}</p>
                              {issue.snippet && (
                                <code className="block truncate rounded bg-muted px-2 py-1 text-xs font-mono">
                                  {issue.snippet}
                                </code>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter HTML to validate ARIA attributes.
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
