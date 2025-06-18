"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  FileText,
  Upload,
  Download,
  Wand2,
  BookOpen,
  Hash,
  Image as ImageIcon,
  Link,
  Code,
  Clock,
} from "lucide-react";
import {
  parseMarkdown,
  formatMarkdown,
  formatBytes,
  extractMarkdownMetadata,
  MarkdownStats,
} from "./utils";

export default function MarkdownViewerPage() {
  const [inputMarkdown, setInputMarkdown] = useState("");
  const [stats, setStats] = useState<MarkdownStats>({
    size: 0,
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    headers: 0,
    links: 0,
    images: 0,
    codeBlocks: 0,
    readingTimeMinutes: 0,
  });
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse and update when input changes
  useEffect(() => {
    if (!inputMarkdown.trim()) {
      setStats({
        size: 0,
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        headers: 0,
        links: 0,
        images: 0,
        codeBlocks: 0,
        readingTimeMinutes: 0,
      });
      setMetadata({});
      return;
    }

    const result = parseMarkdown(inputMarkdown);
    if (result.success && result.stats) {
      setStats(result.stats);
    }
    setMetadata(extractMarkdownMetadata(inputMarkdown));
  }, [inputMarkdown]);

  const handleFormat = () => {
    const result = formatMarkdown(inputMarkdown);
    if (result.success) {
      setInputMarkdown(result.result);
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
    setInputMarkdown("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputMarkdown(content);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exampleMarkdown = `# Welcome to Markdown Viewer

This is a **markdown viewer** that converts your *Markdown* text with live preview and beautiful styling.

## ✨ Key Features

- ✅ **Real-time preview** with proper styling
- ✅ **Syntax highlighting** for code blocks
- ✅ **Statistics and metadata** extraction
- ✅ **File upload and download** support
- ✅ **Formatting tools** for cleanup

## 🎯 Getting Started

### Numbered Lists
1. **Type** your markdown in the left panel
2. **Preview** appears instantly on the right
3. **Download** your content when ready

### Bullet Points
- Use \`-\`, \`*\`, or \`+\` for bullets
- Nest items with indentation
  - Like this nested item
  - And this one too
- Back to the main level

### Code Blocks

Here's a JavaScript example:

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
// Output: Hello, World!
\`\`\`

And some inline code: \`const x = 42;\`

### Links and References

- Check out the [Markdown Guide](https://www.markdownguide.org/)
- Visit [GitHub](https://github.com) for more projects
- Learn about [React](https://react.dev) components

### Blockquotes

> "The best way to learn markdown is to use it!"
>
> — Anonymous Developer

---

Happy writing! 🚀 **Enjoy the enhanced styling!**`;

  const loadExample = () => {
    setInputMarkdown(exampleMarkdown);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Markdown Viewer
          </h1>
          <p className="text-muted-foreground text-lg">
            Preview, format, and analyze Markdown files with real-time rendering
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Input Markdown
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown,.txt"
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
                    onClick={() =>
                      handleDownload(
                        inputMarkdown,
                        "document.md",
                        "text/markdown"
                      )
                    }
                    disabled={!inputMarkdown}
                    className="h-8 px-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFormat}
                    disabled={!inputMarkdown}
                    className="h-8 px-2"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(inputMarkdown)}
                    disabled={!inputMarkdown}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
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
                Type or paste Markdown content here, or upload a .md file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="markdown-input">Markdown Content</Label>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={loadExample}
                    className="h-auto p-0 text-xs"
                  >
                    Load example
                  </Button>
                </div>
                <Textarea
                  id="markdown-input"
                  placeholder="# Hello World&#10;&#10;Start typing your **Markdown** here..."
                  value={inputMarkdown}
                  onChange={(e) => setInputMarkdown(e.target.value)}
                  className="min-h-[400px] font-mono text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Preview
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(inputMarkdown)}
                    disabled={!inputMarkdown}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Live preview of your Markdown content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] border rounded-md p-4 bg-muted/10">
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        return !isInline ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match![1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {inputMarkdown || "Start typing your **Markdown** here..."}
                  </ReactMarkdown>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics and Metadata */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Document Statistics
              </CardTitle>
              <CardDescription>
                Detailed analysis of your Markdown content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Size</span>
                    <span className="text-sm font-medium">
                      {formatBytes(stats.size)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Characters
                    </span>
                    <span className="text-sm font-medium">
                      {stats.characters.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Characters (no spaces)
                    </span>
                    <span className="text-sm font-medium">
                      {stats.charactersNoSpaces.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Words</span>
                    <span className="text-sm font-medium">
                      {stats.words.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lines</span>
                    <span className="text-sm font-medium">
                      {stats.lines.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Paragraphs
                    </span>
                    <span className="text-sm font-medium">
                      {stats.paragraphs.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Headers
                    </span>
                    <span className="text-sm font-medium">
                      {stats.headers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      Links
                    </span>
                    <span className="text-sm font-medium">
                      {stats.links.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Images
                    </span>
                    <span className="text-sm font-medium">
                      {stats.images.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      Code Blocks
                    </span>
                    <span className="text-sm font-medium">
                      {stats.codeBlocks.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Reading Time
                    </span>
                    <span className="text-sm font-medium">
                      {stats.readingTimeMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Metadata
              </CardTitle>
              <CardDescription>
                Front matter and document properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(metadata).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground capitalize">
                        {key}
                      </span>
                      <Badge variant="secondary" className="max-w-[200px]">
                        <span className="truncate">{value}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No metadata found. Add YAML front matter to your Markdown
                  file:
                </p>
              )}
              {Object.keys(metadata).length === 0 && (
                <pre className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                  {`---
title: Document Title
author: Your Name
date: 2023-01-01
---`}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Markdown Viewer</CardTitle>
            <CardDescription>
              A comprehensive tool for viewing, editing, and analyzing Markdown
              files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Real-time HTML preview with syntax highlighting</li>
                <li>• Automatic Markdown formatting and cleanup</li>
                <li>• Comprehensive document statistics and analysis</li>
                <li>• YAML front matter metadata extraction</li>
                <li>• File upload and download support</li>
                <li>• Reading time estimation</li>
                <li>• HTML sanitization for security</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Preview README files and documentation</li>
                <li>• Edit and format Markdown blog posts</li>
                <li>• Analyze document structure and readability</li>
                <li>• Convert Markdown to HTML for web publishing</li>
                <li>• Validate Markdown syntax and structure</li>
                <li>• Extract metadata from documentation files</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Supported Syntax</h4>
              <p className="text-sm text-muted-foreground">
                This tool supports GitHub Flavored Markdown (GFM) including
                tables, task lists, strikethrough text, and syntax highlighting
                for code blocks. It also recognizes YAML front matter for
                metadata extraction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
