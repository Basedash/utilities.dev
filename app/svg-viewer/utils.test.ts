import { describe, it, expect } from "vitest";
import {
  validateSvg,
  formatSvg,
  minifySvg,
  calculateSvgStats,
  formatBytes,
  extractSvgMetadata,
} from "./utils";

describe("SVG Viewer Utils", () => {
  const validSvg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="red"/>
</svg>`;

  const invalidSvg = `<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="red"
</svg>`;

  describe("validateSvg", () => {
    it("should validate correct SVG", () => {
      const result = validateSvg(validSvg);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.parsedSvg).toBeDefined();
    });

    it("should reject invalid XML", () => {
      const result = validateSvg(invalidSvg);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject non-SVG root element", () => {
      const result = validateSvg("<div>not svg</div>");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Root element must be <svg>");
    });

    it("should handle empty string", () => {
      const result = validateSvg("");
      expect(result.isValid).toBe(true);
    });
  });

  describe("formatSvg", () => {
    it("should format SVG with proper indentation", () => {
      const result = formatSvg(validSvg);
      expect(result.success).toBe(true);
      expect(result.result).toContain("  <circle");
      expect(result.stats).toBeDefined();
    });

    it("should handle invalid SVG", () => {
      const result = formatSvg(invalidSvg);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle empty string", () => {
      const result = formatSvg("");
      expect(result.success).toBe(true);
      expect(result.result).toBe("");
    });
  });

  describe("minifySvg", () => {
    it("should minify SVG by removing whitespace", () => {
      const result = minifySvg(validSvg);
      expect(result.success).toBe(true);
      expect(result.result.length).toBeLessThan(validSvg.length);
      expect(result.result).not.toContain("\n  ");
      expect(result.stats).toBeDefined();
    });

    it("should handle invalid SVG", () => {
      const result = minifySvg(invalidSvg);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("calculateSvgStats", () => {
    it("should calculate correct stats", () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(validSvg, "image/svg+xml");
      const stats = calculateSvgStats(validSvg, doc);

      expect(stats.size).toBeGreaterThan(0);
      expect(stats.elements).toBeGreaterThan(0);
      expect(stats.viewBox).toBe("0 0 100 100");
      expect(stats.dimensions).toEqual({ width: "100", height: "100" });
      expect(stats.hasScripts).toBe(false);
      expect(stats.hasStyles).toBe(false);
    });

    it("should detect scripts and styles", () => {
      const svgWithScriptAndStyle = `<svg xmlns="http://www.w3.org/2000/svg">
        <style>circle { fill: red; }</style>
        <script>console.log('test');</script>
        <circle cx="50" cy="50" r="40"/>
      </svg>`;

      const parser = new DOMParser();
      const doc = parser.parseFromString(
        svgWithScriptAndStyle,
        "image/svg+xml"
      );
      const stats = calculateSvgStats(svgWithScriptAndStyle, doc);

      expect(stats.hasScripts).toBe(true);
      expect(stats.hasStyles).toBe(true);
    });
  });

  describe("formatBytes", () => {
    it("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(1024)).toBe("1.0 KB");
      expect(formatBytes(1536)).toBe("1.5 KB");
      expect(formatBytes(1048576)).toBe("1.0 MB");
    });
  });

  describe("extractSvgMetadata", () => {
    it("should extract SVG metadata", () => {
      const metadata = extractSvgMetadata(validSvg);
      expect(metadata.width).toBe("100");
      expect(metadata.height).toBe("100");
      expect(metadata.viewBox).toBe("0 0 100 100");
      expect(metadata.xmlns).toBe("http://www.w3.org/2000/svg");
    });

    it("should handle invalid SVG", () => {
      const metadata = extractSvgMetadata(invalidSvg);
      expect(Object.keys(metadata)).toHaveLength(0);
    });

    it("should handle empty string", () => {
      const metadata = extractSvgMetadata("");
      expect(Object.keys(metadata)).toHaveLength(0);
    });
  });
});
