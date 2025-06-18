import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock clipboard API for tests
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock document.execCommand for fallback clipboard functionality
document.execCommand = vi.fn(() => true);
