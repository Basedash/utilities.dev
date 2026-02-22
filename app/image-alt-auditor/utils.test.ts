import { describe, test, expect } from "vitest";
import { auditImageAlt } from "./utils";

describe("image-alt-auditor utils", () => {
  describe("auditImageAlt", () => {
    test("returns empty result for no images", () => {
      const result = auditImageAlt("<p>No images</p>");
      expect(result.images).toEqual([]);
      expect(result.summary).toEqual({
        total: 0,
        ok: 0,
        missing: 0,
        empty: 0,
        suspicious: 0,
      });
    });

    test("flags missing alt", () => {
      const result = auditImageAlt('<img src="photo.jpg">');
      expect(result.images).toHaveLength(1);
      expect(result.images[0].status).toBe("missing");
      expect(result.images[0].message).toBe("Missing alt attribute");
      expect(result.summary.missing).toBe(1);
    });

    test("flags empty alt", () => {
      const result = auditImageAlt('<img src="deco.gif" alt="">');
      expect(result.images).toHaveLength(1);
      expect(result.images[0].status).toBe("empty");
      expect(result.images[0].message).toContain("Empty alt");
      expect(result.summary.empty).toBe(1);
    });

    test("accepts descriptive alt as ok", () => {
      const result = auditImageAlt(
        '<img src="chart.png" alt="Sales chart for Q4 2024">'
      );
      expect(result.images).toHaveLength(1);
      expect(result.images[0].status).toBe("ok");
      expect(result.summary.ok).toBe(1);
    });

    test("flags suspicious alt: image", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="image">');
      expect(result.images[0].status).toBe("suspicious");
      expect(result.summary.suspicious).toBe(1);
    });

    test("flags suspicious alt: photo", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="photo">');
      expect(result.images[0].status).toBe("suspicious");
    });

    test("flags suspicious alt: placeholder", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="placeholder">');
      expect(result.images[0].status).toBe("suspicious");
    });

    test("flags suspicious alt: image of", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="image of a cat">');
      expect(result.images[0].status).toBe("suspicious");
    });

    test("flags very short alt as suspicious", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="1">');
      expect(result.images[0].status).toBe("suspicious");
    });

    test("handles alt before src", () => {
      const result = auditImageAlt('<img alt="Description" src="pic.jpg">');
      expect(result.images).toHaveLength(1);
      expect(result.images[0].alt).toBe("Description");
      expect(result.images[0].src).toContain("pic.jpg");
    });

    test("handles multiple images with mixed status", () => {
      const html = `
        <img src="a.jpg">
        <img src="b.jpg" alt="">
        <img src="c.jpg" alt="image">
        <img src="d.jpg" alt="Proper description">
      `;
      const result = auditImageAlt(html);
      expect(result.images).toHaveLength(4);
      expect(result.summary.total).toBe(4);
      expect(result.summary.missing).toBe(1);
      expect(result.summary.empty).toBe(1);
      expect(result.summary.suspicious).toBe(1);
      expect(result.summary.ok).toBe(1);
    });

    test("truncates long src in output", () => {
      const longSrc = "a".repeat(80) + ".jpg";
      const result = auditImageAlt(`<img src="${longSrc}">`);
      expect(result.images[0].src.length).toBeLessThanOrEqual(64);
      expect(result.images[0].src).toContain("…");
    });

    test("handles single-quoted attributes", () => {
      const result = auditImageAlt("<img src='photo.png' alt='Chart'>");
      expect(result.images).toHaveLength(1);
      expect(result.images[0].alt).toBe("Chart");
      expect(result.images[0].status).toBe("ok");
    });

    test("handles self-closing img", () => {
      const result = auditImageAlt('<img src="x.jpg" alt="Product thumbnail" />');
      expect(result.images).toHaveLength(1);
      expect(result.images[0].status).toBe("ok");
    });

    test("empty input returns empty result", () => {
      const result = auditImageAlt("");
      expect(result.images).toEqual([]);
      expect(result.summary.total).toBe(0);
    });

    test("is deterministic for same input", () => {
      const html = '<img src="a.jpg" alt="Test">';
      const r1 = auditImageAlt(html);
      const r2 = auditImageAlt(html);
      expect(r1.summary).toEqual(r2.summary);
      expect(r1.images.map((i) => i.status)).toEqual(r2.images.map((i) => i.status));
    });
  });
});
