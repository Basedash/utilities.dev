import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  parseCronExpression,
  getFieldValue,
  parseField,
  validateCronField,
  validateCronExpression,
  describeCronField,
  describeCronExpression,
  calculateNextExecutions,
  getCommonCronExamples,
  CRON_RANGES,
  MONTH_NAMES,
  DAY_NAMES,
} from "./utils";

describe("Cron Parser Utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("parseCronExpression", () => {
    test("parses 5-part cron expressions correctly", () => {
      const result = parseCronExpression("0 9 * * 1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        minute: "0",
        hour: "9",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "1",
      });
    });

    test("parses 6-part cron expressions correctly", () => {
      const result = parseCronExpression("0 0 9 * * 1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        second: "0",
        minute: "0",
        hour: "9",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "1",
      });
    });

    test("handles expressions with extra whitespace", () => {
      const result = parseCronExpression("  0   9   *   *   1  ");
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        minute: "0",
        hour: "9",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "1",
      });
    });

    test("rejects invalid number of parts", () => {
      const result = parseCronExpression("0 9 * *");
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Invalid cron format. Expected 5 or 6 parts, got 4"
      );
    });

    test("rejects empty expressions", () => {
      const result = parseCronExpression("");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Expression must be a non-empty string");
    });

    test("rejects non-string input", () => {
      const result = parseCronExpression(null as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Expression must be a non-empty string");
    });

    test("rejects whitespace-only expressions", () => {
      const result = parseCronExpression("   ");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Expression cannot be empty");
    });
  });

  describe("getFieldValue", () => {
    test("returns numeric value for numeric strings", () => {
      expect(getFieldValue("5")).toBe(5);
      expect(getFieldValue("23")).toBe(23);
    });

    test("returns -1 for invalid numeric strings", () => {
      expect(getFieldValue("abc")).toBe(-1);
      expect(getFieldValue("")).toBe(-1);
    });

    test("converts month names to numbers", () => {
      expect(getFieldValue("JAN", CRON_RANGES.month.names, 1)).toBe(1);
      expect(getFieldValue("DEC", CRON_RANGES.month.names, 1)).toBe(12);
      expect(getFieldValue("jan", CRON_RANGES.month.names, 1)).toBe(1); // case insensitive
    });

    test("converts day names to numbers", () => {
      expect(getFieldValue("SUN", CRON_RANGES.dayOfWeek.names, 0)).toBe(0);
      expect(getFieldValue("MON", CRON_RANGES.dayOfWeek.names, 0)).toBe(1);
      expect(getFieldValue("sat", CRON_RANGES.dayOfWeek.names, 0)).toBe(6);
    });

    test("returns -1 for invalid names", () => {
      expect(getFieldValue("INVALID", CRON_RANGES.month.names, 1)).toBe(-1);
    });
  });

  describe("parseField", () => {
    test("parses wildcard fields", () => {
      const result = parseField("*", 0, 59);
      expect(result).toEqual(Array.from({ length: 60 }, (_, i) => i));
    });

    test("parses comma-separated values", () => {
      const result = parseField("1,3,5", 0, 59);
      expect(result).toEqual([1, 3, 5]);
    });

    test("parses ranges", () => {
      const result = parseField("1-5", 0, 59);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test("parses step values", () => {
      const result = parseField("*/5", 0, 59);
      expect(result).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    });

    test("parses range with step", () => {
      const result = parseField("1-10/2", 0, 59);
      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    test("handles single values", () => {
      const result = parseField("15", 0, 59);
      expect(result).toEqual([15]);
    });

    test("handles complex combinations", () => {
      const result = parseField("1,5-7,*/10", 0, 59);
      expect(result).toEqual([0, 1, 5, 6, 7, 10, 20, 30, 40, 50]);
    });

    test("filters out invalid values", () => {
      const result = parseField("5,abc,10", 0, 59);
      expect(result).toEqual([5, 10]);
    });
  });

  describe("validateCronField", () => {
    test("validates minute fields", () => {
      expect(validateCronField("0", "minute")).toBe(true);
      expect(validateCronField("59", "minute")).toBe(true);
      expect(validateCronField("*/5", "minute")).toBe(true);
      expect(validateCronField("0-30", "minute")).toBe(true);
      expect(validateCronField("60", "minute")).toBe(false);
      expect(validateCronField("-1", "minute")).toBe(false);
    });

    test("validates hour fields", () => {
      expect(validateCronField("0", "hour")).toBe(true);
      expect(validateCronField("23", "hour")).toBe(true);
      expect(validateCronField("24", "hour")).toBe(false);
    });

    test("validates month fields with names", () => {
      expect(validateCronField("JAN", "month")).toBe(true);
      expect(validateCronField("DEC", "month")).toBe(true);
      expect(validateCronField("1", "month")).toBe(true);
      expect(validateCronField("12", "month")).toBe(true);
      expect(validateCronField("13", "month")).toBe(false);
      expect(validateCronField("INVALID", "month")).toBe(false);
    });

    test("validates day of week fields", () => {
      expect(validateCronField("SUN", "dayOfWeek")).toBe(true);
      expect(validateCronField("MON", "dayOfWeek")).toBe(true);
      expect(validateCronField("0", "dayOfWeek")).toBe(true);
      expect(validateCronField("6", "dayOfWeek")).toBe(true);
      expect(validateCronField("7", "dayOfWeek")).toBe(false);
    });

    test("validates complex field expressions", () => {
      expect(validateCronField("1,15,30", "minute")).toBe(true);
      expect(validateCronField("9-17", "hour")).toBe(true);
      expect(validateCronField("*/2", "hour")).toBe(true);
      expect(validateCronField("1-5/2", "dayOfWeek")).toBe(true);
    });
  });

  describe("validateCronExpression", () => {
    test("validates correct 5-part expressions", () => {
      expect(validateCronExpression("0 9 * * 1")).toBe(true);
      expect(validateCronExpression("*/5 9-17 * * MON-FRI")).toBe(true);
      expect(validateCronExpression("0 0 1 * *")).toBe(true);
    });

    test("validates correct 6-part expressions", () => {
      expect(validateCronExpression("0 0 9 * * 1")).toBe(true);
      expect(validateCronExpression("*/30 */5 9-17 * * MON-FRI")).toBe(true);
    });

    test("rejects invalid expressions", () => {
      expect(validateCronExpression("60 9 * * 1")).toBe(false);
      expect(validateCronExpression("0 25 * * 1")).toBe(false);
      expect(validateCronExpression("0 9 * * 8")).toBe(false);
      expect(validateCronExpression("")).toBe(false);
      expect(validateCronExpression("0 9 * *")).toBe(false);
    });
  });

  describe("describeCronField", () => {
    test("describes wildcard fields", () => {
      expect(describeCronField("*", "minute")).toBe("every minute");
      expect(describeCronField("*", "hour")).toBe("every hour");
    });

    test("describes single values", () => {
      expect(describeCronField("15", "minute")).toBe("at 15");
      expect(describeCronField("9", "hour")).toBe("at 9");
    });

    test("describes ranges", () => {
      expect(describeCronField("9-17", "hour")).toBe("from 9 to 17");
    });

    test("describes step values", () => {
      expect(describeCronField("*/5", "minute")).toBe("at 0, 5 and 10 more");
    });

    test("describes comma-separated values", () => {
      expect(describeCronField("1,15,30", "minute")).toBe("at 1, 15, 30");
    });

    test("describes month names", () => {
      expect(describeCronField("JAN", "month")).toBe("at January");
      expect(describeCronField("1,6,12", "month")).toBe(
        "at January, June, December"
      );
    });

    test("describes day names", () => {
      expect(describeCronField("MON", "dayOfWeek")).toBe("at Monday");
      expect(describeCronField("1,3,5", "dayOfWeek")).toBe(
        "at Monday, Wednesday, Friday"
      );
    });
  });

  describe("describeCronExpression", () => {
    test("describes simple expressions", () => {
      const result = describeCronExpression("0 9 * * 1");
      expect(result).not.toBeNull();
      expect(result?.description).toContain("at 0 past at 9");
      expect(result?.description).toContain("Monday");
    });

    test("describes complex expressions", () => {
      const result = describeCronExpression("*/15 9-17 * * MON-FRI");
      expect(result).not.toBeNull();
      expect(result?.description).toContain("at 0, 15 and 2 more");
      expect(result?.description).toContain("from 9 to 17");
    });

    test("handles invalid expressions", () => {
      const result = describeCronExpression("invalid");
      expect(result).toBeNull();
    });

    test("provides next executions", () => {
      const result = describeCronExpression("0 9 * * 1");
      expect(result).not.toBeNull();
      expect(result?.nextExecutions).toHaveLength(5);
      expect(result?.nextExecutions[0]).toBeInstanceOf(Date);
    });
  });

  describe("calculateNextExecutions", () => {
    test("calculates next executions for daily job", () => {
      const executions = calculateNextExecutions("0 9 * * *", 3);
      expect(executions).toHaveLength(3);
      expect(executions[0]).toBeInstanceOf(Date);
      expect(executions[1].getTime()).toBeGreaterThan(executions[0].getTime());
    });

    test("calculates next executions for weekly job", () => {
      const executions = calculateNextExecutions("0 9 * * 1", 2);
      expect(executions).toHaveLength(2);
      expect(executions[0]).toBeInstanceOf(Date);
      expect(executions[0].getDay()).toBe(1); // Monday
    });

    test("handles invalid expressions", () => {
      const executions = calculateNextExecutions("invalid", 3);
      expect(executions).toHaveLength(0);
    });

    test("respects count parameter", () => {
      const executions = calculateNextExecutions("0 9 * * *", 10);
      expect(executions.length).toBeGreaterThan(0);
      expect(executions.length).toBeLessThanOrEqual(10);
    });
  });

  describe("getCommonCronExamples", () => {
    test("returns common cron examples", () => {
      const examples = getCommonCronExamples();
      expect(examples).toHaveProperty("every-minute");
      expect(examples).toHaveProperty("hourly");
      expect(examples).toHaveProperty("daily-midnight");
      expect(examples).toHaveProperty("weekly-monday");
      expect(examples).toHaveProperty("monthly");

      expect(examples["every-minute"].expression).toBe("* * * * *");
      expect(examples["daily-midnight"].expression).toBe("0 0 * * *");
      expect(examples["weekly-monday"].expression).toBe("0 9 * * 1");
    });

    test("all examples have expression and description", () => {
      const examples = getCommonCronExamples();
      Object.values(examples).forEach((example) => {
        expect(example).toHaveProperty("expression");
        expect(example).toHaveProperty("description");
        expect(typeof example.expression).toBe("string");
        expect(typeof example.description).toBe("string");
      });
    });
  });

  describe("CRON_RANGES constants", () => {
    test("has correct ranges for all fields", () => {
      expect(CRON_RANGES.minute.min).toBe(0);
      expect(CRON_RANGES.minute.max).toBe(59);
      expect(CRON_RANGES.hour.min).toBe(0);
      expect(CRON_RANGES.hour.max).toBe(23);
      expect(CRON_RANGES.dayOfMonth.min).toBe(1);
      expect(CRON_RANGES.dayOfMonth.max).toBe(31);
      expect(CRON_RANGES.month.min).toBe(1);
      expect(CRON_RANGES.month.max).toBe(12);
      expect(CRON_RANGES.dayOfWeek.min).toBe(0);
      expect(CRON_RANGES.dayOfWeek.max).toBe(6);
    });

    test("has month names", () => {
      expect(CRON_RANGES.month.names).toEqual([
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ]);
    });

    test("has day names", () => {
      expect(CRON_RANGES.dayOfWeek.names).toEqual([
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
      ]);
    });
  });

  describe("MONTH_NAMES and DAY_NAMES constants", () => {
    test("MONTH_NAMES has 12 months", () => {
      expect(MONTH_NAMES).toHaveLength(12);
      expect(MONTH_NAMES[0]).toBe("January");
      expect(MONTH_NAMES[11]).toBe("December");
    });

    test("DAY_NAMES has 7 days", () => {
      expect(DAY_NAMES).toHaveLength(7);
      expect(DAY_NAMES[0]).toBe("Sunday");
      expect(DAY_NAMES[6]).toBe("Saturday");
    });
  });
});
