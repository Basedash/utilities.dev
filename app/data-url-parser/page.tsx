"use client";

import { useState, useCallback } from "react";
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
import { Copy, Trash2, AlertCircle } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { parseDataUrl } from "./utils";

export default function DataUrlParserPage() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseDataUrl> | null>(null);

  const handleParse = useCallback(() => {
    const result = parseDataUrl(input);
    setParsed(result);
  }, [input]);

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
    setParsed(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Data URL Input
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
                Paste a data URL to parse and decode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-dataurl">Data URL</Label>
                <Textarea
                  id="input-dataurl"
                  placeholder="data:text/plain;base64,aGVsbG8="
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={handleParse}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleParse} disabled={!input.trim()}>
                Parse
              </Button>

              {parsed && !parsed.success && (
                <div
                  className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{parsed.error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {parsed?.success && parsed.parsed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Parsed Result
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(input)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Media type, charset, encoding, and decoded content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Media type</Label>
                    <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                      {parsed.parsed.mediaType}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Base64</Label>
                    <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                      {parsed.parsed.base64 ? "Yes" : "No"}
                    </div>
                  </div>
                  {parsed.parsed.charset && (
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Charset</Label>
                      <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                        {parsed.parsed.charset}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    Raw data
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleCopy(parsed.parsed!.data)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </Label>
                  <Textarea
                    value={parsed.parsed.data}
                    readOnly
                    className="min-h-[80px] font-mono text-sm bg-muted"
                  />
                </div>

                {parsed.parsed.decodedData !== undefined && (
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      Decoded content
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleCopy(parsed.parsed!.decodedData ?? "")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </Label>
                    <Textarea
                      value={parsed.parsed.decodedData}
                      readOnly
                      className="min-h-[120px] font-mono text-sm bg-muted"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
