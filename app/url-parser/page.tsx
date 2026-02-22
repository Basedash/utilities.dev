"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Plus, AlertCircle } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { parseUrl, buildUrl, type ParsedUrl } from "./utils";

export default function UrlParserPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    const result = parseUrl(inputUrl);
    if (result.success && result.parsed) {
      setParsed(result.parsed);
      setError(null);
    } else {
      setParsed(null);
      setError(result.error ?? "Invalid URL");
    }
  }, [inputUrl]);

  const updateParam = (index: number, field: "key" | "value", value: string) => {
    if (!parsed) return;
    const next = [...parsed.searchParams];
    next[index] = { ...next[index], [field]: value };
    setParsed({ ...parsed, searchParams: next });
  };

  const addParam = () => {
    if (!parsed) return;
    setParsed({
      ...parsed,
      searchParams: [...parsed.searchParams, { key: "", value: "" }],
    });
  };

  const removeParam = (index: number) => {
    if (!parsed) return;
    const next = parsed.searchParams.filter((_, i) => i !== index);
    setParsed({ ...parsed, searchParams: next });
  };

  const updatePart = (field: keyof ParsedUrl, value: string) => {
    if (!parsed) return;
    if (field === "searchParams") return;
    setParsed({ ...parsed, [field]: value });
  };

  const rebuiltUrl = parsed ? buildUrl(parsed) : "";

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
    setInputUrl("");
    setParsed(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                URL Input
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
                    onClick={() => handleCopy(inputUrl)}
                    disabled={!inputUrl}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste or type a URL to parse into its components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-url">URL</Label>
                <Input
                  id="input-url"
                  type="url"
                  placeholder="https://example.com/path?key=value#hash"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onBlur={handleParse}
                  className="font-mono"
                />
              </div>
              <Button onClick={handleParse} disabled={!inputUrl.trim()}>
                Parse URL
              </Button>

              {error && (
                <div
                  className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {parsed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Parsed URL
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(rebuiltUrl)}
                    disabled={!rebuiltUrl}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Edit parts below; the rebuilt URL updates automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Protocol</Label>
                    <Input
                      value={parsed.protocol}
                      onChange={(e) =>
                        updatePart("protocol", e.target.value)
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Host</Label>
                    <Input
                      value={parsed.host}
                      onChange={(e) => updatePart("host", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      value={parsed.port}
                      onChange={(e) => updatePart("port", e.target.value)}
                      placeholder="(optional)"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Pathname</Label>
                    <Input
                      value={parsed.pathname}
                      onChange={(e) =>
                        updatePart("pathname", e.target.value)
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Hash</Label>
                    <Input
                      value={parsed.hash}
                      onChange={(e) => updatePart("hash", e.target.value)}
                      placeholder="#section"
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Query parameters</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addParam}
                      className="h-7 px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add param
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {parsed.searchParams.map((param, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-center"
                      >
                        <Input
                          value={param.key}
                          onChange={(e) =>
                            updateParam(i, "key", e.target.value)
                          }
                          placeholder="key"
                          className="font-mono flex-1"
                        />
                        <Input
                          value={param.value}
                          onChange={(e) =>
                            updateParam(i, "value", e.target.value)
                          }
                          placeholder="value"
                          className="font-mono flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParam(i)}
                          className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label="Remove parameter"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {parsed.searchParams.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No query parameters. Click Add param to add one.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rebuilt URL</Label>
                  <Input
                    value={rebuiltUrl}
                    readOnly
                    className="font-mono bg-muted"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
