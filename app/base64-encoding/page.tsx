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
import { ArrowUpDown, Copy, Trash2 } from "lucide-react";
import { encodeBase64, decodeBase64 } from "./utils";

export default function Base64EncodingPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isEncoded, setIsEncoded] = useState(false);

  const handleEncode = () => {
    const result = encodeBase64(inputText);
    if (result.success) {
      setOutputText(result.result);
      setIsEncoded(true);
    } else {
      setOutputText(`Error: ${result.error}`);
    }
  };

  const handleDecode = () => {
    const result = decodeBase64(inputText);
    if (result.success) {
      setOutputText(result.result);
      setIsEncoded(false);
    } else {
      setOutputText(`Error: ${result.error}`);
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
      // Fallback for older browsers
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
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Base64 Encoding
          </h1>
          <p className="text-muted-foreground text-lg">
            Encode and decode text using Base64 encoding
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
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
                Enter the text you want to encode or decode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text here..."
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

          {/* Output Section */}
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
                {isEncoded ? "Base64 encoded" : "Base64 decoded"} result
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

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Base64 Encoding</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Base64 is a binary-to-text encoding scheme that represents binary
              data in an ASCII string format. It&apos;s commonly used for
              encoding data that needs to be stored or transmitted over media
              designed for text data, such as email or URLs.
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Common Use Cases:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email attachments</li>
                  <li>Data URLs in web development</li>
                  <li>API authentication tokens</li>
                  <li>Binary data transmission</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Features:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Instant encoding/decoding</li>
                  <li>Copy results to clipboard</li>
                  <li>Swap input and output</li>
                  <li>Clear all fields</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
