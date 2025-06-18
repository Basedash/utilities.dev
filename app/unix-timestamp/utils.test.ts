import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  timestampToDate,
  dateToTimestamp,
  validateTimestamp,
  getCurrentTimestamp,
  getCurrentDateTime,
  formatTimestampWithTimezone,
  getRelativeTime,
} from "./utils";

describe("Unix Timestamp Utils", () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("timestampToDate", () => {
    test("converts Unix timestamp (seconds) to date string", () => {
      const result = timestampToDate("1705320000", false); // 2024-01-15 12:00:00
      expect(result.success).toBe(true);
      expect(result.result).toBe("2024-01-15 12:00:00");
    });

    test("converts Unix timestamp (milliseconds) to date string", () => {
      const result = timestampToDate("1705320000000", true); // 2024-01-15 12:00:00
      expect(result.success).toBe(true);
      expect(result.result).toBe("2024-01-15 12:00:00");
    });

    test("handles numeric input", () => {
      const result = timestampToDate(1705320000, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("2024-01-15 12:00:00");
    });

    test("handles invalid timestamp strings", () => {
      const result = timestampToDate("invalid", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid timestamp");
    });

    test("handles timestamps that are too large", () => {
      const result = timestampToDate("99999999999999", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Timestamp out of valid range");
    });

    test("handles negative timestamps", () => {
      const result = timestampToDate("-1", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Timestamp out of valid range");
    });

    test("converts epoch timestamp correctly", () => {
      const result = timestampToDate("0", false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1970-01-01 00:00:00");
    });
  });

  describe("dateToTimestamp", () => {
    test("converts ISO date string to Unix timestamp (seconds)", () => {
      const result = dateToTimestamp("2024-01-15 12:00:00", false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1705320000");
    });

    test("converts ISO date string to Unix timestamp (milliseconds)", () => {
      const result = dateToTimestamp("2024-01-15 12:00:00", true);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1705320000000");
    });

    test("handles various date formats", () => {
      const formats = [
        "2024-01-15T12:00:00Z",
        "2024-01-15T12:00:00.000Z",
        "Jan 15, 2024 12:00:00 GMT",
        "01/15/2024 12:00:00",
      ];

      formats.forEach((format) => {
        const result = dateToTimestamp(format, false);
        expect(result.success).toBe(true);
        expect(result.result).toBeTruthy();
      });
    });

    test("handles empty date string", () => {
      const result = dateToTimestamp("", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Date cannot be empty");
    });

    test("handles whitespace-only date string", () => {
      const result = dateToTimestamp("   ", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Date cannot be empty");
    });

    test("handles invalid date string", () => {
      const result = dateToTimestamp("invalid date", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid date format");
    });

    test("handles epoch date correctly", () => {
      const result = dateToTimestamp("1970-01-01 00:00:00", false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("0");
    });
  });

  describe("validateTimestamp", () => {
    test("validates correct timestamp strings", () => {
      const result = validateTimestamp("1705320000", false);
      expect(result.isValid).toBe(true);
      expect(result.timestamp).toBe(1705320000);
    });

    test("validates millisecond timestamps", () => {
      const result = validateTimestamp("1705320000000", true);
      expect(result.isValid).toBe(true);
      expect(result.timestamp).toBe(1705320000000);
    });

    test("rejects empty timestamps", () => {
      const result = validateTimestamp("", false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Timestamp cannot be empty");
    });

    test("rejects non-numeric timestamps", () => {
      const result = validateTimestamp("abc123", false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Timestamp must be a number");
    });

    test("rejects negative timestamps", () => {
      const result = validateTimestamp("-1", false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Timestamp cannot be negative");
    });

    test("rejects timestamps that are too large", () => {
      const result = validateTimestamp("99999999999999", false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Timestamp too large");
    });

    test("accepts zero timestamp", () => {
      const result = validateTimestamp("0", false);
      expect(result.isValid).toBe(true);
      expect(result.timestamp).toBe(0);
    });
  });

  describe("getCurrentTimestamp", () => {
    test("returns current timestamp in seconds", () => {
      const result = getCurrentTimestamp(false);
      expect(result).toBe("1705320000"); // Mock time: 2024-01-15 12:00:00
    });

    test("returns current timestamp in milliseconds", () => {
      const result = getCurrentTimestamp(true);
      expect(result).toBe("1705320000000"); // Mock time: 2024-01-15 12:00:00
    });
  });

  describe("getCurrentDateTime", () => {
    test("returns current date in ISO format", () => {
      const result = getCurrentDateTime();
      expect(result).toBe("2024-01-15 12:00:00");
    });
  });

  describe("formatTimestampWithTimezone", () => {
    test("formats timestamp with timezone information", () => {
      const result = formatTimestampWithTimezone("1705320000", false);
      expect(result.success).toBe(true);
      expect(result.result).toContain("2024");
      expect(result.result).toContain("01");
      expect(result.result).toContain("15");
    });

    test("handles invalid timestamps", () => {
      const result = formatTimestampWithTimezone("invalid", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid timestamp");
    });

    test("formats millisecond timestamps", () => {
      const result = formatTimestampWithTimezone("1705320000000", true);
      expect(result.success).toBe(true);
      expect(result.result).toContain("2024");
    });
  });

  describe("getRelativeTime", () => {
    test("calculates relative time for past timestamps", () => {
      // 1 hour ago from mocked current time
      const oneHourAgo = (1705320000 - 3600).toString();
      const result = getRelativeTime(oneHourAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1 hour ago");
    });

    test("calculates relative time for future timestamps", () => {
      // 1 hour in the future from mocked current time
      const oneHourFuture = (1705320000 + 3600).toString();
      const result = getRelativeTime(oneHourFuture, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("in 1 hour");
    });

    test("handles seconds correctly", () => {
      const thirtySecondsAgo = (1705320000 - 30).toString();
      const result = getRelativeTime(thirtySecondsAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("30 seconds ago");
    });

    test("handles minutes correctly", () => {
      const fiveMinutesAgo = (1705320000 - 300).toString();
      const result = getRelativeTime(fiveMinutesAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("5 minutes ago");
    });

    test("handles days correctly", () => {
      const twoDaysAgo = (1705320000 - 2 * 24 * 3600).toString();
      const result = getRelativeTime(twoDaysAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("2 days ago");
    });

    test("handles singular units correctly", () => {
      const oneMinuteAgo = (1705320000 - 60).toString();
      const result = getRelativeTime(oneMinuteAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1 minute ago");
    });

    test("handles millisecond timestamps", () => {
      const oneHourAgoMs = ((1705320000 - 3600) * 1000).toString();
      const result = getRelativeTime(oneHourAgoMs, true);
      expect(result.success).toBe(true);
      expect(result.result).toBe("1 hour ago");
    });

    test("handles invalid timestamps", () => {
      const result = getRelativeTime("invalid", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid timestamp");
    });

    test("handles very large time differences", () => {
      const twoYearsAgo = (1705320000 - 2 * 365 * 24 * 3600).toString();
      const result = getRelativeTime(twoYearsAgo, false);
      expect(result.success).toBe(true);
      expect(result.result).toBe("2 years ago");
    });
  });

  describe("round-trip conversions", () => {
    test("maintains data integrity through timestamp-date-timestamp cycle", () => {
      const originalTimestamps = [
        "0", // Epoch
        "1705320000", // 2024-01-15 12:00:00
        "2147483647", // Year 2038 problem edge case
        "946684800", // Year 2000
      ];

      originalTimestamps.forEach((original) => {
        const dateResult = timestampToDate(original, false);
        expect(dateResult.success).toBe(true);

        const backToTimestamp = dateToTimestamp(dateResult.result, false);
        expect(backToTimestamp.success).toBe(true);
        expect(backToTimestamp.result).toBe(original);
      });
    });

    test("maintains millisecond precision in round-trip", () => {
      const originalMs = "1705320000000";
      const dateResult = timestampToDate(originalMs, true);
      expect(dateResult.success).toBe(true);

      const backToTimestamp = dateToTimestamp(dateResult.result, true);
      expect(backToTimestamp.success).toBe(true);
      expect(backToTimestamp.result).toBe(originalMs);
    });
  });

  describe("edge cases and error handling", () => {
    test("handles boundary timestamp values", () => {
      // Test near the boundaries of valid range
      const nearMin = timestampToDate("1", false);
      expect(nearMin.success).toBe(true);

      const nearMax = timestampToDate("9999999999", false);
      expect(nearMax.success).toBe(true);
    });

    test("handles leap year dates correctly", () => {
      // February 29, 2024 (leap year)
      const leapYearDate = "2024-02-29 12:00:00";
      const result = dateToTimestamp(leapYearDate, false);
      expect(result.success).toBe(true);

      const backToDate = timestampToDate(result.result, false);
      expect(backToDate.success).toBe(true);
      expect(backToDate.result).toBe(leapYearDate);
    });

    test("handles daylight saving time transitions", () => {
      // This is a basic test - actual DST handling depends on system timezone
      const dstDate = "2024-03-10 02:00:00"; // Spring forward in US
      const result = dateToTimestamp(dstDate, false);
      expect(result.success).toBe(true);
      expect(result.result).toBeTruthy();
    });
  });
});
