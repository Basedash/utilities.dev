"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";

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
import manifest from "./manifest";
import {
  formatSvg,
  minifySvg,
  validateSvg,
  formatBytes,
  extractSvgMetadata,
  SvgStats,
} from "./utils";

const EMPTY_SVG_STATS: SvgStats = {
  size: 0,
  elements: 0,
  hasScripts: false,
  hasStyles: false,
};

export default function SvgViewerPage() {
  const [inputSvg, setInputSvg] = useState("");
  const { isValid, errorMessage, stats, metadata } = useMemo(() => {
    if (!inputSvg.trim()) {
      return {
        isValid: null as boolean | null,
        errorMessage: "",
        stats: EMPTY_SVG_STATS,
        metadata: {} as Record<string, string>,
      };
    }

    const validation = validateSvg(inputSvg);
    if (!validation.isValid) {
      return {
        isValid: false,
        errorMessage: validation.error || "Invalid SVG",
        stats: EMPTY_SVG_STATS,
        metadata: {} as Record<string, string>,
      };
    }

    const result = formatSvg(inputSvg);
    return {
      isValid: true,
      errorMessage: "",
      stats: result.success && result.stats ? result.stats : EMPTY_SVG_STATS,
      metadata: extractSvgMetadata(inputSvg),
    };
  }, [inputSvg]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewSrc = useMemo(() => {
    if (!inputSvg.trim() || !isValid) return "";
    // Render SVG in an <img> data URL to avoid executing embedded scripts/events.
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inputSvg)}`;
  }, [inputSvg, isValid]);

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
        <UtilityPageHero manifest={manifest} />

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
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={previewSrc}
                        alt="SVG preview"
                        fill
                        unoptimized
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
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

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
