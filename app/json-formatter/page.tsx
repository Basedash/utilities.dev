"use client";

import { useState } from "react";
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

import {
  Copy,
  Trash2,
  FileText,
  Minimize,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatJson, minifyJson, validateJson, formatBytes } from "./utils";

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({ size: 0, lines: 0, characters: 0 });

  const updateResults = (result: {
    success: boolean;
    result: string;
    error?: string;
    stats?: { size: number; lines: number; characters: number };
  }) => {
    if (result.success) {
      setOutputJson(result.result);
      setIsValid(true);
      setErrorMessage("");
      setStats(result.stats || { size: 0, lines: 0, characters: 0 });
    } else {
      setIsValid(false);
      setOutputJson("");
      setErrorMessage(result.error || "Invalid JSON");
      setStats({ size: 0, lines: 0, characters: 0 });
    }
  };

  const handleFormat = () => {
    const result = formatJson(inputJson);
    updateResults(result);
  };

  const handleMinify = () => {
    const result = minifyJson(inputJson);
    updateResults(result);
  };

  const handleValidate = () => {
    if (!inputJson.trim()) {
      setIsValid(null);
      setErrorMessage("");
      return;
    }

    const validation = validateJson(inputJson);
    setIsValid(validation.isValid);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid JSON");
    } else {
      setErrorMessage("");
    }
  };

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
    setInputJson("");
    setOutputJson("");
    setIsValid(null);
    setErrorMessage("");
    setStats({ size: 0, lines: 0, characters: 0 });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            JSON Formatter
          </h1>
          <p className="text-muted-foreground text-lg">
            Format, minify, and validate JSON data with real-time feedback
          </p>
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className="mb-6">
            <Card
              className={`border-2 ${
                isValid
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Valid JSON
                      </span>
                      {stats.size > 0 && (
                        <div className="ml-auto flex gap-4 text-sm text-green-700 dark:text-green-300">
                          <span>{stats.lines} lines</span>
                          <span>
                            {stats.characters.toLocaleString()} characters
                          </span>
                          <span>{formatBytes(stats.size)}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        Invalid JSON
                      </span>
                      <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                        {errorMessage}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Input JSON
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
                    onClick={() => handleCopy(inputJson)}
                    disabled={!inputJson}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste your JSON data here to format, minify, or validate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-json">JSON Data</Label>
                <Textarea
                  id="input-json"
                  placeholder='{"example": "Paste your JSON here..."}'
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleFormat}
                  disabled={!inputJson}
                  className="flex-1 min-w-[100px]"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Format
                </Button>
                <Button
                  onClick={handleMinify}
                  disabled={!inputJson}
                  variant="outline"
                  className="flex-1 min-w-[100px]"
                >
                  <Minimize className="h-4 w-4 mr-1" />
                  Minify
                </Button>
                <Button
                  onClick={handleValidate}
                  disabled={!inputJson}
                  variant="secondary"
                  className="flex-1 min-w-[100px]"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Validate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Output
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(outputJson)}
                    disabled={!outputJson}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Formatted or minified JSON result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-json">Result</Label>
                <Textarea
                  id="output-json"
                  value={outputJson}
                  readOnly
                  className="min-h-[300px] resize-none bg-muted font-mono text-sm"
                  placeholder="Formatted JSON will appear here..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About JSON Formatter</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              JSON (JavaScript Object Notation) is a lightweight data
              interchange format that&apos;s easy for humans to read and write.
              This tool helps you format, validate, and minify JSON data for
              better readability and debugging.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Format Features:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pretty print with proper indentation</li>
                  <li>Syntax validation</li>
                  <li>Error highlighting</li>
                  <li>Size and line statistics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Cases:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>API response debugging</li>
                  <li>Configuration file formatting</li>
                  <li>Data structure validation</li>
                  <li>JSON minification for production</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Tool Features:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time validation</li>
                  <li>Copy to clipboard</li>
                  <li>Format and minify options</li>
                  <li>Detailed error messages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
