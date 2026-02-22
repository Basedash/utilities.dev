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
import { computeCrc32 } from "./utils";

export default function Crc32ChecksumPage() {
  const [inputText, setInputText] = useState("");
  const [outputChecksum, setOutputChecksum] = useState("");
  const [error, setError] = useState("");

  const handleCompute = () => {
    setError("");
    const result = computeCrc32(inputText);
    if (result.success) {
      setOutputChecksum(result.result);
    } else {
      setError(result.error ?? "Computation failed");
      setOutputChecksum("");
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
    setOutputChecksum("");
    setError("");
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
                Enter the text you want to compute a CRC32 checksum for
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
                    setOutputChecksum("");
                    setError("");
                  }}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleCompute}
                disabled={!inputText}
                className="w-full"
              >
                Compute CRC32
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Output
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(outputChecksum)}
                  disabled={!outputChecksum}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                CRC32 checksum (8-character hex)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-checksum">Checksum</Label>
                <Textarea
                  id="output-checksum"
                  value={outputChecksum}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted font-mono text-sm"
                  placeholder="Checksum will appear here..."
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
