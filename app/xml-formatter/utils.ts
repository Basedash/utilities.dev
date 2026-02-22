export interface XmlResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Validates XML string using DOMParser.
 */
export function validateXml(xmlString: string): { isValid: boolean; error?: string } {
  if (!xmlString.trim()) {
    return { isValid: true };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    const message = parseError.textContent?.trim() || "Invalid XML";
    return { isValid: false, error: message };
  }

  return { isValid: true };
}

/**
 * Formats XML string with indentation for readability.
 */
export function formatXml(xmlString: string, indentSpaces: number = 2): XmlResult {
  const validation = validateXml(xmlString);
  if (!validation.isValid) {
    return { result: "", success: false, error: validation.error };
  }

  if (!xmlString.trim()) {
    return { result: "", success: true };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    const serializer = new XMLSerializer();
    const serialized = serializer.serializeToString(doc);
    const formatted = addIndentation(serialized, indentSpaces);
    return { result: formatted, success: true };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to format XML",
    };
  }
}

/**
 * Minifies XML by removing unnecessary whitespace.
 */
export function minifyXml(xmlString: string): XmlResult {
  const validation = validateXml(xmlString);
  if (!validation.isValid) {
    return { result: "", success: false, error: validation.error };
  }

  if (!xmlString.trim()) {
    return { result: "", success: true };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    const serializer = new XMLSerializer();
    const serialized = serializer.serializeToString(doc);
    const minified = serialized
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ")
      .trim();
    return { result: minified, success: true };
  } catch (error) {
    return {
      result: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to minify XML",
    };
  }
}

/**
 * Adds indentation to serialized XML string.
 */
function addIndentation(xml: string, spaces: number): string {
  const indent = " ".repeat(spaces);
  let formatted = "";
  let depth = 0;
  const parts = xml.split(/(<[^>]+>)/g).filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isTag = part.startsWith("<");
    const isClosing = part.startsWith("</");
    const isSelfClosing = part.endsWith("/>");
    const isDeclaration = part.startsWith("<?");
    const isComment = part.startsWith("<!--");

    if (isDeclaration || isComment) {
      formatted += (formatted.endsWith("\n") ? "" : "\n") + part + "\n";
      continue;
    }

    if (isTag) {
      if (isClosing) {
        depth = Math.max(0, depth - 1);
        formatted += indent.repeat(depth) + part + "\n";
      } else if (isSelfClosing) {
        formatted += indent.repeat(depth) + part + "\n";
      } else {
        formatted += indent.repeat(depth) + part + "\n";
        depth++;
      }
    } else if (part.trim()) {
      formatted += indent.repeat(depth) + part + "\n";
    }
  }

  return formatted.trim();
}
