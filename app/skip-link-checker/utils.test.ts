import { describe, test, expect } from "vitest";
import {
  checkSkipLinks,
  extractSkipLinks,
  extractTargets,
} from "./utils";

describe("skip-link-checker utils", () => {
  describe("extractSkipLinks", () => {
    test("extracts href=#main", () => {
      const html = '<a href="#main">Skip to main</a>';
      const links = extractSkipLinks(html);
      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("#main");
      expect(links[0].targetId).toBe("main");
    });

    test("extracts href=#content", () => {
      const html = '<a href="#content" class="skip">Skip</a>';
      const links = extractSkipLinks(html);
      expect(links).toHaveLength(1);
      expect(links[0].targetId).toBe("content");
    });

    test("ignores external links", () => {
      const html = '<a href="https://example.com#section">Link</a>';
      expect(extractSkipLinks(html)).toHaveLength(0);
    });

    test("ignores links without hash", () => {
      const html = '<a href="/page">Link</a>';
      expect(extractSkipLinks(html)).toHaveLength(0);
    });

    test("extracts multiple skip links", () => {
      const html = `
        <a href="#main">Skip to main</a>
        <a href="#nav">Skip to nav</a>
      `;
      const links = extractSkipLinks(html);
      expect(links).toHaveLength(2);
      expect(links.map((l) => l.targetId)).toContain("main");
      expect(links.map((l) => l.targetId)).toContain("nav");
    });

    test("includes line number", () => {
      const html = "line1\n<a href=\"#main\">Skip</a>";
      const links = extractSkipLinks(html);
      expect(links[0].line).toBe(2);
    });
  });

  describe("extractTargets", () => {
    test("extracts element with id", () => {
      const html = '<main id="main">Content</main>';
      const targets = extractTargets(html);
      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe("main");
      expect(targets[0].tagName).toBe("main");
    });

    test("extracts div with id", () => {
      const html = '<div id="content">...</div>';
      const targets = extractTargets(html);
      expect(targets[0].id).toBe("content");
    });

    test("extracts multiple targets", () => {
      const html = '<main id="main"></main><nav id="nav"></nav>';
      const targets = extractTargets(html);
      expect(targets).toHaveLength(2);
    });

    test("returns empty for no ids", () => {
      const html = "<div>no id</div>";
      expect(extractTargets(html)).toHaveLength(0);
    });
  });

  describe("checkSkipLinks", () => {
    test("valid when skip link has matching target", () => {
      const html = `
        <a href="#main">Skip to main</a>
        <main id="main">Content</main>
      `;
      const result = checkSkipLinks(html);
      expect(result.valid).toBe(true);
      expect(result.skipLinks).toHaveLength(1);
      expect(result.targets).toHaveLength(1);
      expect(result.orphanedSkipLinks).toHaveLength(0);
      expect(result.missingTargets).toHaveLength(0);
    });

    test("invalid when skip link has no matching target", () => {
      const html = '<a href="#main">Skip to main</a>';
      const result = checkSkipLinks(html);
      expect(result.valid).toBe(false);
      expect(result.orphanedSkipLinks).toHaveLength(1);
      expect(result.missingTargets).toContain("main");
    });

    test("invalid when target id does not exist", () => {
      const html = `
        <a href="#content">Skip</a>
        <main id="main">Content</main>
      `;
      const result = checkSkipLinks(html);
      expect(result.valid).toBe(false);
      expect(result.missingTargets).toContain("content");
    });

    test("valid with multiple skip links and targets", () => {
      const html = `
        <a href="#main">Skip to main</a>
        <a href="#nav">Skip to nav</a>
        <nav id="nav">Nav</nav>
        <main id="main">Main</main>
      `;
      const result = checkSkipLinks(html);
      expect(result.valid).toBe(true);
      expect(result.skipLinks).toHaveLength(2);
      expect(result.orphanedSkipLinks).toHaveLength(0);
    });

    test("deduplicates missing targets", () => {
      const html = `
        <a href="#missing">Skip 1</a>
        <a href="#missing">Skip 2</a>
      `;
      const result = checkSkipLinks(html);
      expect(result.missingTargets).toEqual(["missing"]);
    });
  });

  describe("determinism", () => {
    test("same input produces same output", () => {
      const html = '<a href="#main">Skip</a><main id="main">x</main>';
      const r1 = checkSkipLinks(html);
      const r2 = checkSkipLinks(html);
      expect(r1.valid).toBe(r2.valid);
      expect(r1.skipLinks).toEqual(r2.skipLinks);
      expect(r1.orphanedSkipLinks).toEqual(r2.orphanedSkipLinks);
    });

    test("empty input returns valid", () => {
      const result = checkSkipLinks("");
      expect(result.valid).toBe(true);
      expect(result.skipLinks).toHaveLength(0);
    });
  });
});
