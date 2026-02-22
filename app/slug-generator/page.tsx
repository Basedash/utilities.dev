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
import { Switch } from "@/components/ui/switch";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import { Copy, Trash2 } from "lucide-react";
import { generateSlug, type SlugOptions } from "./utils";

export default function SlugGeneratorPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [options, setOptions] = useState<SlugOptions>({
    lowercase: true,
    removeDiacritics: true,
  });

  const handleGenerate = () => {
    setOutputText(generateSlug(inputText, options));
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
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 lg:grid-cols-2">
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
                Enter the text to convert into a URL-friendly slug
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="My Blog Post Title or Page Heading..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="cursor-pointer">
                    Lowercase
                  </Label>
                  <Switch
                    id="lowercase"
                    checked={options.lowercase ?? true}
                    onCheckedChange={(checked) =>
                      setOptions((o) => ({ ...o, lowercase: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="diacritics" className="cursor-pointer">
                    Remove diacritics
                  </Label>
                  <Switch
                    id="diacritics"
                    checked={options.removeDiacritics ?? true}
                    onCheckedChange={(checked) =>
                      setOptions((o) => ({ ...o, removeDiacritics: checked }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!inputText.trim()}
                className="w-full sm:w-auto"
              >
                Generate slug
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
                    onClick={() => handleCopy(outputText)}
                    disabled={!outputText}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                URL-friendly slug
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="output-text">Slug</Label>
                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted font-mono text-sm"
                  placeholder="Generated slug will appear here..."
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
