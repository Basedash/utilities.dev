/**
 * Timestamp conversion result
 */
export interface TimestampResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * Timestamp validation result
 */
export interface TimestampValidation {
  isValid: boolean;
  error?: string;
  timestamp?: number;
}

/**
 * Converts Unix timestamp to date string
 */
export const timestampToDate = (
  timestamp: string | number,
  isMilliseconds: boolean = false
): TimestampResult => {
  try {
    const numTs =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;

    if (isNaN(numTs)) {
      return {
        result: "",
        success: false,
        error: "Invalid timestamp",
      };
    }

    const tsInMs = isMilliseconds ? numTs : numTs * 1000;

    // Check for reasonable timestamp bounds (1970 to ~2286)
    if (tsInMs < 0 || tsInMs > 9999999999999) {
      return {
        result: "",
        success: false,
        error: "Timestamp out of valid range",
      };
    }

    const date = new Date(tsInMs);

    if (isNaN(date.getTime())) {
      return {
        result: "",
        success: false,
        error: "Invalid timestamp",
      };
    }

    // Return UTC date string to match the format expected by tests
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const isoString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return {
      result: isoString,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Invalid timestamp",
    };
  }
};

/**
 * Converts date string to Unix timestamp
 */
export const dateToTimestamp = (
  dateStr: string,
  isMilliseconds: boolean = false
): TimestampResult => {
  try {
    if (!dateStr.trim()) {
      return {
        result: "",
        success: false,
        error: "Date cannot be empty",
      };
    }

    // Handle the date string as UTC to avoid timezone issues
    let date: Date;

    // If the date string looks like "YYYY-MM-DD HH:MM:SS", treat it as UTC
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
      // Parse as UTC by appending 'Z'
      date = new Date(dateStr + "Z");
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      return {
        result: "",
        success: false,
        error: "Invalid date format",
      };
    }

    const timestamp = date.getTime();
    const result = isMilliseconds ? timestamp : Math.floor(timestamp / 1000);

    return {
      result: result.toString(),
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Invalid date",
    };
  }
};

/**
 * Validates timestamp string
 */
export const validateTimestamp = (
  timestamp: string,
  isMilliseconds: boolean = false
): TimestampValidation => {
  if (!timestamp.trim()) {
    return { isValid: false, error: "Timestamp cannot be empty" };
  }

  const numTs = parseInt(timestamp);

  if (isNaN(numTs)) {
    return { isValid: false, error: "Timestamp must be a number" };
  }

  // Check reasonable bounds
  const tsInMs = isMilliseconds ? numTs : numTs * 1000;

  if (tsInMs < 0) {
    return { isValid: false, error: "Timestamp cannot be negative" };
  }

  if (tsInMs > 9999999999999) {
    return { isValid: false, error: "Timestamp too large" };
  }

  return { isValid: true, timestamp: numTs };
};

/**
 * Gets current timestamp
 */
export const getCurrentTimestamp = (
  isMilliseconds: boolean = false
): string => {
  const now = Date.now();
  return isMilliseconds ? now.toString() : Math.floor(now / 1000).toString();
};

/**
 * Gets current date in ISO format for datetime-local input
 */
export const getCurrentDateTime = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace("T", " ");
};

/**
 * Formats timestamp for display with timezone info
 */
export const formatTimestampWithTimezone = (
  timestamp: string | number,
  isMilliseconds: boolean = false
): TimestampResult => {
  const dateResult = timestampToDate(timestamp, isMilliseconds);

  if (!dateResult.success) {
    return dateResult;
  }

  try {
    const numTs =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    const tsInMs = isMilliseconds ? numTs : numTs * 1000;
    const date = new Date(tsInMs);

    // Format with timezone
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    const formatted = date.toLocaleString("en-US", options);

    return {
      result: formatted,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Failed to format timestamp",
    };
  }
};

/**
 * Gets relative time from timestamp (e.g., "2 hours ago")
 */
export const getRelativeTime = (
  timestamp: string | number,
  isMilliseconds: boolean = false
): TimestampResult => {
  try {
    const numTs =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    const tsInMs = isMilliseconds ? numTs : numTs * 1000;
    const now = Date.now();
    const diffMs = now - tsInMs;

    if (isNaN(numTs) || isNaN(diffMs)) {
      return {
        result: "",
        success: false,
        error: "Invalid timestamp",
      };
    }

    const absMs = Math.abs(diffMs);
    const future = diffMs < 0;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let value: number;
    let unit: string;

    if (absMs < minute) {
      value = Math.floor(absMs / 1000);
      unit = value === 1 ? "second" : "seconds";
    } else if (absMs < hour) {
      value = Math.floor(absMs / minute);
      unit = value === 1 ? "minute" : "minutes";
    } else if (absMs < day) {
      value = Math.floor(absMs / hour);
      unit = value === 1 ? "hour" : "hours";
    } else if (absMs < week) {
      value = Math.floor(absMs / day);
      unit = value === 1 ? "day" : "days";
    } else if (absMs < month) {
      value = Math.floor(absMs / week);
      unit = value === 1 ? "week" : "weeks";
    } else if (absMs < year) {
      value = Math.floor(absMs / month);
      unit = value === 1 ? "month" : "months";
    } else {
      value = Math.floor(absMs / year);
      unit = value === 1 ? "year" : "years";
    }

    const result = future ? `in ${value} ${unit}` : `${value} ${unit} ago`;

    return {
      result,
      success: true,
    };
  } catch {
    return {
      result: "",
      success: false,
      error: "Failed to calculate relative time",
    };
  }
};
