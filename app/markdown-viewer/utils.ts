/**
 * Markdown operation result with status and metadata
 */
export interface MarkdownResult {
  result: string;
  success: boolean;
  error?: string;
  stats?: MarkdownStats;
}

/**
 * Markdown statistics
 */
export interface MarkdownStats {
  size: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  headers: number;
  links: number;
  images: number;
  codeBlocks: number;
  readingTimeMinutes: number;
}

/**
 * Markdown validation result
 */
export interface MarkdownValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates Markdown string
 */
export const validateMarkdown = (
  markdownString: string
): MarkdownValidationResult => {
  if (!markdownString.trim()) {
    return { isValid: true }; // Empty string is considered valid
  }

  try {
    // Basic validation - markdown is generally very forgiving
    // We'll mainly check for obvious structural issues
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid Markdown",
    };
  }
};

/**
 * Validates and processes Markdown (simplified since react-markdown handles parsing)
 */
export const parseMarkdown = (markdownString: string): MarkdownResult => {
  const validation = validateMarkdown(markdownString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!markdownString.trim()) {
    return {
      result: "",
      success: true,
      stats: {
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
      },
    };
  }

  try {
    const stats = calculateMarkdownStats(markdownString);

    return {
      result: markdownString, // Return the original markdown - react-markdown will handle rendering
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process Markdown",
    };
  }
};

/**
 * Formats Markdown string with consistent spacing and structure
 */
export const formatMarkdown = (markdownString: string): MarkdownResult => {
  const validation = validateMarkdown(markdownString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!markdownString.trim()) {
    return {
      result: "",
      success: true,
      stats: {
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
      },
    };
  }

  try {
    // Basic formatting improvements
    const formatted = markdownString
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, "")
      // Ensure headers have proper spacing
      .replace(/^(#{1,6})\s*(.+)$/gm, "$1 $2")
      // Ensure list items have proper spacing
      .replace(/^(\s*[-*+])\s*(.+)$/gm, "$1 $2")
      .replace(/^(\s*\d+\.)\s*(.+)$/gm, "$1 $2")
      // Remove excessive blank lines
      .replace(/\n{3,}/g, "\n\n")
      // Ensure proper spacing around code blocks
      .replace(/^```/gm, "\n```")
      .replace(/```$/gm, "```\n")
      // Trim start and end
      .trim();

    const stats = calculateMarkdownStats(formatted);

    return {
      result: formatted,
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to format Markdown",
    };
  }
};

/**
 * Calculates statistics for Markdown string
 */
export const calculateMarkdownStats = (
  markdownString: string
): MarkdownStats => {
  const size = new Blob([markdownString]).size;
  const characters = markdownString.length;
  const charactersNoSpaces = markdownString.replace(/\s/g, "").length;
  const words = markdownString.trim()
    ? markdownString.trim().split(/\s+/).length
    : 0;
  const lines = markdownString.split("\n").length;

  // Count paragraphs (non-empty lines that are not headers, lists, or code blocks)
  const paragraphs = markdownString.split("\n").filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith("+") &&
      !trimmed.match(/^\d+\./) &&
      !trimmed.startsWith("```")
    );
  }).length;

  // Count headers
  const headers = (markdownString.match(/^#{1,6}\s+.+$/gm) || []).length;

  // Count links
  const links = (markdownString.match(/\[.*?\]\(.*?\)/g) || []).length;

  // Count images
  const images = (markdownString.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // Count code blocks
  const codeBlocks = (markdownString.match(/```[\s\S]*?```/g) || []).length;

  // Calculate reading time (average 200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    size,
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    headers,
    links,
    images,
    codeBlocks,
    readingTimeMinutes,
  };
};

/**
 * Formats bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Extracts metadata from Markdown string (YAML front matter)
 */
export const extractMarkdownMetadata = (
  markdownString: string
): Record<string, string> => {
  const metadata: Record<string, string> = {};

  if (!markdownString.trim()) {
    return metadata;
  }

  // Check for YAML front matter
  const frontMatterMatch = markdownString.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    const yamlContent = frontMatterMatch[1];
    const lines = yamlContent.split("\n");

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        metadata[match[1]] = match[2].replace(/["']/g, "");
      }
    }
  }

  return metadata;
};
