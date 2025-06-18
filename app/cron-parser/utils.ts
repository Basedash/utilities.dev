/**
 * Parsed cron expression components
 */
export interface ParsedCron {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  second?: string;
}

/**
 * Cron parsing result
 */
export interface CronParseResult {
  success: boolean;
  data?: ParsedCron;
  error?: string;
}

/**
 * Cron description
 */
export interface CronDescription {
  description: string;
  summary: string;
  nextExecutions: Date[];
}

/**
 * Cron field ranges and names
 */
export const CRON_RANGES = {
  second: { min: 0, max: 59, names: undefined },
  minute: { min: 0, max: 59, names: undefined },
  hour: { min: 0, max: 23, names: undefined },
  dayOfMonth: { min: 1, max: 31, names: undefined },
  month: {
    min: 1,
    max: 12,
    names: [
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
    ],
  },
  dayOfWeek: {
    min: 0,
    max: 6,
    names: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  },
};

/**
 * Month names for descriptions
 */
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Day names for descriptions
 */
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Parses a cron expression into its components
 */
export const parseCronExpression = (expression: string): CronParseResult => {
  if (!expression || typeof expression !== "string") {
    return {
      success: false,
      error: "Expression must be a non-empty string",
    };
  }

  const trimmed = expression.trim();
  if (!trimmed) {
    return {
      success: false,
      error: "Expression cannot be empty",
    };
  }

  const parts = trimmed.split(/\s+/);

  // Support both 5-part and 6-part cron expressions
  if (parts.length === 5) {
    return {
      success: true,
      data: {
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4],
      },
    };
  } else if (parts.length === 6) {
    return {
      success: true,
      data: {
        second: parts[0],
        minute: parts[1],
        hour: parts[2],
        dayOfMonth: parts[3],
        month: parts[4],
        dayOfWeek: parts[5],
      },
    };
  }

  return {
    success: false,
    error: `Invalid cron format. Expected 5 or 6 parts, got ${parts.length}`,
  };
};

/**
 * Gets numeric value from field (handles both names and numbers)
 */
export const getFieldValue = (
  value: string,
  names?: string[],
  min: number = 0
): number => {
  if (names) {
    const nameIndex = names.findIndex(
      (name) => name.toLowerCase() === value.toLowerCase()
    );
    if (nameIndex !== -1) {
      return nameIndex + min;
    }
  }

  const numValue = parseInt(value, 10);
  return isNaN(numValue) ? -1 : numValue;
};

/**
 * Parses a cron field into an array of values
 */
export const parseField = (
  field: string,
  min: number,
  max: number,
  names?: string[]
): number[] => {
  const values: number[] = [];

  if (field === "*") {
    for (let i = min; i <= max; i++) {
      values.push(i);
    }
    return values;
  }

  const parts = field.split(",");

  for (const part of parts) {
    if (part.includes("/")) {
      // Handle step values (e.g., */2, 1-5/2)
      const [range, step] = part.split("/");
      const stepNum = parseInt(step, 10);

      if (isNaN(stepNum) || stepNum <= 0) continue;

      if (range === "*") {
        for (let i = min; i <= max; i += stepNum) {
          values.push(i);
        }
      } else if (range.includes("-")) {
        const [start, end] = range.split("-");
        const startNum = getFieldValue(start, names, min);
        const endNum = getFieldValue(end, names, min);

        if (startNum >= min && endNum <= max && startNum <= endNum) {
          for (let i = startNum; i <= endNum; i += stepNum) {
            values.push(i);
          }
        }
      } else {
        const startNum = getFieldValue(range, names, min);
        if (startNum >= min && startNum <= max) {
          for (let i = startNum; i <= max; i += stepNum) {
            values.push(i);
          }
        }
      }
    } else if (part.includes("-")) {
      // Handle ranges (e.g., 1-5)
      const [start, end] = part.split("-");
      const startNum = getFieldValue(start, names, min);
      const endNum = getFieldValue(end, names, min);

      if (startNum >= min && endNum <= max && startNum <= endNum) {
        for (let i = startNum; i <= endNum; i++) {
          values.push(i);
        }
      }
    } else {
      // Handle single values
      const num = getFieldValue(part, names, min);
      if (num >= min && num <= max) {
        values.push(num);
      }
    }
  }

  return [...new Set(values)].sort((a, b) => a - b);
};

/**
 * Validates a cron field
 */
export const validateCronField = (
  field: string,
  type: keyof typeof CRON_RANGES
): boolean => {
  if (!field || typeof field !== "string") return false;

  const range = CRON_RANGES[type];

  try {
    const values = parseField(field, range.min, range.max, range.names);
    return values.length > 0;
  } catch {
    return false;
  }
};

/**
 * Validates a complete cron expression
 */
export const validateCronExpression = (expression: string): boolean => {
  const parseResult = parseCronExpression(expression);

  if (!parseResult.success || !parseResult.data) {
    return false;
  }

  const { data } = parseResult;

  // Validate each field
  const validations = [
    validateCronField(data.minute, "minute"),
    validateCronField(data.hour, "hour"),
    validateCronField(data.dayOfMonth, "dayOfMonth"),
    validateCronField(data.month, "month"),
    validateCronField(data.dayOfWeek, "dayOfWeek"),
  ];

  if (data.second) {
    validations.push(validateCronField(data.second, "second"));
  }

  return validations.every((v) => v);
};

/**
 * Describes a cron field in human-readable format
 */
export const describeCronField = (
  field: string,
  type: keyof typeof CRON_RANGES
): string => {
  if (field === "*") {
    return `every ${type}`;
  }

  const range = CRON_RANGES[type];
  const values = parseField(field, range.min, range.max, range.names);

  if (values.length === 0) {
    return `invalid ${type}`;
  }

  const formatValue = (value: number): string => {
    if (type === "month" && value >= 1 && value <= 12) {
      return MONTH_NAMES[value - 1];
    }
    if (type === "dayOfWeek" && value >= 0 && value <= 6) {
      return DAY_NAMES[value];
    }
    return value.toString();
  };

  if (values.length === 1) {
    return `at ${formatValue(values[0])}`;
  }

  if (values.length === range.max - range.min + 1) {
    return `every ${type}`;
  }

  // Check if it's a continuous range
  const isRange = values.every(
    (val, idx) => idx === 0 || val === values[idx - 1] + 1
  );

  if (isRange && values.length > 2) {
    return `from ${formatValue(values[0])} to ${formatValue(
      values[values.length - 1]
    )}`;
  }

  if (values.length <= 3) {
    return `at ${values.map(formatValue).join(", ")}`;
  }

  return `at ${values.slice(0, 2).map(formatValue).join(", ")} and ${
    values.length - 2
  } more`;
};

/**
 * Generates a human-readable description of a cron expression
 */
export const describeCronExpression = (
  expression: string
): CronDescription | null => {
  const parseResult = parseCronExpression(expression);

  if (!parseResult.success || !parseResult.data) {
    return null;
  }

  const { data } = parseResult;

  if (!validateCronExpression(expression)) {
    return null;
  }

  const minuteDesc = describeCronField(data.minute, "minute");
  const hourDesc = describeCronField(data.hour, "hour");
  const dayOfMonthDesc = describeCronField(data.dayOfMonth, "dayOfMonth");
  const monthDesc = describeCronField(data.month, "month");
  const dayOfWeekDesc = describeCronField(data.dayOfWeek, "dayOfWeek");

  let description = "Runs ";

  if (data.second && data.second !== "0") {
    const secondDesc = describeCronField(data.second, "second");
    description += `${secondDesc}, `;
  }

  description += `${minuteDesc} past ${hourDesc}`;

  if (data.dayOfMonth !== "*" && data.dayOfWeek !== "*") {
    description += `, on ${dayOfMonthDesc} of the month and on ${dayOfWeekDesc}`;
  } else if (data.dayOfMonth !== "*") {
    description += `, on ${dayOfMonthDesc} of the month`;
  } else if (data.dayOfWeek !== "*") {
    description += `, on ${dayOfWeekDesc}`;
  }

  if (data.month !== "*") {
    description += `, ${monthDesc}`;
  }

  // Generate summary
  let summary = "";
  if (
    data.minute === "0" &&
    data.hour === "0" &&
    data.dayOfMonth === "*" &&
    data.month === "*" &&
    data.dayOfWeek === "*"
  ) {
    summary = "Daily at midnight";
  } else if (
    data.minute !== "*" &&
    data.hour !== "*" &&
    data.dayOfWeek !== "*" &&
    data.dayOfMonth === "*" &&
    data.month === "*"
  ) {
    summary = "Weekly schedule";
  } else if (
    data.minute !== "*" &&
    data.hour !== "*" &&
    data.dayOfMonth === "*" &&
    data.month === "*" &&
    data.dayOfWeek === "*"
  ) {
    summary = "Daily schedule";
  } else {
    summary = "Custom schedule";
  }

  return {
    description,
    summary,
    nextExecutions: calculateNextExecutions(expression, 5),
  };
};

/**
 * Calculates the next execution times for a cron expression
 */
export const calculateNextExecutions = (
  expression: string,
  count: number = 5
): Date[] => {
  const parseResult = parseCronExpression(expression);

  if (
    !parseResult.success ||
    !parseResult.data ||
    !validateCronExpression(expression)
  ) {
    return [];
  }

  const { data } = parseResult;
  const executions: Date[] = [];
  const current = new Date();

  // Round up to the next minute to start calculations
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  const minutes = parseField(data.minute, 0, 59);
  const hours = parseField(data.hour, 0, 23);
  const daysOfMonth = parseField(data.dayOfMonth, 1, 31);
  const months = parseField(data.month, 1, 12, CRON_RANGES.month.names);
  const daysOfWeek = parseField(
    data.dayOfWeek,
    0,
    6,
    CRON_RANGES.dayOfWeek.names
  );

  let attempts = 0;
  const maxAttempts = 10000; // Prevent infinite loops

  while (executions.length < count && attempts < maxAttempts) {
    attempts++;

    // const year = current.getFullYear(); // Available for future use
    const month = current.getMonth() + 1; // JS months are 0-indexed
    const dayOfMonth = current.getDate();
    const dayOfWeek = current.getDay();
    const hour = current.getHours();
    const minute = current.getMinutes();

    const monthMatches = months.includes(month);
    const dayMatches =
      daysOfMonth.includes(dayOfMonth) || daysOfWeek.includes(dayOfWeek);
    const hourMatches = hours.includes(hour);
    const minuteMatches = minutes.includes(minute);

    if (monthMatches && dayMatches && hourMatches && minuteMatches) {
      executions.push(new Date(current));
    }

    // Move to next minute
    current.setMinutes(current.getMinutes() + 1);
  }

  return executions;
};

/**
 * Gets common cron expression examples
 */
export const getCommonCronExamples = (): {
  [key: string]: { expression: string; description: string };
} => {
  return {
    "every-minute": {
      expression: "* * * * *",
      description: "Every minute",
    },
    hourly: {
      expression: "0 * * * *",
      description: "Every hour",
    },
    "daily-midnight": {
      expression: "0 0 * * *",
      description: "Daily at midnight",
    },
    "daily-noon": {
      expression: "0 12 * * *",
      description: "Daily at noon",
    },
    "weekly-monday": {
      expression: "0 9 * * 1",
      description: "Every Monday at 9 AM",
    },
    weekdays: {
      expression: "0 9 * * 1-5",
      description: "Weekdays at 9 AM",
    },
    monthly: {
      expression: "0 0 1 * *",
      description: "First day of every month at midnight",
    },
    quarterly: {
      expression: "0 0 1 1,4,7,10 *",
      description: "First day of every quarter",
    },
    yearly: {
      expression: "0 0 1 1 *",
      description: "January 1st at midnight",
    },
  };
};
