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
import { Trash2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import manifest from "./manifest";
import { checkPlainLanguage } from "./utils";

export default function PlainLanguageCheckerPage() {
  const [text, setText] = useState("");

  const result = useMemo(() => checkPlainLanguage(text), [text]);

  const handleClear = () => setText("");

  const hasIssues =
    result &&
    (result.longSentences.length > 0 ||
      result.passiveMarkers.length > 0 ||
      result.jargonHits.length > 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                Text Input
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 min-w-9 shrink-0 touch-manipulation"
                  aria-label="Clear text"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Paste or type text to check for plain-language issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="plain-language-input">Text</Label>
                <Textarea
                  id="plain-language-input"
                  placeholder="Paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>
                Long sentences, passive wording, jargon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {result ? (
                <>
                  <section
                    className={
                      hasIssues
                        ? "rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40 p-3 space-y-2"
                        : "rounded-lg border border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40 p-3 space-y-2"
                    }
                    aria-labelledby="suggestions-heading"
                  >
                    <h3
                      id="suggestions-heading"
                      className={`flex items-center gap-2 text-sm font-semibold ${
                        hasIssues
                          ? "text-amber-800 dark:text-amber-200"
                          : "text-emerald-800 dark:text-emerald-200"
                      }`}
                    >
                      {hasIssues ? (
                        <AlertCircle className="h-4 w-4 shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 shrink-0" />
                      )}
                      Suggestions
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {result.longSentences.length > 0 && (
                    <section aria-label="Long sentences">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        Long sentences ({result.longSentences.length})
                      </h3>
                      <ul className="space-y-2">
                        {result.longSentences.slice(0, 5).map((s, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm rounded-lg border border-border px-3 py-2"
                          >
                            <Badge variant="outline" className="shrink-0">
                              #{s.index}
                            </Badge>
                            <span className="text-muted-foreground truncate">
                              {s.text} ({s.wordCount} words)
                            </span>
                          </li>
                        ))}
                        {result.longSentences.length > 5 && (
                          <li className="text-xs text-muted-foreground">
                            +{result.longSentences.length - 5} more
                          </li>
                        )}
                      </ul>
                    </section>
                  )}

                  {result.passiveMarkers.length > 0 && (
                    <section aria-label="Passive wording">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        Passive markers ({result.passiveMarkers.length})
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {result.passiveMarkers.slice(0, 5).map((p, i) => (
                          <li key={i} className="flex gap-2">
                            <Badge variant="outline" className="shrink-0">
                              #{p.index}
                            </Badge>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {p.text}
                            </code>
                          </li>
                        ))}
                        {result.passiveMarkers.length > 5 && (
                          <li className="text-xs text-muted-foreground">
                            +{result.passiveMarkers.length - 5} more
                          </li>
                        )}
                      </ul>
                    </section>
                  )}

                  {result.jargonHits.length > 0 && (
                    <section aria-label="Jargon hits">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        Jargon ({result.jargonHits.length})
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {result.jargonHits.slice(0, 5).map((j, i) => (
                          <li key={i} className="flex gap-2">
                            <Badge variant="outline" className="shrink-0">
                              #{j.index}
                            </Badge>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {j.word}
                            </code>
                          </li>
                        ))}
                        {result.jargonHits.length > 5 && (
                          <li className="text-xs text-muted-foreground">
                            +{result.jargonHits.length - 5} more
                          </li>
                        )}
                      </ul>
                    </section>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Paste text with at least one sentence to see analysis.
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
