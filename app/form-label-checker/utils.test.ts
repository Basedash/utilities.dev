import { describe, test, expect } from "vitest";
import { checkFormLabels } from "./utils";

describe("form-label-checker utils", () => {
  describe("checkFormLabels", () => {
    test("returns empty findings for empty input", () => {
      const result = checkFormLabels("");
      expect(result.findings).toEqual([]);
      expect(result.summary).toEqual({ total: 0, errors: 0, warnings: 0 });
    });

    test("detects input missing label", () => {
      const html = '<input type="text" id="email">';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0]).toMatchObject({
        type: "missing-label",
        severity: "error",
        message: expect.stringContaining("no associated label"),
      });
    });

    test("passes when label is associated via for", () => {
      const html = '<label for="email">Email</label><input type="text" id="email">';
      const result = checkFormLabels(html);
      expect(result.findings.filter((f) => f.type === "missing-label")).toHaveLength(0);
    });

    test("passes when input has aria-label", () => {
      const html = '<input type="text" aria-label="Email address">';
      const result = checkFormLabels(html);
      expect(result.findings.filter((f) => f.type === "missing-label")).toHaveLength(0);
    });

    test("passes when input has aria-labelledby", () => {
      const html = '<span id="lbl">Email</span><input type="text" aria-labelledby="lbl">';
      const result = checkFormLabels(html);
      expect(result.findings.filter((f) => f.type === "missing-label")).toHaveLength(0);
    });

    test("ignores hidden inputs", () => {
      const html = '<input type="hidden" id="token" value="x">';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(0);
    });

    test("ignores submit and button type inputs", () => {
      const html = '<input type="submit" value="Send">';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(0);
    });

    test("detects select missing label", () => {
      const html = '<select id="country"><option>US</option></select>';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("missing-label");
    });

    test("detects textarea missing label", () => {
      const html = '<textarea id="msg"></textarea>';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0].type).toBe("missing-label");
    });

    test("detects duplicate IDs", () => {
      const html = '<input type="text" id="x"><input type="text" id="x">';
      const result = checkFormLabels(html);
      const dup = result.findings.find((f) => f.type === "duplicate-id");
      expect(dup).toBeDefined();
      expect(dup?.message).toContain("Duplicate id");
      expect(dup?.id).toBe("x");
    });

    test("detects unlabeled button", () => {
      const html = '<button><span class="icon"></span></button>';
      const result = checkFormLabels(html);
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0]).toMatchObject({
        type: "unlabeled-button",
        severity: "error",
      });
    });

    test("passes button with text", () => {
      const html = '<button>Submit</button>';
      const result = checkFormLabels(html);
      expect(result.findings.filter((f) => f.type === "unlabeled-button")).toHaveLength(0);
    });

    test("passes button with aria-label", () => {
      const html = '<button aria-label="Close dialog"><span class="icon"></span></button>';
      const result = checkFormLabels(html);
      expect(result.findings.filter((f) => f.type === "unlabeled-button")).toHaveLength(0);
    });

    test("summary counts are correct", () => {
      const html = `
        <input type="text" id="a">
        <input type="text" id="a">
        <button></button>
      `;
      const result = checkFormLabels(html);
      expect(result.summary.total).toBeGreaterThanOrEqual(3);
      expect(result.summary.errors).toBe(result.summary.total);
    });

    test("is deterministic for same input", () => {
      const html = '<input type="text" id="x">';
      const a = checkFormLabels(html);
      const b = checkFormLabels(html);
      expect(a.findings).toEqual(b.findings);
      expect(a.summary).toEqual(b.summary);
    });
  });
});
