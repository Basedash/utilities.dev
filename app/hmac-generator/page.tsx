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
import {
  Copy,
  Trash2,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import {
  computeHmac,
  validateInput,
  type HmacAlgorithm,
} from "./utils";

const ALGORITHMS: { value: HmacAlgorithm; label: string }[] = [
  { value: "SHA-1", label: "HMAC-SHA-1" },
  { value: "SHA-256", label: "HMAC-SHA-256" },
  { value: "SHA-384", label: "HMAC-SHA-384" },
  { value: "SHA-512", label: "HMAC-SHA-512" },
];

export default function HmacGeneratorPage() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const msgError = validateInput(message, "Message");
    const secretError = validateInput(secret, "Secret");

    if (msgError || secretError) {
      setError(msgError ?? secretError ?? "");
      setOutput("");
      return;
    }

    setError("");
    setIsGenerating(true);

    const result = await computeHmac(message, secret, algorithm);

    setIsGenerating(false);

    if (result.success) {
      setOutput(result.result);
    } else {
      setOutput("");
      setError(result.error ?? "HMAC computation failed");
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
    setMessage("");
    setSecret("");
    setOutput("");
    setError("");
  };

  const showValidation = error && !output;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        {showValidation && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    {error}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Input
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Enter the message and secret key to sign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter the message to sign..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                    setOutput("");
                  }}
                  className="min-h-[100px] resize-none font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Secret Key</Label>
                <Textarea
                  id="secret"
                  placeholder="Enter the secret key..."
                  value={secret}
                  onChange={(e) => {
                    setSecret(e.target.value);
                    setError("");
                    setOutput("");
                  }}
                  className="min-h-[80px] resize-none font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm</Label>
                <select
                  id="algorithm"
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value as HmacAlgorithm);
                    setOutput("");
                    setError("");
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {ALGORITHMS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!message.trim() || !secret.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate HMAC"}
              </Button>
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
                    onClick={() => handleCopy(output)}
                    disabled={!output}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                HMAC signature (lowercase hex)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {output && (
                <div className="mb-4 flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">Signature generated</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="output">Result</Label>
                <Textarea
                  id="output"
                  value={output}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted font-mono text-sm"
                  placeholder="HMAC signature will appear here..."
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
