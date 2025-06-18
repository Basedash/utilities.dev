"use client";

import { useState, useMemo } from "react";
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
import { diffTexts, formatUnifiedDiff, type DiffOptions } from "./utils";

export default function DiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const diffResult = useMemo(() => {
    const diffOptions: DiffOptions = {
      ignoreWhitespace,
      ignoreCase,
    };
    return diffTexts(text1, text2, diffOptions);
  }, [text1, text2, ignoreWhitespace, ignoreCase]);

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
    setText1("");
    setText2("");
  };

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const copyDiffResult = () => {
    const diffText = formatUnifiedDiff(diffResult, "text1", "text2");
    handleCopy(diffText);
  };

  const stats = useMemo(() => {
    return diffResult.stats;
  }, [diffResult]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Text Diff Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare two texts and see the differences highlighted
          </p>
        </div>

        {/* Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comparison Options</CardTitle>
            <CardDescription>
              Configure how the texts should be compared
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Text 1 Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Original Text
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
                    onClick={() => handleCopy(text1)}
                    disabled={!text1}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Enter the original text</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter first text here..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[300px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Text 2 Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Modified Text
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwap}
                    disabled={!text1 && !text2}
                    className="h-8 px-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(text2)}
                    disabled={!text2}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Enter the modified text</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter second text here..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[300px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {diffResult.hasChanges && (
          <Card className="my-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Diff Statistics
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyDiffResult}
                  className="ml-auto h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-1">Copy Diff</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.removed}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Removed
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.added}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Added
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {stats.unchanged}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Unchanged
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.total}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Lines
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diff Results */}
        {diffResult.lines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Diff Results
              </CardTitle>
              <CardDescription>
                Side-by-side comparison showing additions and deletions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 max-h-[600px] overflow-auto">
                <div className="font-mono text-sm space-y-0.5">
                  {diffResult.lines.map((line, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded flex items-start gap-2 ${
                        line.type === "added"
                          ? "bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400"
                          : line.type === "removed"
                          ? "bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex gap-2 text-xs text-muted-foreground min-w-[60px]">
                        <span className="w-6 text-right">
                          {line.lineNumber1 || ""}
                        </span>
                        <span className="w-6 text-right">
                          {line.lineNumber2 || ""}
                        </span>
                      </div>
                      <div
                        className={`flex-1 ${
                          line.type === "added"
                            ? "text-green-800 dark:text-green-200"
                            : line.type === "removed"
                            ? "text-red-800 dark:text-red-200"
                            : "text-foreground"
                        }`}
                      >
                        <span className="mr-2 font-bold">
                          {line.type === "added"
                            ? "+"
                            : line.type === "removed"
                            ? "-"
                            : " "}
                        </span>
                        {line.content || " "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(text1 || text2) && diffResult.lines.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No differences found between the texts.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Text Diff</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              This tool compares two text inputs and highlights the differences
              between them. It uses a line-by-line comparison algorithm to
              identify additions, deletions, and unchanged content.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Color Legend:
                </h4>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>Added lines (present in modified text)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span>Removed lines (present in original text)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span>Unchanged lines (identical in both texts)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Features:
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• Line-by-line text comparison</li>
                  <li>• Case-sensitive and case-insensitive modes</li>
                  <li>• Whitespace normalization option</li>
                  <li>• Copy diff results to clipboard</li>
                  <li>• Detailed statistics and summary</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
