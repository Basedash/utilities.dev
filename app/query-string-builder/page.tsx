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
import {
  parseQueryString,
  buildQueryString,
  type QueryParam,
} from "./utils";

export default function QueryStringBuilderPage() {
  const [input, setInput] = useState("");
  const [params, setParams] = useState<QueryParam[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = useCallback(() => {
    const result = parseQueryString(input);
    if (result.success && result.params !== undefined) {
      setParams(result.params);
      setError(null);
    } else {
      setParams([]);
      setError(result.error ?? "Invalid query string");
    }
  }, [input]);

  const updateParam = (index: number, field: "key" | "value", value: string) => {
    const next = [...params];
    next[index] = { ...next[index], [field]: value };
    setParams(next);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const builtString = buildQueryString(params);

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
    setParams([]);
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
                Query String Input
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
                Paste a query string or URL fragment to parse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-query">Query string</Label>
                <Input
                  id="input-query"
                  type="text"
                  placeholder="foo=bar&baz=qux or ?key=value"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={handleParse}
                  className="font-mono"
                />
              </div>
              <Button onClick={handleParse} disabled={!input.trim()}>
                Parse
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Parameters
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParam}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(builtString)}
                    disabled={!builtString}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Add, edit, or remove key-value pairs. Built string updates automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {params.map((param, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={param.key}
                      onChange={(e) => updateParam(i, "key", e.target.value)}
                      placeholder="key"
                      className="font-mono flex-1"
                    />
                    <Input
                      value={param.value}
                      onChange={(e) => updateParam(i, "value", e.target.value)}
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
                {params.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No parameters. Click Add or parse a query string above.
                  </p>
                )}
              </div>

              {builtString && (
                <div className="space-y-2">
                  <Label>Built query string</Label>
                  <Input
                    value={builtString}
                    readOnly
                    className="font-mono bg-muted"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
