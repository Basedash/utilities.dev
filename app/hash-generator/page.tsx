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
import { Copy, Trash2 } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { hashText, HASH_ALGORITHMS, type HashAlgorithm } from "./utils";

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState("");
  const [outputHash, setOutputHash] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [error, setError] = useState("");
  const [isComputing, setIsComputing] = useState(false);

  const handleHash = async (algo?: HashAlgorithm) => {
    const currentAlgo = algo ?? algorithm;
    setError("");
    setOutputHash("");
    if (!inputText) return;

    setIsComputing(true);
    const result = await hashText(inputText, currentAlgo);
    setIsComputing(false);

    if (result.success) {
      setOutputHash(result.result);
    } else {
      setError(result.error ?? "Hashing failed");
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
    setOutputHash("");
    setError("");
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as HashAlgorithm;
    if (HASH_ALGORITHMS.includes(value)) {
      setAlgorithm(value);
      if (outputHash && inputText) {
        handleHash(value);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
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
                Enter the text you want to hash
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
                    // Clear stale output/errors when input changes.
                    setOutputHash("");
                    setError("");
                  }}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Label htmlFor="algorithm" className="sr-only">
                  Algorithm
                </Label>
                <select
                  id="algorithm"
                  value={algorithm}
                  onChange={handleAlgorithmChange}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {HASH_ALGORITHMS.map((algo) => (
                    <option key={algo} value={algo}>
                      {algo}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleHash}
                  disabled={!inputText || isComputing}
                  className="flex-1 min-w-[100px]"
                >
                  {isComputing ? "Computing..." : "Hash"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Output
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(outputHash)}
                  disabled={!outputHash}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                {algorithm} hash (lowercase hex)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-hash">Hash</Label>
                <Textarea
                  id="output-hash"
                  value={outputHash}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted font-mono text-sm"
                  placeholder="Hash will appear here..."
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
