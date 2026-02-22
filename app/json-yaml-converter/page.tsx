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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import { Copy, Trash2, ArrowLeftRight, CheckCircle, AlertCircle } from "lucide-react";
import manifest from "./manifest";
import {
  convert,
  type ConversionDirection,
  type ConversionResult,
} from "./utils";

export default function JsonYamlConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("json-to-yaml");
  const [lastResult, setLastResult] = useState<ConversionResult | null>(null);

  const handleDirectionChange = (nextDirection: ConversionDirection) => {
    if (nextDirection === direction) return;
    setDirection(nextDirection);
    setOutput("");
    setLastResult(null);
  };

  const handleConvert = () => {
    const result = convert(input, direction);
    setLastResult(result);
    setOutput(result.success ? result.result : "");
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
    setInput("");
    setOutput("");
    setLastResult(null);
  };

  const inputLabel =
    direction === "json-to-yaml" ? "Input JSON" : "Input YAML";
  const outputLabel =
    direction === "json-to-yaml" ? "Output YAML" : "Output JSON";
  const inputPlaceholder =
    direction === "json-to-yaml"
      ? '{"example": "Paste JSON here..."}'
      : "example: value\nnested:\n  key: value";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {/* Direction Toggle */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Conversion Direction
            </CardTitle>
            <CardDescription>
              Choose whether to convert JSON to YAML or YAML to JSON
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={direction === "json-to-yaml" ? "default" : "outline"}
                onClick={() => handleDirectionChange("json-to-yaml")}
              >
                JSON to YAML
              </Button>
              <Button
                variant={direction === "yaml-to-json" ? "default" : "outline"}
                onClick={() => handleDirectionChange("yaml-to-json")}
              >
                YAML to JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        {lastResult !== null && (
          <div className="mb-6">
            <Card
              className={`border-2 ${
                lastResult.success
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {lastResult.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Conversion successful
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        Conversion failed
                      </span>
                      <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                        {lastResult.error}
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
                {inputLabel}
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
                    onClick={() => handleCopy(input)}
                    disabled={!input}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste your {direction === "json-to-yaml" ? "JSON" : "YAML"}{" "}
                data here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">{inputLabel}</Label>
                <Textarea
                  id="input"
                  placeholder={inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleConvert}
                disabled={!input.trim()}
                className="w-full"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Convert
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {outputLabel}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(output)}
                    disabled={!output}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Converted {direction === "json-to-yaml" ? "YAML" : "JSON"} result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output">Result</Label>
                <Textarea
                  id="output"
                  value={output}
                  readOnly
                  className="min-h-[300px] resize-none bg-muted font-mono text-sm"
                  placeholder="Converted output will appear here..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
