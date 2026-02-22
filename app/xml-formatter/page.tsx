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
import manifest from "./manifest";
import {
  Copy,
  Trash2,
  FileCode,
  Minimize,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatXml, minifyXml, validateXml } from "./utils";

export default function XmlFormatterPage() {
  const [inputXml, setInputXml] = useState("");
  const [outputXml, setOutputXml] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const updateResults = (result: {
    success: boolean;
    result: string;
    error?: string;
  }) => {
    if (result.success) {
      setOutputXml(result.result);
      setIsValid(true);
      setErrorMessage("");
    } else {
      setIsValid(false);
      setOutputXml("");
      setErrorMessage(result.error || "Invalid XML");
    }
  };

  const handleFormat = () => {
    const result = formatXml(inputXml);
    updateResults(result);
  };

  const handleMinify = () => {
    const result = minifyXml(inputXml);
    updateResults(result);
  };

  const handleValidate = () => {
    if (!inputXml.trim()) {
      setIsValid(null);
      setErrorMessage("");
      return;
    }

    const validation = validateXml(inputXml);
    setIsValid(validation.isValid);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid XML");
    } else {
      setErrorMessage("");
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
    setInputXml("");
    setOutputXml("");
    setIsValid(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {isValid !== null && (
          <div className="mb-6">
            <Card
              className={`border-2 ${
                isValid
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Valid XML
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        Invalid XML
                      </span>
                      <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                        {errorMessage}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Input XML
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
                    onClick={() => handleCopy(inputXml)}
                    disabled={!inputXml}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste your XML data here to format, minify, or validate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-xml">XML Data</Label>
                <Textarea
                  id="input-xml"
                  placeholder="<root><item>Paste your XML here...</item></root>"
                  value={inputXml}
                  onChange={(e) => setInputXml(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleFormat}
                  disabled={!inputXml}
                  className="flex-1 min-w-[100px]"
                >
                  <FileCode className="h-4 w-4 mr-1" />
                  Format
                </Button>
                <Button
                  onClick={handleMinify}
                  disabled={!inputXml}
                  variant="outline"
                  className="flex-1 min-w-[100px]"
                >
                  <Minimize className="h-4 w-4 mr-1" />
                  Minify
                </Button>
                <Button
                  onClick={handleValidate}
                  disabled={!inputXml}
                  variant="secondary"
                  className="flex-1 min-w-[100px]"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Validate
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
                    onClick={() => handleCopy(outputXml)}
                    disabled={!outputXml}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Formatted or minified XML result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-xml">Result</Label>
                <Textarea
                  id="output-xml"
                  value={outputXml}
                  readOnly
                  className="min-h-[300px] resize-none bg-muted font-mono text-sm"
                  placeholder="Formatted XML will appear here..."
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
