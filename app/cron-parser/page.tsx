"use client";

import { useState, useEffect } from "react";
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
import {
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  parseCronExpression,
  describeCronExpression,
  validateCronExpression,
  getCommonCronExamples,
  type ParsedCron,
  type CronDescription,
} from "./utils";

export default function CronParserPage() {
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [parsedCron, setParsedCron] = useState<ParsedCron | null>(null);
  const [cronDescription, setCronDescription] =
    useState<CronDescription | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!cronExpression.trim()) {
      setParsedCron(null);
      setCronDescription(null);
      setIsValid(true);
      setErrorMessage("");
      return;
    }

    const isValidCron = validateCronExpression(cronExpression);
    setIsValid(isValidCron);

    if (isValidCron) {
      const parseResult = parseCronExpression(cronExpression);
      if (parseResult.success && parseResult.data) {
        setParsedCron(parseResult.data);
        const description = describeCronExpression(cronExpression);
        setCronDescription(description);
        setErrorMessage("");
      } else {
        setParsedCron(null);
        setCronDescription(null);
        setErrorMessage(parseResult.error || "Invalid cron expression");
        setIsValid(false);
      }
    } else {
      setParsedCron(null);
      setCronDescription(null);
      setErrorMessage("Invalid cron expression format");
    }
  }, [cronExpression]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
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

  const commonExamples = getCommonCronExamples();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Cron Parser
          </h1>
          <p className="text-muted-foreground text-lg">
            Parse and understand cron expressions with detailed explanations
          </p>
        </div>

        {/* Validation Status */}
        {!isValid && (
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

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Cron Expression
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
              Enter a cron expression (5 or 6 fields separated by spaces)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cron-input">Expression</Label>
              <Input
                id="cron-input"
                placeholder="0 9 * * 1-5"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Examples:</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(commonExamples).map(([, example], index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setExample(example.expression)}
                    className="text-xs"
                  >
                    {example.expression}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isValid && parsedCron && cronDescription && (
          <>
            {/* Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Schedule Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium text-lg">
                    {cronDescription.summary}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cronDescription.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parsed Fields */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Parsed Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {parsedCron.second && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Second</Label>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {parsedCron.second}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Minute</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {parsedCron.minute}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Hour</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {parsedCron.hour}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Day of Month</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {parsedCron.dayOfMonth}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Month</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {parsedCron.month}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Day of Week</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {parsedCron.dayOfWeek}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Executions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next Executions
                </CardTitle>
                <CardDescription>
                  The next 5 times this cron expression will run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cronDescription.nextExecutions.map((execution, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="font-mono text-sm">
                        {execution.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(execution.toISOString())}
                        className="h-6 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Cron Expressions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              Cron expressions are used to schedule tasks at specific times or
              intervals. They consist of 5 or 6 fields separated by spaces:
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  5-Field Format:
                </h4>
                <div className="font-mono text-xs bg-muted p-2 rounded mb-2">
                  * * * * *
                </div>
                <ul className="space-y-1 text-xs">
                  <li>• Minute (0-59)</li>
                  <li>• Hour (0-23)</li>
                  <li>• Day of month (1-31)</li>
                  <li>• Month (1-12)</li>
                  <li>• Day of week (0-7, 0 and 7 = Sunday)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Special Characters:
                </h4>
                <ul className="space-y-1 text-xs">
                  <li>• * : Any value</li>
                  <li>• , : Value list separator</li>
                  <li>• - : Range of values</li>
                  <li>• / : Step values</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
