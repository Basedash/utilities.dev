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
import { ArrowUpDown, Copy, Trash2, AlertCircle } from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { encodeHtmlEntities, decodeHtmlEntities } from "./utils";

export default function HtmlEntityEncoderPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isEncoded, setIsEncoded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEncode = () => {
    const result = encodeHtmlEntities(inputText);
    if (result.success) {
      setOutputText(result.result);
      setIsEncoded(true);
      setErrorMessage("");
    } else {
      setOutputText("");
      setErrorMessage(result.error || "Unable to encode text");
    }
  };

  const handleDecode = () => {
    const result = decodeHtmlEntities(inputText);
    if (result.success) {
      setOutputText(result.result);
      setIsEncoded(false);
      setErrorMessage("");
    } else {
      setOutputText("");
      setErrorMessage(result.error || "Unable to decode text");
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setIsEncoded(!isEncoded);
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        {errorMessage && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                Enter text to encode or HTML entities to decode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text or entities here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEncode}
                  disabled={!inputText}
                  className="flex-1"
                >
                  Encode
                </Button>
                <Button
                  onClick={handleDecode}
                  disabled={!inputText}
                  variant="outline"
                  className="flex-1"
                >
                  Decode
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
                    disabled={!outputText || !!errorMessage}
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
                {isEncoded ? "HTML entities" : "Decoded text"} result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-text">Result</Label>
                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted"
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
