/**
 * SVG operation result with status and metadata
 */
export interface SvgResult {
  result: string;
  success: boolean;
  error?: string;
  stats?: SvgStats;
}

/**
 * SVG statistics
 */
export interface SvgStats {
  size: number;
  elements: number;
  viewBox?: string;
  dimensions?: { width: string; height: string };
  hasScripts: boolean;
  hasStyles: boolean;
}

/**
 * SVG validation result
 */
export interface SvgValidationResult {
  isValid: boolean;
  error?: string;
  parsedSvg?: Document;
}

/**
 * Validates SVG string
 */
export const validateSvg = (svgString: string): SvgValidationResult => {
  if (!svgString.trim()) {
    return { isValid: true }; // Empty string is considered valid (no SVG)
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");

    // Check for parsing errors
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return {
        isValid: false,
        error: "Invalid XML structure",
      };
    }

    // Check if root element is SVG
    const svgElement = doc.documentElement;
    if (svgElement.tagName.toLowerCase() !== "svg") {
      return {
        isValid: false,
        error: "Root element must be <svg>",
      };
    }

    return {
      isValid: true,
      parsedSvg: doc,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid SVG",
    };
  }
};

/**
 * Formats SVG string with proper indentation
 */
export const formatSvg = (svgString: string, spaces: number = 2): SvgResult => {
  const validation = validateSvg(svgString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!svgString.trim()) {
    return {
      result: "",
      success: true,
      stats: { size: 0, elements: 0, hasScripts: false, hasStyles: false },
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const serializer = new XMLSerializer();

    // Format XML with indentation
    const formatted = formatXmlString(
      serializer.serializeToString(doc),
      spaces
    );
    const stats = calculateSvgStats(formatted, doc);

    return {
      result: formatted,
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to format SVG",
    };
  }
};

/**
 * Minifies SVG string by removing unnecessary whitespace and formatting
 */
export const minifySvg = (svgString: string): SvgResult => {
  const validation = validateSvg(svgString);

  if (!validation.isValid) {
    return {
      result: "",
      success: false,
      error: validation.error,
    };
  }

  if (!svgString.trim()) {
    return {
      result: "",
      success: true,
      stats: { size: 0, elements: 0, hasScripts: false, hasStyles: false },
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const serializer = new XMLSerializer();

    // Minify by removing extra whitespace
    const minified = serializer
      .serializeToString(doc)
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();

    const stats = calculateSvgStats(minified, doc);

    return {
      result: minified,
      success: true,
      stats,
    };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to minify SVG",
    };
  }
};

/**
 * Calculates statistics for SVG string
 */
export const calculateSvgStats = (
  svgString: string,
  doc?: Document
): SvgStats => {
  const size = new Blob([svgString]).size;

  let elements = 0;
  let viewBox: string | undefined;
  let dimensions: { width: string; height: string } | undefined;
  let hasScripts = false;
  let hasStyles = false;

  if (doc) {
    elements = doc.querySelectorAll("*").length;

    const svgElement = doc.documentElement;
    viewBox = svgElement.getAttribute("viewBox") || undefined;

    const width = svgElement.getAttribute("width");
    const height = svgElement.getAttribute("height");
    if (width && height) {
      dimensions = { width, height };
    }

    hasScripts = doc.querySelectorAll("script").length > 0;
    hasStyles = doc.querySelectorAll("style").length > 0;
  }

  return {
    size,
    elements,
    viewBox,
    dimensions,
    hasScripts,
    hasStyles,
  };
};

/**
 * Formats file size in human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) return `${bytes} B`;

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Formats XML string with proper indentation
 */
const formatXmlString = (xml: string, spaces: number = 2): string => {
  const indent = " ".repeat(spaces);
  let formatted = "";
  let level = 0;

  // Remove existing whitespace between tags and normalize
  const normalized = xml.replace(/>\s+</g, "><").trim();
  const tokens = normalized.match(/(<\/?[^>]+>|[^<]+)/g) || [];

  for (const token of tokens) {
    if (token.match(/^<\/\w/)) {
      // Closing tag - decrease level first, then add indentation
      level = Math.max(0, level - 1);
      formatted += indent.repeat(level) + token + "\n";
    } else if (token.match(/^<\w[^>]*\/>$/)) {
      // Self-closing tag (ends with />)
      formatted += indent.repeat(level) + token + "\n";
    } else if (token.match(/^<\w[^>]*[^\/]>$/)) {
      // Opening tag (not self-closing, doesn't end with />)
      formatted += indent.repeat(level) + token + "\n";
      level++;
    } else if (token.trim()) {
      // Text content
      formatted += indent.repeat(level) + token.trim() + "\n";
    }
  }

  return formatted.trim();
};

/**
 * Extracts SVG metadata for display
 */
export const extractSvgMetadata = (
  svgString: string
): Record<string, string> => {
  const validation = validateSvg(svgString);
  if (!validation.isValid || !validation.parsedSvg) {
    return {};
  }

  const metadata: Record<string, string> = {};
  const svgElement = validation.parsedSvg.documentElement;

  // Extract common attributes
  const attributes = ["width", "height", "viewBox", "xmlns", "version"];
  attributes.forEach((attr) => {
    const value = svgElement.getAttribute(attr);
    if (value) {
      metadata[attr] = value;
    }
  });

  return metadata;
};
