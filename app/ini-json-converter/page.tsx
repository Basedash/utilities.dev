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

export default function IniJsonConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("ini-to-json");
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
    direction === "ini-to-json" ? "Input INI" : "Input JSON";
  const outputLabel =
    direction === "ini-to-json" ? "Output JSON" : "Output INI";
  const inputPlaceholder =
    direction === "ini-to-json"
      ? "[section]\nkey=value\nother=123"
      : '{"section":{"key":"value","other":"123"}}';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Conversion Direction
            </CardTitle>
            <CardDescription>
              Choose whether to convert INI to JSON or JSON to INI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={direction === "ini-to-json" ? "default" : "outline"}
                onClick={() => handleDirectionChange("ini-to-json")}
              >
                INI to JSON
              </Button>
              <Button
                variant={direction === "json-to-ini" ? "default" : "outline"}
                onClick={() => handleDirectionChange("json-to-ini")}
              >
                JSON to INI
              </Button>
            </div>
          </CardContent>
        </Card>

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
                Paste your {direction === "ini-to-json" ? "INI" : "JSON"}{" "}
                config here
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
                Converted {direction === "ini-to-json" ? "JSON" : "INI"} result
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
