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
import { Copy, Trash2 } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { parseHttpHeaders, formatHttpHeaders } from "./utils";

export default function HttpHeaderParserPage() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseHttpHeaders> | null>(null);

  const handleParse = useCallback(() => {
    const result = parseHttpHeaders(input);
    setParsed(result);
  }, [input]);

  const formattedOutput = parsed?.success && parsed.headers
    ? formatHttpHeaders(parsed.headers, parsed.statusLine)
    : "";

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
                Raw Headers
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
                Paste HTTP headers from request, response, or dev tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-headers">Headers</Label>
                <Textarea
                  id="input-headers"
                  placeholder={`HTTP/1.1 200 OK
Content-Type: application/json
Authorization: Bearer token
Accept: */*`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={handleParse}
                  className="min-h-[180px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleParse} disabled={!input.trim()}>
                Parse
              </Button>
            </CardContent>
          </Card>

          {parsed?.success && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Parsed Headers
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(formattedOutput)}
                    disabled={!formattedOutput}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Structured view of parsed headers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parsed.statusLine && (
                  <div className="space-y-2">
                    <Label>Status line</Label>
                    <div className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                      {parsed.statusLine}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Headers</Label>
                  <div className="space-y-2">
                    {parsed.headers?.map((h, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap gap-2 rounded-md border bg-muted/50 px-3 py-2 font-mono text-sm"
                      >
                        <span className="font-semibold text-foreground">{h.name}:</span>
                        <span className="text-muted-foreground break-all">{h.value || "(empty)"}</span>
                      </div>
                    ))}
                    {(!parsed.headers || parsed.headers.length === 0) && !parsed.statusLine && (
                      <p className="text-sm text-muted-foreground">No headers found.</p>
                    )}
                  </div>
                </div>
                {formattedOutput && (
                  <div className="space-y-2">
                    <Label>Formatted output</Label>
                    <Textarea
                      value={formattedOutput}
                      readOnly
                      className="min-h-[100px] font-mono text-sm bg-muted"
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
