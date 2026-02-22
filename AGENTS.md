# Metadata Standards

This section defines the canonical content strategy for utility manifests in `utilities.dev`.
It covers all SEO-facing copy: `description`, `seo.description`, `trustNote`, `howToSteps`, `about`, `useCases`, and `faqs`.

## Objectives

- Match high-intent developer queries with clear, useful answers.
- Keep metadata concise, specific, and aligned with actual tool behavior.
- Ensure on-page content and JSON-LD (`SoftwareApplication` + `FAQPage`) stay consistent.
- Improve trust by clearly stating local processing and security boundaries.

## Field-by-Field Standards

### `description`

- One sentence focused on primary utility intent.
- Use the main keyword naturally in the first half of the sentence.
- Keep copy specific to tool behavior, not generic product language.
- Target roughly 110-150 characters where possible.

### `seo.title`

- Format: `<Tool Name> | utilities.dev` or `<Tool Name> <Qualifier> | utilities.dev`.
- Include one high-value query term only when it improves clarity.
- Avoid title stuffing or repeating synonyms.

### `seo.description`

- One compact paragraph that mirrors user search intent.
- Include what the tool does + one key capability + trust context when relevant.
- Keep it unique per utility and aligned with real functionality.
- Target roughly 140-165 characters.

### `trustNote`

- Explicitly state browser-local processing when true.
- Clarify what the tool does not guarantee (for example: decoding is not verification).
- Keep language plain and confidence-building, not legalistic.
- 1 sentence, usually 90-150 characters.

### `howToSteps`

- Exactly 3 steps in imperative voice.
- Step 1: input/setup.
- Step 2: action/option selection.
- Step 3: output usage (copy, verify, export, integrate).
- Each step should be short, concrete, and skimmable.

### `about`

- 2 sentences preferred.
- Sentence 1: what problem this tool solves.
- Sentence 2: where it helps in real workflows or boundaries/limitations.
- Avoid generic marketing phrases.

### `useCases`

- Exactly 3 items.
- Each item should describe a concrete dev task, not a broad claim.
- Prefer action-oriented phrasing tied to real usage contexts.

## FAQ Standards

### FAQ count

- Exactly 4 FAQ items per utility.

### Required question intents

Each utility FAQ set should cover:

1. Core intent: what the tool does or when to use it.
2. Safety/trust boundary: local processing, verification limits, or privacy caveats.
3. Edge case/compatibility: formats, standards, runtime differences, or limits.
4. Practical troubleshooting: interpreting output, common mistakes, or choosing options.

### Question style

- Use natural query language developers search for:
  - "What is..."
  - "How do I..."
  - "Does this..."
  - "Can I..."
  - "Why does..."
- Keep questions specific and non-overlapping.

### Answer style

- 1-2 sentences.
- Start with a direct answer in sentence one.
- Add caveat or context in sentence two when useful.
- Plain text only (no markdown, lists, or links in answer strings).
- Every answer must stand alone in rich snippets.

## Quality Checklist

Before shipping any utility manifest update, confirm:

- Metadata is unique and tool-specific.
- `description` and `seo.description` are not duplicates unless justified.
- `trustNote` describes real processing/security boundaries.
- `howToSteps` are actionable and in the actual UI order.
- `about` and `useCases` reflect real developer workflows.
- FAQs are exactly 4 items with all required intent categories.
- No answer overpromises behavior not implemented in code.
