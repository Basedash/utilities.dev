"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

// Month and day names constants
const MONTH_NAMES = [
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

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ParsedCron {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  second?: string;
}

interface CronDescription {
  description: string;
  summary: string;
  nextExecutions: string[];
}

export default function CronParserPage() {
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [parsedCron, setParsedCron] = useState<ParsedCron | null>(null);
  const [cronDescription, setCronDescription] =
    useState<CronDescription | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to get numeric value from field (handles both names and numbers)
  const getFieldValue = useCallback(
    (value: string, names?: string[], min: number = 0): number => {
      if (!names) {
        return parseInt(value);
      }

      // Try to find by name first
      const nameIndex = names.indexOf(value.toUpperCase());
      if (nameIndex !== -1) {
        return nameIndex + min;
      }

      // If not found by name, try to parse as number
      const numValue = parseInt(value);
      return isNaN(numValue) ? -1 : numValue;
    },
    []
  );

  const parseCronExpression = (expression: string): ParsedCron | null => {
    if (!expression.trim()) return null;

    const parts = expression.trim().split(/\s+/);

    // Support both 5-part and 6-part cron expressions
    if (parts.length === 5) {
      return {
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4],
      };
    } else if (parts.length === 6) {
      return {
        second: parts[0],
        minute: parts[1],
        hour: parts[2],
        dayOfMonth: parts[3],
        month: parts[4],
        dayOfWeek: parts[5],
      };
    }

    return null;
  };

  const parseField = useCallback(
    (field: string, min: number, max: number, names?: string[]): number[] => {
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
          const [range, step] = part.split("/");
          const stepNum = parseInt(step);
          const rangeValues: number[] = [];

          if (range === "*") {
            for (let i = min; i <= max; i += stepNum) {
              rangeValues.push(i);
            }
          } else if (range.includes("-")) {
            const [start, end] = range.split("-");
            const startNum = getFieldValue(start, names, min);
            const endNum = getFieldValue(end, names, min);

            for (let i = startNum; i <= endNum; i += stepNum) {
              rangeValues.push(i);
            }
          } else {
            const startNum = getFieldValue(range, names, min);
            for (let i = startNum; i <= max; i += stepNum) {
              rangeValues.push(i);
            }
          }
          values.push(...rangeValues);
        } else if (part.includes("-")) {
          const [start, end] = part.split("-");
          const startNum = getFieldValue(start, names, min);
          const endNum = getFieldValue(end, names, min);

          for (let i = startNum; i <= endNum; i++) {
            values.push(i);
          }
        } else {
          const num = getFieldValue(part, names, min);
          if (!isNaN(num) && num >= min && num <= max) {
            values.push(num);
          }
        }
      }

      return [...new Set(values)].sort((a, b) => a - b);
    },
    [getFieldValue]
  );

  const describeCronField = useCallback(
    (
      field: string,
      type: "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek" | "second"
    ): string => {
      if (field === "*") {
        return `every ${type}`;
      }

      const ranges = {
        minute: { min: 0, max: 59, names: undefined },
        hour: { min: 0, max: 23, names: undefined },
        dayOfMonth: { min: 1, max: 31, names: undefined },
        month: { min: 1, max: 12, names: MONTH_NAMES },
        dayOfWeek: { min: 0, max: 6, names: DAY_NAMES },
        second: { min: 0, max: 59, names: undefined },
      };

      const range = ranges[type];
      const values = parseField(field, range.min, range.max, range.names);

      if (values.length === 0) return field;

      if (field.includes("/")) {
        const step = parseInt(field.split("/")[1]);
        const baseRange = field.split("/")[0];

        if (baseRange === "*") {
          return `every ${step} ${type}${step > 1 ? "s" : ""}`;
        } else {
          return `every ${step} ${type}${
            step > 1 ? "s" : ""
          } starting from ${baseRange}`;
        }
      }

      if (values.length === 1) {
        if (type === "month" && range.names) {
          return `in ${range.names[values[0] - range.min]}`;
        } else if (type === "dayOfWeek" && range.names) {
          return `on ${range.names[values[0]]}`;
        } else if (type === "hour") {
          return `at ${values[0].toString().padStart(2, "0")}:00`;
        } else {
          return `at ${type} ${values[0]}`;
        }
      }

      if (values.length === range.max - range.min + 1) {
        return `every ${type}`;
      }

      const formatValue = (value: number) => {
        if (type === "month" && range.names) {
          return range.names[value - range.min];
        } else if (type === "dayOfWeek" && range.names) {
          return range.names[value];
        }
        return value.toString();
      };

      // Special case for weekdays (Mon-Fri)
      if (
        type === "dayOfWeek" &&
        values.length === 5 &&
        values.every((v, i) => v === i + 1)
      ) {
        return "on weekdays";
      }

      if (values.length <= 3) {
        const formattedValues = values.map(formatValue).join(", ");
        if (type === "dayOfWeek") {
          return `on ${formattedValues}`;
        } else if (type === "month") {
          return `in ${formattedValues}`;
        }
        return `on ${type}${values.length > 1 ? "s" : ""} ${formattedValues}`;
      }

      return `on ${values.length} specific ${type}s`;
    },
    [parseField]
  );

  const generateDescription = useCallback(
    (parsed: ParsedCron): CronDescription => {
      const parts: string[] = [];

      // Handle seconds if present
      if (parsed.second && parsed.second !== "0") {
        parts.push(describeCronField(parsed.second, "second"));
      }

      // Handle minutes
      if (parsed.minute !== "*") {
        if (parsed.minute === "0") {
          // Only add minute description if it's not at the top of the hour for other cases
          if (
            parsed.hour === "*" ||
            parsed.dayOfWeek !== "*" ||
            parsed.dayOfMonth !== "*"
          ) {
            parts.push(describeCronField(parsed.minute, "minute"));
          }
        } else {
          parts.push(describeCronField(parsed.minute, "minute"));
        }
      }

      // Handle hours
      if (parsed.hour !== "*") {
        parts.push(describeCronField(parsed.hour, "hour"));
      }

      // Handle day of month and month
      if (parsed.dayOfMonth !== "*") {
        parts.push(describeCronField(parsed.dayOfMonth, "dayOfMonth"));
      }

      if (parsed.month !== "*") {
        parts.push(describeCronField(parsed.month, "month"));
      }

      // Handle day of week
      if (parsed.dayOfWeek !== "*") {
        parts.push(describeCronField(parsed.dayOfWeek, "dayOfWeek"));
      }

      const description = parts.join(", ");

      // Create a summary
      let summary = "Runs ";

      // Handle step values for common patterns
      if (
        parsed.minute.includes("/") &&
        parsed.hour === "*" &&
        parsed.dayOfMonth === "*" &&
        parsed.dayOfWeek === "*"
      ) {
        const step = parseInt(parsed.minute.split("/")[1]);
        if (parsed.minute.startsWith("*/")) {
          summary += `every ${step} minute${step > 1 ? "s" : ""}`;
        } else {
          summary += `every ${step} minute${
            step > 1 ? "s" : ""
          } starting from minute ${parsed.minute.split("/")[0]}`;
        }
      } else if (
        parsed.hour.includes("/") &&
        parsed.minute === "0" &&
        parsed.dayOfMonth === "*" &&
        parsed.dayOfWeek === "*"
      ) {
        const step = parseInt(parsed.hour.split("/")[1]);
        if (parsed.hour.startsWith("*/")) {
          summary += `every ${step} hour${step > 1 ? "s" : ""}`;
        } else {
          summary += `every ${step} hour${
            step > 1 ? "s" : ""
          } starting from hour ${parsed.hour.split("/")[0]}`;
        }
      } else if (
        parsed.minute === "0" &&
        parsed.hour !== "*" &&
        parsed.dayOfWeek === "*" &&
        parsed.dayOfMonth === "*"
      ) {
        summary += `daily at ${parsed.hour}:00`;
      } else if (parsed.dayOfWeek !== "*" && parsed.dayOfMonth === "*") {
        const dayDesc = describeCronField(parsed.dayOfWeek, "dayOfWeek");
        if (dayDesc === "on weekdays") {
          summary += `weekdays`;
        } else {
          summary += `weekly ${dayDesc}`;
        }
        if (parsed.hour !== "*") {
          summary += ` at ${parsed.hour}:${parsed.minute.padStart(2, "0")}`;
        }
      } else if (parsed.dayOfMonth !== "*" && parsed.dayOfWeek === "*") {
        // Check if both month and day are specified (annual)
        if (parsed.month !== "*") {
          summary += `annually ${describeCronField(parsed.month, "month")} ${
            parsed.dayOfMonth
          }`;
        } else {
          summary += `monthly on day ${parsed.dayOfMonth}`;
        }
        if (parsed.hour !== "*") {
          summary += ` at ${parsed.hour}:${parsed.minute.padStart(2, "0")}`;
        }
      } else {
        summary = description || "Complex schedule";
      }

      // Generate next execution times will be calculated separately

      return {
        description: description || "Every minute",
        summary,
        nextExecutions: [], // Will be populated separately
      };
    },
    [describeCronField]
  );

  const matchesField = useCallback(
    (
      value: number,
      field: string,
      min: number,
      max: number,
      names?: string[]
    ): boolean => {
      if (field === "*") {
        return true;
      }

      try {
        const validValues = parseField(field, min, max, names);
        return validValues.includes(value);
      } catch {
        return false;
      }
    },
    [parseField]
  );

  const matchesCronExpression = useCallback(
    (date: Date, cron: ParsedCron): boolean => {
      const minute = date.getMinutes();
      const hour = date.getHours();
      const dayOfMonth = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-based
      const dayOfWeek = date.getDay(); // 0 = Sunday
      const second = date.getSeconds();

      // Check seconds if specified
      if (cron.second && !matchesField(second, cron.second, 0, 59)) {
        return false;
      }

      // Check minute
      if (!matchesField(minute, cron.minute, 0, 59)) {
        return false;
      }

      // Check hour
      if (!matchesField(hour, cron.hour, 0, 23)) {
        return false;
      }

      // Check month
      if (!matchesField(month, cron.month, 1, 12, MONTH_NAMES)) {
        return false;
      }

      // Special handling for day of month and day of week
      // In cron, if both are specified (not *), then EITHER can match (OR logic)
      const dayOfMonthMatches = matchesField(
        dayOfMonth,
        cron.dayOfMonth,
        1,
        31
      );
      const dayOfWeekMatches = matchesField(
        dayOfWeek,
        cron.dayOfWeek,
        0,
        6,
        DAY_NAMES
      );

      if (cron.dayOfMonth === "*" && cron.dayOfWeek === "*") {
        // Both are wildcards, so any day matches
        return true;
      } else if (cron.dayOfMonth === "*") {
        // Only day of week is specified
        return dayOfWeekMatches;
      } else if (cron.dayOfWeek === "*") {
        // Only day of month is specified
        return dayOfMonthMatches;
      } else {
        // Both are specified, so either can match (OR logic)
        return dayOfMonthMatches || dayOfWeekMatches;
      }
    },
    [matchesField]
  );

  const generateNextExecutions = useCallback(
    (cronExpression: ParsedCron): string[] => {
      const executions: string[] = [];
      let currentTime = new Date();

      // Start from the next minute to avoid showing past times
      currentTime.setSeconds(0, 0);
      currentTime.setMinutes(currentTime.getMinutes() + 1);

      const maxIterations = 10000; // Prevent infinite loops
      let iterations = 0;

      while (executions.length < 5 && iterations < maxIterations) {
        iterations++;

        if (matchesCronExpression(currentTime, cronExpression)) {
          executions.push(currentTime.toLocaleString());
        }

        // Move to next minute
        currentTime = new Date(currentTime.getTime() + 60 * 1000);
      }

      return executions;
    },
    [matchesCronExpression]
  );

  const validateAndParse = useCallback(
    (expression: string) => {
      if (!expression.trim()) {
        setParsedCron(null);
        setCronDescription(null);
        setIsValid(true);
        setErrorMessage("");
        return;
      }

      try {
        const parsed = parseCronExpression(expression);

        if (!parsed) {
          setIsValid(false);
          setErrorMessage(
            "Invalid cron expression format. Use 5 or 6 fields separated by spaces."
          );
          setParsedCron(null);
          setCronDescription(null);
          return;
        }

        // Basic validation
        const fields = [
          { name: "minute", value: parsed.minute, min: 0, max: 59 },
          { name: "hour", value: parsed.hour, min: 0, max: 23 },
          { name: "day of month", value: parsed.dayOfMonth, min: 1, max: 31 },
          { name: "month", value: parsed.month, min: 1, max: 12 },
          { name: "day of week", value: parsed.dayOfWeek, min: 0, max: 7 },
        ];

        if (parsed.second) {
          fields.unshift({
            name: "second",
            value: parsed.second,
            min: 0,
            max: 59,
          });
        }

        for (const field of fields) {
          if (!isValidCronField(field.value)) {
            setIsValid(false);
            setErrorMessage(`Invalid ${field.name} field: ${field.value}`);
            setParsedCron(null);
            setCronDescription(null);
            return;
          }
        }

        setParsedCron(parsed);
        const description = generateDescription(parsed);
        const nextExecutions = generateNextExecutions(parsed);
        setCronDescription({
          ...description,
          nextExecutions,
        });
        setIsValid(true);
        setErrorMessage("");
      } catch {
        setIsValid(false);
        setErrorMessage("Error parsing cron expression");
        setParsedCron(null);
        setCronDescription(null);
      }
    },
    [generateDescription, generateNextExecutions]
  );

  const isValidCronField = (field: string): boolean => {
    if (field === "*") return true;

    // Improved regex to handle step values like */15, */5, etc.
    const cronFieldRegex =
      /^(\*\/\d+|\*|(\d+(-\d+)?(\/\d+)?)(,(\d+(-\d+)?(\/\d+)?))*|[A-Z]{3}(-[A-Z]{3})?(\/\d+)?)$/;
    return cronFieldRegex.test(field);
  };

  useEffect(() => {
    validateAndParse(cronExpression);
  }, [cronExpression, validateAndParse]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setCronExpression("");
  };

  const setExample = (example: string) => {
    setCronExpression(example);
  };

  const examples = [
    { expression: "0 9 * * 1-5", description: "Every weekday at 9:00 AM" },
    { expression: "0 0 * * 0", description: "Every Sunday at midnight" },
    { expression: "*/15 * * * *", description: "Every 15 minutes" },
    {
      expression: "0 2 1 * *",
      description: "First day of every month at 2:00 AM",
    },
    {
      expression: "0 0 1 1 *",
      description: "Every New Year's Day at midnight",
    },
    { expression: "0 */6 * * *", description: "Every 6 hours" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Cron Expression Parser
          </h1>
          <p className="text-muted-foreground text-lg">
            Parse cron expressions and understand their schedule patterns
          </p>
        </div>

        {/* Status */}
        {isValid === false && (
          <div className="mb-6">
            <Card className="border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Invalid Cron Expression
                  </span>
                  <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                    {errorMessage}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isValid && cronDescription && (
          <div className="mb-6">
            <Card className="border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Valid Cron Expression
                  </span>
                  <span className="text-sm text-green-700 dark:text-green-300 ml-2">
                    {cronDescription.summary}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Cron Expression Input
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(cronExpression)}
                  disabled={!cronExpression}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Enter a cron expression to parse and understand its schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cron-input">Cron Expression</Label>
                <Input
                  id="cron-input"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="0 9 * * 1-5"
                  className="font-mono text-lg"
                />
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Examples:</Label>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setExample(example.expression)}
                      className="text-xs h-auto py-1 px-2"
                    >
                      {example.expression}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parsed Results */}
        {parsedCron && cronDescription && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Field Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Field Breakdown</CardTitle>
                <CardDescription>Individual field analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parsedCron.second && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Second:</span>
                      <Badge variant="outline" className="font-mono">
                        {parsedCron.second}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Minute:</span>
                    <Badge variant="outline" className="font-mono">
                      {parsedCron.minute}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Hour:</span>
                    <Badge variant="outline" className="font-mono">
                      {parsedCron.hour}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Day of Month:</span>
                    <Badge variant="outline" className="font-mono">
                      {parsedCron.dayOfMonth}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Month:</span>
                    <Badge variant="outline" className="font-mono">
                      {parsedCron.month}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Day of Week:</span>
                    <Badge variant="outline" className="font-mono">
                      {parsedCron.dayOfWeek}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Human-Readable Description</CardTitle>
                <CardDescription>
                  What this cron expression means
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Summary
                    </Label>
                    <p className="text-lg font-medium mt-1">
                      {cronDescription.summary}
                    </p>
                  </div>
                  {cronDescription.description && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Details
                      </Label>
                      <p className="mt-1">{cronDescription.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Next Executions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next Execution Times
                </CardTitle>
                <CardDescription>
                  Upcoming scheduled executions (estimated)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {cronDescription.nextExecutions.map((time, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Times are estimated and may not account for all edge
                  cases. Use a proper cron calculator for production scheduling.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Cron Parser</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              Cron expressions are used to schedule tasks and jobs in Unix-like
              operating systems. This parser helps you understand complex cron
              expressions by breaking them down into human-readable descriptions
              and showing when they will execute next.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Features:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time cron parsing</li>
                  <li>Human-readable descriptions</li>
                  <li>Next execution predictions</li>
                  <li>Field breakdown analysis</li>
                  <li>Quick example templates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Cases:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>System task scheduling</li>
                  <li>Automated backups</li>
                  <li>Log rotation jobs</li>
                  <li>CI/CD pipeline triggers</li>
                  <li>Maintenance scripts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Special Characters:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>*</strong> - Any value
                  </li>
                  <li>
                    <strong>,</strong> - Value list separator
                  </li>
                  <li>
                    <strong>-</strong> - Range of values
                  </li>
                  <li>
                    <strong>/</strong> - Step values
                  </li>
                  <li>
                    <strong>MON-SUN</strong> - Day names
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">
                Cron Expression Format:
              </h4>
              <div className="space-y-1 text-xs font-mono">
                <div>* * * * *</div>
                <div>│ │ │ │ │</div>
                <div>│ │ │ │ └─── day of week (0-7, 0=Sunday)</div>
                <div>│ │ │ └───── month (1-12)</div>
                <div>│ │ └─────── day of month (1-31)</div>
                <div>│ └───────── hour (0-23)</div>
                <div>└─────────── minute (0-59)</div>
              </div>
              <p className="text-xs mt-2">
                Some systems also support a 6th field for seconds at the
                beginning.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
