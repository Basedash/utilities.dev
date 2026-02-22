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
import { CheckCircle, AlertCircle, Link2, MapPin } from "lucide-react";
import { checkSkipLinks } from "./utils";
import manifest from "./manifest";

const DEFAULT_HTML = `<a href="#main" class="skip-link">Skip to main content</a>
<nav>...</nav>
<main id="main">
  <h1>Main content</h1>
</main>`;

export default function SkipLinkCheckerPage() {
  const [html, setHtml] = useState(DEFAULT_HTML);

  const result = useMemo(() => checkSkipLinks(html), [html]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>HTML Input</CardTitle>
              <CardDescription>
                Paste HTML to check skip links and targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="html-input">HTML</Label>
                <Textarea
                  id="html-input"
                  placeholder='<a href="#main">Skip</a>...'
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="min-h-[280px] resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check Results</CardTitle>
              <CardDescription>
                Skip links and target presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {html.trim() ? (
                <>
                  {result.valid ? (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/40">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        All skip links have matching targets
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="font-medium text-red-800 dark:text-red-200">
                          {result.orphanedSkipLinks.length} orphaned skip link
                          {result.orphanedSkipLinks.length !== 1 ? "s" : ""} (missing targets)
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {result.orphanedSkipLinks.map((link, idx) => (
                          <li
                            key={idx}
                            className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/40"
                          >
                            <div className="flex items-center gap-2">
                              <Link2 className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                              <span className="text-sm font-medium">
                                Target &quot;{link.targetId}&quot; not found
                              </span>
                            </div>
                            <code className="mt-1 block truncate rounded bg-muted px-2 py-1 text-xs font-mono">
                              {link.snippet}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.skipLinks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Skip links ({result.skipLinks.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {result.skipLinks.map((link, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm"
                          >
                            <code className="font-mono">{link.href}</code>
                            <Badge
                              variant={
                                result.missingTargets.includes(link.targetId)
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {result.missingTargets.includes(link.targetId)
                                ? "Missing target"
                                : "OK"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.targets.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Targets ({result.targets.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {result.targets.map((target, idx) => (
                          <li
                            key={idx}
                            className="rounded border border-border px-3 py-2 text-sm font-mono"
                          >
                            #{target.id} &lt;{target.tagName}&gt;
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.skipLinks.length === 0 && result.valid && (
                    <p className="text-sm text-muted-foreground">
                      No skip links found. Add links like &lt;a href=&quot;#main&quot;&gt;Skip to main&lt;/a&gt; for keyboard users.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter HTML to check skip links.
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
