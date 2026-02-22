"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Hash, CheckCircle2, XCircle } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { generateUuid, generateUuidBatch, validateUuid } from "./utils";

export default function UuidGeneratorPage() {
  const [generatedUuids, setGeneratedUuids] = useState<string>("");
  const [batchCount, setBatchCount] = useState(1);
  const [validationInput, setValidationInput] = useState("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);

  const handleGenerate = () => {
    const count = Math.min(Math.max(1, batchCount), 1000);
    const batch = generateUuidBatch(count);
    setGeneratedUuids(batch.join("\n"));
  };

  const handleGenerateOne = () => {
    setGeneratedUuids(generateUuid());
  };

  const handleValidate = () => {
    const result = validateUuid(validationInput);
    setValidationResult(result);
  };

  const handleValidationInputChange = (value: string) => {
    setValidationInput(value);
    setValidationResult(null);
    if (value.trim()) {
      setValidationResult(validateUuid(value));
    }
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
    setGeneratedUuids("");
    setValidationInput("");
    setValidationResult(null);
  };

  const hasOutput = generatedUuids || validationInput;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Generator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Generate UUIDs
                </span>
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
                    onClick={() => handleCopy(generatedUuids)}
                    disabled={!generatedUuids}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Generate one or more UUID v4 identifiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-count">Batch count (1-1000)</Label>
                <Input
                  id="batch-count"
                  type="number"
                  min={1}
                  max={1000}
                  value={batchCount}
                  onChange={(e) =>
                    setBatchCount(
                      Math.min(
                        1000,
                        Math.max(1, parseInt(e.target.value, 10) || 1)
                      )
                    )
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateOne} variant="outline">
                  Generate 1
                </Button>
                <Button onClick={handleGenerate}>Generate {batchCount}</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="generated-output">Output</Label>
                <Textarea
                  id="generated-output"
                  value={generatedUuids}
                  readOnly
                  className="min-h-[120px] resize-none font-mono text-sm bg-muted"
                  placeholder="Generated UUIDs will appear here..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Validator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                Validate UUID
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValidationInput("");
                      setValidationResult(null);
                    }}
                    disabled={!validationInput}
                    className="h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(validationInput)}
                    disabled={!validationInput}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste a UUID to check if it is valid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="validation-input">UUID string</Label>
                <Textarea
                  id="validation-input"
                  value={validationInput}
                  onChange={(e) => handleValidationInputChange(e.target.value)}
                  className="min-h-[80px] resize-none font-mono text-sm"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                />
              </div>
              <Button
                onClick={handleValidate}
                disabled={!validationInput.trim()}
                variant="outline"
              >
                Validate
              </Button>
              {validationResult !== null && (
                <div
                  className={`flex items-start gap-2 rounded-md p-3 text-sm ${
                    validationResult.valid
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {validationResult.valid ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {validationResult.valid ? (
                      <p className="font-medium">Valid UUID</p>
                    ) : (
                      <>
                        <p className="font-medium">Invalid UUID</p>
                        {validationResult.error && (
                          <p className="mt-1 text-muted-foreground">
                            {validationResult.error}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {hasOutput && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleClear} variant="outline">
              Clear All
            </Button>
          </div>
        )}

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
