import { describe, test, expect } from "vitest";
import { analyzeLandmarks } from "./utils";

describe("landmark-role-checker utils", () => {
  describe("analyzeLandmarks", () => {
    test("empty input reports all elements missing", () => {
      const result = analyzeLandmarks("");
      const elements = result.landmarks.filter((l) => l.source === "element");
      expect(elements).toHaveLength(5);
      expect(elements.every((l) => l.status === "missing")).toBe(true);
      expect(result.summary.missing.length).toBeGreaterThan(0);
    });

    test("detects single header element", () => {
      const result = analyzeLandmarks("<header>Site header</header>");
      const header = result.landmarks.find(
        (l) => l.type === "header" && l.source === "element"
      );
      expect(header?.status).toBe("ok");
      expect(header?.count).toBe(1);
    });

    test("detects duplicate nav elements", () => {
      const result = analyzeLandmarks(
        "<nav>Main</nav><nav>Footer nav</nav>"
      );
      const nav = result.landmarks.find(
        (l) => l.type === "nav" && l.source === "element"
      );
      expect(nav?.status).toBe("duplicate");
      expect(nav?.count).toBe(2);
      expect(result.summary.duplicates).toContain("<nav>");
    });

    test("detects role attributes", () => {
      const result = analyzeLandmarks(
        '<div role="banner">Header</div><div role="main">Content</div>'
      );
      const banner = result.landmarks.find(
        (l) => l.type === "banner" && l.source === "aria"
      );
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "aria"
      );
      expect(banner?.status).toBe("ok");
      expect(banner?.count).toBe(1);
      expect(main?.status).toBe("ok");
      expect(main?.count).toBe(1);
    });

    test("detects duplicate role attributes", () => {
      const result = analyzeLandmarks(
        '<div role="navigation">A</div><div role="navigation">B</div>'
      );
      const nav = result.landmarks.find(
        (l) => l.type === "navigation" && l.source === "aria"
      );
      expect(nav?.status).toBe("duplicate");
      expect(nav?.count).toBe(2);
    });

    test("handles role with extra spaces", () => {
      const result = analyzeLandmarks('  <div role  =  "main"  ></div>');
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "aria"
      );
      expect(main?.count).toBe(1);
    });

    test("handles single-quoted role", () => {
      const result = analyzeLandmarks("<div role='banner'></div>");
      const banner = result.landmarks.find(
        (l) => l.type === "banner" && l.source === "aria"
      );
      expect(banner?.count).toBe(1);
    });

    test("full page structure passes element check", () => {
      const html = `
        <header><h1>Site</h1></header>
        <nav><a href="/">Home</a></nav>
        <main><p>Content</p></main>
        <footer><p>© 2024</p></footer>
      `;
      const result = analyzeLandmarks(html);
      const elements = result.landmarks.filter((l) => l.source === "element");
      expect(elements.find((l) => l.type === "header")?.status).toBe("ok");
      expect(elements.find((l) => l.type === "nav")?.status).toBe("ok");
      expect(elements.find((l) => l.type === "main")?.status).toBe("ok");
      expect(elements.find((l) => l.type === "footer")?.status).toBe("ok");
    });

    test("does not match data-role or role inside other attribute values", () => {
      const result = analyzeLandmarks(
        '<div data-role="main">x</div>'
      );
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "aria"
      );
      expect(main?.count).toBe(0);
    });

    test("matches role when it is the full value", () => {
      const result = analyzeLandmarks('<div role="main">x</div>');
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "aria"
      );
      expect(main?.count).toBe(1);
    });

    test("does not match partial role value", () => {
      const result = analyzeLandmarks('<div role="main-content">x</div>');
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "aria"
      );
      expect(main?.count).toBe(0);
    });

    test("summary.present counts landmarks with count > 0", () => {
      const result = analyzeLandmarks(
        "<header></header><nav></nav><main></main>"
      );
      expect(result.summary.present).toBeGreaterThanOrEqual(3);
    });

    test("is deterministic for same input", () => {
      const html = "<header></header><main></main>";
      const r1 = analyzeLandmarks(html);
      const r2 = analyzeLandmarks(html);
      expect(r1.summary).toEqual(r2.summary);
      expect(r1.landmarks.map((l) => l.count)).toEqual(
        r2.landmarks.map((l) => l.count)
      );
    });

    test("handles self-closing-like element names in content", () => {
      const result = analyzeLandmarks(
        "<main><p>Use &lt;header&gt; here</p></main>"
      );
      const main = result.landmarks.find(
        (l) => l.type === "main" && l.source === "element"
      );
      expect(main?.count).toBe(1);
    });
  });
});
