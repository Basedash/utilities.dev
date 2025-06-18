"use client";

import { useState, useRef, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";

import {
  Copy,
  Trash2,
  FileImage,
  Minimize,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Eye,
} from "lucide-react";
import {
  formatSvg,
  minifySvg,
  validateSvg,
  formatBytes,
  extractSvgMetadata,
  SvgStats,
} from "./utils";

export default function SvgViewerPage() {
  const [inputSvg, setInputSvg] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState<SvgStats>({
    size: 0,
    elements: 0,
    hasScripts: false,
    hasStyles: false,
  });
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-validate and update metadata when input changes
  useEffect(() => {
    if (!inputSvg.trim()) {
      setIsValid(null);
      setErrorMessage("");
      setStats({ size: 0, elements: 0, hasScripts: false, hasStyles: false });
      setMetadata({});
      return;
    }

    const validation = validateSvg(inputSvg);
    setIsValid(validation.isValid);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid SVG");
      setStats({ size: 0, elements: 0, hasScripts: false, hasStyles: false });
      setMetadata({});
    } else {
      setErrorMessage("");
      const result = formatSvg(inputSvg);
      if (result.success && result.stats) {
        setStats(result.stats);
      }
      setMetadata(extractSvgMetadata(inputSvg));
    }
  }, [inputSvg]);

  const handleFormat = () => {
    const result = formatSvg(inputSvg);
    if (result.success) {
      setInputSvg(result.result);
    }
  };

  const handleMinify = () => {
    const result = minifySvg(inputSvg);
    if (result.success) {
      setInputSvg(result.result);
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
    setInputSvg("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputSvg(content);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">SVG Viewer</h1>
          <p className="text-muted-foreground text-lg">
            View, format, and minify SVG files with real-time preview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Input SVG
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 px-2"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(inputSvg, "svg-file.svg")}
                    disabled={!inputSvg}
                    className="h-8 px-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
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
                    onClick={() => handleCopy(inputSvg)}
                    disabled={!inputSvg}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Paste SVG code here or upload an SVG file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-svg">SVG Code</Label>
                <Textarea
                  id="input-svg"
                  placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">&#10;  <circle cx="50" cy="50" r="40" fill="blue"/>&#10;</svg>'
                  value={inputSvg}
                  onChange={(e) => setInputSvg(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFormat}
                  disabled={!inputSvg}
                  className="flex-1"
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  Format
                </Button>
                <Button
                  onClick={handleMinify}
                  disabled={!inputSvg}
                  variant="outline"
                  className="flex-1"
                >
                  <Minimize className="mr-2 h-4 w-4" />
                  Minify
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SVG Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                SVG Preview
              </CardTitle>
              <CardDescription>Real-time preview of your SVG</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inputSvg && isValid ? (
                <>
                  <div className="flex items-center justify-center min-h-[300px] border rounded-lg bg-white dark:bg-gray-50 p-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: inputSvg,
                      }}
                      className="max-w-full max-h-[300px] overflow-auto"
                    />
                  </div>

                  {/* SVG Details */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Valid SVG
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{stats.elements} elements</span>
                        <span>{formatBytes(stats.size)}</span>
                        {stats.hasScripts && (
                          <Badge variant="destructive" className="h-4 text-xs">
                            Scripts
                          </Badge>
                        )}
                        {stats.hasStyles && (
                          <Badge variant="secondary" className="h-4 text-xs">
                            Styles
                          </Badge>
                        )}
                      </div>
                    </div>

                    {Object.keys(metadata).length > 0 && (
                      <div className="grid gap-1 text-xs">
                        {Object.entries(metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium capitalize text-muted-foreground">
                              {key}:
                            </span>
                            <span className="font-mono text-foreground">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] border rounded-lg bg-muted text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {inputSvg ? (
                        <>
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          Invalid SVG: {errorMessage}
                        </>
                      ) : (
                        "Enter SVG code to see preview"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About SVG Viewer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The SVG Viewer is a tool for working with Scalable Vector Graphics
              (SVG) files. It provides real-time preview, formatting, and
              minification capabilities to help developers and designers work
              more efficiently with SVG content.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Features:
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• Real-time SVG preview</li>
                  <li>• Format and beautify SVG code</li>
                  <li>• Minify SVGs for production use</li>
                  <li>• Extract and display SVG metadata</li>
                  <li>• Upload and download SVG files</li>
                  <li>• Automatic validation feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Cases:
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• Clean up SVG exports from design tools</li>
                  <li>• Validate SVG syntax before deployment</li>
                  <li>• Optimize SVG files for web performance</li>
                  <li>• Preview SVG files without opening them</li>
                  <li>• Analyze SVG structure and properties</li>
                  <li>• Convert between formatted and minified SVG</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
