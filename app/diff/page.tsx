"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Trash2, GitCompare, FileText, RefreshCw } from "lucide-react";

interface DiffLine {
  type: "equal" | "added" | "removed";
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

export default function DiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const processText = useCallback(
    (text: string) => {
      let processed = text;
      if (ignoreCase) {
        processed = processed.toLowerCase();
      }
      if (ignoreWhitespace) {
        processed = processed.replace(/\s+/g, " ").trim();
      }
      return processed;
    },
    [ignoreCase, ignoreWhitespace]
  );

  const diffLines = useMemo(() => {
    if (!text1 && !text2) return [];

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const processedLines1 = lines1.map(processText);
    const processedLines2 = lines2.map(processText);

    const result: DiffLine[] = [];
    let i = 0,
      j = 0;

    // Simple line-by-line diff algorithm
    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Remaining lines in text2 are additions
        result.push({
          type: "added",
          content: lines2[j],
          lineNumber2: j + 1,
        });
        j++;
      } else if (j >= lines2.length) {
        // Remaining lines in text1 are deletions
        result.push({
          type: "removed",
          content: lines1[i],
          lineNumber1: i + 1,
        });
        i++;
      } else if (processedLines1[i] === processedLines2[j]) {
        // Lines are equal
        result.push({
          type: "equal",
          content: lines1[i],
          lineNumber1: i + 1,
          lineNumber2: j + 1,
        });
        i++;
        j++;
      } else {
        // Look ahead to find matching lines
        let foundMatch = false;

        // Check if current line in text1 matches any upcoming line in text2
        for (let k = j + 1; k < Math.min(j + 5, lines2.length); k++) {
          if (processedLines1[i] === processedLines2[k]) {
            // Add the lines between j and k as additions
            for (let l = j; l < k; l++) {
              result.push({
                type: "added",
                content: lines2[l],
                lineNumber2: l + 1,
              });
            }
            result.push({
              type: "equal",
              content: lines1[i],
              lineNumber1: i + 1,
              lineNumber2: k + 1,
            });
            i++;
            j = k + 1;
            foundMatch = true;
            break;
          }
        }

        if (!foundMatch) {
          // Check if current line in text2 matches any upcoming line in text1
          for (let k = i + 1; k < Math.min(i + 5, lines1.length); k++) {
            if (processedLines1[k] === processedLines2[j]) {
              // Add the lines between i and k as deletions
              for (let l = i; l < k; l++) {
                result.push({
                  type: "removed",
                  content: lines1[l],
                  lineNumber1: l + 1,
                });
              }
              result.push({
                type: "equal",
                content: lines1[k],
                lineNumber1: k + 1,
                lineNumber2: j + 1,
              });
              i = k + 1;
              j++;
              foundMatch = true;
              break;
            }
          }
        }

        if (!foundMatch) {
          // No match found, treat as both removal and addition
          result.push({
            type: "removed",
            content: lines1[i],
            lineNumber1: i + 1,
          });
          result.push({
            type: "added",
            content: lines2[j],
            lineNumber2: j + 1,
          });
          i++;
          j++;
        }
      }
    }

    return result;
  }, [text1, text2, processText]);

  const stats = useMemo(() => {
    const added = diffLines.filter((line) => line.type === "added").length;
    const removed = diffLines.filter((line) => line.type === "removed").length;
    const unchanged = diffLines.filter((line) => line.type === "equal").length;

    return { added, removed, unchanged, total: diffLines.length };
  }, [diffLines]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setText1("");
    setText2("");
  };

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const copyDiffResult = () => {
    const diffText = diffLines
      .map((line) => {
        const prefix =
          line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
        return prefix + line.content;
      })
      .join("\n");
    handleCopy(diffText);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Text Diff Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare two text blocks and highlight the differences
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-whitespace"
                  checked={ignoreWhitespace}
                  onCheckedChange={setIgnoreWhitespace}
                />
                <Label htmlFor="ignore-whitespace">Ignore whitespace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignore-case"
                  checked={ignoreCase}
                  onCheckedChange={setIgnoreCase}
                />
                <Label htmlFor="ignore-case">Ignore case</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSwap} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Swap texts
              </Button>
              <Button variant="outline" onClick={handleClear} size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Original Text
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(text1)}
                  disabled={!text1}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Paste or type the first text to compare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter the original text here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Modified Text
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(text2)}
                  disabled={!text2}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Paste or type the second text to compare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter the modified text here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Diff Results */}
        {diffLines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5" />
                  Diff Results
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="text-green-600">+{stats.added}</span>
                    <span className="text-red-600">-{stats.removed}</span>
                    <span>{stats.unchanged} unchanged</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyDiffResult}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Lines marked with + are additions, - are deletions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 max-h-[600px] overflow-auto">
                <div className="font-mono text-sm space-y-0.5">
                  {diffLines.map((line, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 px-2 py-1 rounded ${
                        line.type === "added"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                          : line.type === "removed"
                          ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                          : ""
                      }`}
                    >
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {line.type === "added" && "+"}
                        {line.type === "removed" && "-"}
                        {line.type === "equal" && " "}
                      </span>
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {line.lineNumber1 || ""}
                      </span>
                      <span className="text-muted-foreground text-xs w-8 flex-shrink-0">
                        {line.lineNumber2 || ""}
                      </span>
                      <span className="whitespace-pre-wrap break-all flex-1">
                        {line.content || " "}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(text1 || text2) && diffLines.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No differences found
                </h3>
                <p className="text-muted-foreground">
                  The two text blocks are identical.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
