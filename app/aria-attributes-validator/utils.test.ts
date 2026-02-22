import { describe, test, expect } from "vitest";
import {
  validateAriaAttributes,
  extractAriaAttributes,
  VALID_ARIA_ATTRIBUTES,
} from "./utils";

describe("aria-attributes-validator utils", () => {
  describe("extractAriaAttributes", () => {
    test("extracts single aria attribute", () => {
      const html = '<button aria-label="Close">X</button>';
      const attrs = extractAriaAttributes(html);
      expect(attrs).toHaveLength(1);
      expect(attrs[0].name).toBe("aria-label");
      expect(attrs[0].value).toBe("Close");
    });

    test("extracts multiple aria attributes", () => {
      const html = '<div aria-expanded="true" aria-controls="menu">Menu</div>';
      const attrs = extractAriaAttributes(html);
      expect(attrs).toHaveLength(2);
      expect(attrs.map((a) => a.name)).toContain("aria-expanded");
      expect(attrs.map((a) => a.name)).toContain("aria-controls");
    });

    test("normalizes attribute names to lowercase", () => {
      const html = '<div ARIA-LABEL="test">x</div>';
      const attrs = extractAriaAttributes(html);
      expect(attrs[0].name).toBe("aria-label");
    });

    test("returns empty array for no aria attributes", () => {
      const html = "<div class='foo'>content</div>";
      expect(extractAriaAttributes(html)).toHaveLength(0);
    });

    test("includes line number", () => {
      const html = "line1\n<button aria-label='x'>y</button>";
      const attrs = extractAriaAttributes(html);
      expect(attrs[0].line).toBe(2);
    });
  });

  describe("validateAriaAttributes - invalid attributes", () => {
    test("flags invalid aria attribute", () => {
      const result = validateAriaAttributes('<div aria-foo="bar">x</div>');
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe("invalid-attribute");
      expect(result.issues[0].message).toContain("aria-foo");
    });

    test("flags aria-typo (common typo)", () => {
      const result = validateAriaAttributes('<div aria-lable="x">y</div>');
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.type === "invalid-attribute")).toBe(true);
    });

    test("accepts valid aria-label", () => {
      const result = validateAriaAttributes('<button aria-label="Submit">Submit</button>');
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    test("accepts valid aria-describedby", () => {
      const result = validateAriaAttributes('<input aria-describedby="hint" id="x" />');
      expect(result.valid).toBe(true);
    });
  });

  describe("validateAriaAttributes - malformed ID refs", () => {
    test("flags malformed aria-labelledby with invalid chars", () => {
      const result = validateAriaAttributes('<div aria-labelledby="id with spaces!">x</div>');
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.type === "malformed-id-ref")).toBe(true);
    });

    test("accepts valid aria-labelledby with single id", () => {
      const result = validateAriaAttributes('<div aria-labelledby="heading1">x</div>');
      expect(result.valid).toBe(true);
    });

    test("accepts valid aria-labelledby with multiple ids", () => {
      const result = validateAriaAttributes('<div aria-labelledby="id1 id2 id3">x</div>');
      expect(result.valid).toBe(true);
    });

    test("accepts ids with hyphen and underscore", () => {
      const result = validateAriaAttributes('<div aria-labelledby="my-id_123">x</div>');
      expect(result.valid).toBe(true);
    });

    test("accepts empty aria-describedby (no description)", () => {
      const result = validateAriaAttributes('<div aria-describedby="">x</div>');
      expect(result.valid).toBe(true);
    });
  });

  describe("validateAriaAttributes - role label mismatch", () => {
    test("flags role=button without label", () => {
      const result = validateAriaAttributes('<div role="button">x</div>');
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.type === "role-label-mismatch")).toBe(true);
    });

    test("accepts role=button with aria-label", () => {
      const result = validateAriaAttributes('<div role="button" aria-label="Close">x</div>');
      expect(result.valid).toBe(true);
    });

    test("accepts role=button with aria-labelledby", () => {
      const result = validateAriaAttributes('<div role="button" aria-labelledby="btn-text">x</div>');
      expect(result.valid).toBe(true);
    });

    test("flags role=checkbox without label", () => {
      const result = validateAriaAttributes('<div role="checkbox">x</div>');
      expect(result.valid).toBe(false);
    });

    test("accepts role=banner without label (not in required set)", () => {
      const result = validateAriaAttributes('<header role="banner">Site header</header>');
      expect(result.valid).toBe(true);
    });
  });

  describe("determinism", () => {
    test("same input produces same output", () => {
      const html = '<div aria-foo="x" role="button">y</div>';
      const r1 = validateAriaAttributes(html);
      const r2 = validateAriaAttributes(html);
      expect(r1.issues).toEqual(r2.issues);
      expect(r1.valid).toBe(r2.valid);
    });

    test("empty input returns valid", () => {
      const result = validateAriaAttributes("");
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe("VALID_ARIA_ATTRIBUTES", () => {
    test("contains common attributes", () => {
      expect(VALID_ARIA_ATTRIBUTES.has("aria-label")).toBe(true);
      expect(VALID_ARIA_ATTRIBUTES.has("aria-labelledby")).toBe(true);
      expect(VALID_ARIA_ATTRIBUTES.has("aria-describedby")).toBe(true);
      expect(VALID_ARIA_ATTRIBUTES.has("aria-expanded")).toBe(true);
      expect(VALID_ARIA_ATTRIBUTES.has("aria-hidden")).toBe(true);
    });
  });
});
