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
import manifest from "./manifest";
import { Copy, Trash2 } from "lucide-react";
import { convertCase, type CaseFormat } from "./utils";

const CASE_OPTIONS: { value: CaseFormat; label: string }[] = [
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
  { value: "upper_snake", label: "UPPER_SNAKE_CASE" },
];

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<CaseFormat>("camel");

  const handleConvert = (format?: CaseFormat) => {
    const target = format ?? selectedFormat;
    const result = convertCase(inputText, target);
    setOutputText(result);
    if (format) setSelectedFormat(format);
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
    setInputText("");
    setOutputText("");
    setSelectedFormat("camel");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Input
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
                    onClick={() => handleCopy(inputText)}
                    disabled={!inputText}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Enter text with spaces, underscores, hyphens, or mixed case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="hello world, foo_bar, or HelloWorld..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CASE_OPTIONS.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedFormat === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConvert(value)}
                    disabled={!inputText}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Output
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Converted result in {CASE_OPTIONS.find((o) => o.value === selectedFormat)?.label ?? selectedFormat}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-text">Result</Label>
                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted font-mono text-sm"
                  placeholder="Converted text will appear here..."
                />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {CASE_OPTIONS.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleConvert(value)}
                      disabled={!inputText}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
