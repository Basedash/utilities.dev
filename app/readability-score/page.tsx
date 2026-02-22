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
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import manifest from "./manifest";
import { computeReadability } from "./utils";

export default function ReadabilityScorePage() {
  const [text, setText] = useState("");

  const result = useMemo(() => computeReadability(text), [text]);

  const handleClear = () => setText("");

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
                Paste or type text to compute readability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="readability-input">Text</Label>
                <Textarea
                  id="readability-input"
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
              <CardTitle>Readability Metrics</CardTitle>
              <CardDescription>
                Flesch Reading Ease and grade level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {result ? (
                <>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl font-semibold tabular-nums">
                      {result.fleschReadingEase}
                    </span>
                    <Badge variant="outline">Flesch Reading Ease</Badge>
                    <span className="text-sm text-muted-foreground">
                      (higher = easier)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl font-semibold tabular-nums">
                      {result.gradeLevel}
                    </span>
                    <Badge variant="outline">Grade Level</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span>{result.wordCount} words</span>
                    <span>{result.sentenceCount} sentences</span>
                    <span>{result.syllableCount} syllables</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Paste text with at least one word and one sentence to see
                  metrics.
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
