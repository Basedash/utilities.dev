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
import { ArrowUpDown, Copy, Trash2, AlertCircle } from "lucide-react";
import manifest from "./manifest";
import {
  escapeUnescape,
  type EscapeMode,
  type EscapeAction,
} from "./utils";

const MODES: { value: EscapeMode; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "javascript", label: "JavaScript" },
  { value: "regex", label: "Regex" },
  { value: "newline-tab", label: "Newline/Tab" },
];

const ACTIONS: { value: EscapeAction; label: string }[] = [
  { value: "escape", label: "Escape" },
  { value: "unescape", label: "Unescape" },
];

export default function TextEscapeUnescapePage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mode, setMode] = useState<EscapeMode>("json");
  const [action, setAction] = useState<EscapeAction>("escape");

  const handleConvert = () => {
    setErrorMessage("");
    const result = escapeUnescape(inputText, mode, action);
    if (result.success) {
      setOutputText(result.result);
    } else {
      setOutputText("");
      setErrorMessage(result.error ?? "Conversion failed");
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
    setInputText("");
    setOutputText("");
    setErrorMessage("");
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {errorMessage && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    {errorMessage}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                Paste text to escape or unescape
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text here..."
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setOutputText("");
                    setErrorMessage("");
                  }}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Label htmlFor="mode" className="sr-only">
                  Escape mode
                </Label>
                <select
                  id="mode"
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as EscapeMode);
                    setOutputText("");
                    setErrorMessage("");
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <Label htmlFor="action" className="sr-only">
                  Escape action
                </Label>
                <select
                  id="action"
                  value={action}
                  onChange={(e) => {
                    setAction(e.target.value as EscapeAction);
                    setOutputText("");
                    setErrorMessage("");
                  }}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {ACTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleConvert}
                  disabled={!inputText}
                  className="flex-1 min-w-[100px]"
                >
                  Convert
                </Button>
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
                    onClick={handleSwap}
                    disabled={!outputText}
                    className="h-8 px-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
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
                {action === "escape" ? "Escaped" : "Unescaped"} result for{" "}
                {mode}
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
                  placeholder="Result will appear here..."
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
