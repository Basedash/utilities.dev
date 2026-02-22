"use client";

import { useState } from "react";
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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { Copy, Trash2, ArrowRight, Equal, ArrowDown, ArrowUp } from "lucide-react";
import { compareSemver, type CompareResult } from "./utils";

function getResultLabel(result: CompareResult): string {
  switch (result) {
    case "newer":
      return "Version A is newer";
    case "older":
      return "Version A is older";
    case "equal":
      return "Versions are equal";
    case "invalid":
      return "Invalid version string(s)";
    default:
      return "";
  }
}

function getResultIcon(result: CompareResult) {
  switch (result) {
    case "newer":
      return <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />;
    case "older":
      return <ArrowDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    case "equal":
      return <Equal className="h-5 w-5 text-muted-foreground" />;
    case "invalid":
      return null;
    default:
      return null;
  }
}

export default function SemverComparePage() {
  const [versionA, setVersionA] = useState("");
  const [versionB, setVersionB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  const handleCompare = () => {
    if (!versionA.trim() || !versionB.trim()) {
      setResult(null);
      return;
    }
    setResult(compareSemver(versionA, versionB));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setVersionA("");
    setVersionB("");
    setResult(null);
  };

  const resultText =
    result !== null
      ? `${versionA} ${result === "newer" ? ">" : result === "older" ? "<" : "=="} ${versionB}: ${getResultLabel(result)}`
      : "";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Compare versions
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(resultText)}
                  disabled={!resultText}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Enter two semver strings (e.g. 1.2.3) to compare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="version-a">Version A</Label>
                <Input
                  id="version-a"
                  placeholder="1.2.3"
                  value={versionA}
                  onChange={(e) => setVersionA(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version-b">Version B</Label>
                <Input
                  id="version-b"
                  placeholder="2.0.0"
                  value={versionB}
                  onChange={(e) => setVersionB(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <Button
              onClick={handleCompare}
              disabled={!versionA.trim() || !versionB.trim()}
              className="w-full sm:w-auto"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Compare
            </Button>

            {result !== null && (
              <div
                className={`flex items-center gap-2 rounded-lg border p-4 ${
                  result === "invalid"
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border bg-muted/50"
                }`}
              >
                {getResultIcon(result)}
                <span
                  className={
                    result === "invalid"
                      ? "text-destructive font-medium"
                      : "font-medium"
                  }
                >
                  {getResultLabel(result)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
