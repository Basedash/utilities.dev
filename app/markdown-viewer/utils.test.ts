import { describe, it, expect } from "vitest";
import {
  validateMarkdown,
  parseMarkdown,
  formatMarkdown,
  calculateMarkdownStats,
  formatBytes,
  extractMarkdownMetadata,
} from "./utils";

describe("Markdown Viewer Utils", () => {
  const validMarkdown = `# Hello World

This is a **bold** text and this is *italic*.

## Sub heading

- List item 1
- List item 2

[Link](https://example.com)

![Image](https://example.com/image.jpg)

\`\`\`javascript
console.log('Hello World');
\`\`\``;

  const markdownWithFrontMatter = `---
title: Test Document
author: John Doe
date: 2023-01-01
---

# Hello World

This is a test document.`;

  describe("validateMarkdown", () => {
    it("should validate correct Markdown", () => {
      const result = validateMarkdown(validMarkdown);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should handle empty string", () => {
      const result = validateMarkdown("");
      expect(result.isValid).toBe(true);
    });

    it("should handle malformed Markdown gracefully", () => {
      // Markdown is generally very forgiving, so most strings are valid
      const result = validateMarkdown("This is [broken markdown");
      expect(result.isValid).toBe(true);
    });
  });

  describe("parseMarkdown", () => {
    it("should process Markdown and return stats", () => {
      const result = parseMarkdown("# Hello World");
      expect(result.success).toBe(true);
      expect(result.result).toBe("# Hello World");
      expect(result.stats).toBeDefined();
      expect(result.stats?.words).toBeGreaterThan(0);
    });

    it("should handle empty string", () => {
      const result = parseMarkdown("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
      expect(result.stats?.words).toBe(0);
    });

    it("should process markdown with formatting", () => {
      const result = parseMarkdown("**bold** and *italic*");
      expect(result.success).toBe(true);
      expect(result.result).toBe("**bold** and *italic*");
      expect(result.stats).toBeDefined();
    });

    it("should process links", () => {
      const result = parseMarkdown("[Link](https://example.com)");
      expect(result.success).toBe(true);
      expect(result.result).toBe("[Link](https://example.com)");
      expect(result.stats?.links).toBe(1);
    });

    it("should process code blocks", () => {
      const result = parseMarkdown("```javascript\nconsole.log('test');\n```");
      expect(result.success).toBe(true);
      expect(result.result).toContain("```javascript");
      expect(result.stats?.codeBlocks).toBe(1);
    });
  });

  describe("formatMarkdown", () => {
    it("should format Markdown with proper spacing", () => {
      const messyMarkdown = "#  Heading  \n\n\n\nParagraph\n-  List item";
      const result = formatMarkdown(messyMarkdown);
      expect(result.success).toBe(true);
      expect(result.result).toContain("# Heading");
      expect(result.result).toContain("- List item");
      expect(result.result).not.toContain("\n\n\n");
    });

    it("should handle empty string", () => {
      const result = formatMarkdown("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });

    it("should normalize line endings", () => {
      const result = formatMarkdown("Line 1\r\nLine 2\rLine 3");
      expect(result.success).toBe(true);
      expect(result.result).toBe("Line 1\nLine 2\nLine 3");
    });
  });

  describe("calculateMarkdownStats", () => {
    it("should calculate correct stats", () => {
      const stats = calculateMarkdownStats(validMarkdown);

      expect(stats.size).toBeGreaterThan(0);
      expect(stats.characters).toBeGreaterThan(0);
      expect(stats.charactersNoSpaces).toBeGreaterThan(0);
      expect(stats.words).toBeGreaterThan(0);
      expect(stats.lines).toBeGreaterThan(0);
      expect(stats.headers).toBe(2); // # and ##
      expect(stats.links).toBe(2);
      expect(stats.images).toBe(1);
      expect(stats.codeBlocks).toBe(1);
      expect(stats.readingTimeMinutes).toBeGreaterThan(0);
    });

    it("should handle empty string", () => {
      const stats = calculateMarkdownStats("");
      expect(stats.size).toBe(0);
      expect(stats.characters).toBe(0);
      expect(stats.charactersNoSpaces).toBe(0);
      expect(stats.words).toBe(0);
      expect(stats.lines).toBe(1);
      expect(stats.headers).toBe(0);
      expect(stats.links).toBe(0);
      expect(stats.images).toBe(0);
      expect(stats.codeBlocks).toBe(0);
      expect(stats.readingTimeMinutes).toBe(1);
    });

    it("should count headers correctly", () => {
      const markdown = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6";
      const stats = calculateMarkdownStats(markdown);
      expect(stats.headers).toBe(6);
    });

    it("should count links and images separately", () => {
      const markdown = "[Link](url) ![Image](url) [Another Link](url)";
      const stats = calculateMarkdownStats(markdown);
      expect(stats.links).toBe(3);
      expect(stats.images).toBe(1);
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1536)).toBe("1.5 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1073741824)).toBe("1 GB");
    });
  });

  describe("extractMarkdownMetadata", () => {
    it("should extract YAML front matter", () => {
      const metadata = extractMarkdownMetadata(markdownWithFrontMatter);
      expect(metadata.title).toBe("Test Document");
      expect(metadata.author).toBe("John Doe");
      expect(metadata.date).toBe("2023-01-01");
    });

    it("should handle Markdown without front matter", () => {
      const metadata = extractMarkdownMetadata("# Just a heading");
      expect(Object.keys(metadata)).toHaveLength(0);
    });

    it("should handle empty string", () => {
      const metadata = extractMarkdownMetadata("");
      expect(Object.keys(metadata)).toHaveLength(0);
    });

    it("should handle quoted values", () => {
      const markdown = `---
title: "Quoted Title"
author: 'Single Quoted'
---

Content`;
      const metadata = extractMarkdownMetadata(markdown);
      expect(metadata.title).toBe("Quoted Title");
      expect(metadata.author).toBe("Single Quoted");
    });
  });
});
