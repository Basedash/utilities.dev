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
import { Switch } from "@/components/ui/switch";
import { Copy, RefreshCw, Calendar } from "lucide-react";
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  getCurrentDateTime,
} from "./utils";

export default function UnixTimestampPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [isMilliseconds, setIsMilliseconds] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState("");

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      const current = getCurrentTimestamp(isMilliseconds);
      setCurrentTimestamp(current);
    };

    updateCurrentTimestamp();
    const interval = setInterval(updateCurrentTimestamp, 1000);
    return () => clearInterval(interval);
  }, [isMilliseconds]);

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    if (value.trim()) {
      const result = timestampToDate(value, isMilliseconds);
      setDateTime(result.success ? result.result : "Invalid timestamp");
    } else {
      setDateTime("");
    }
  };

  const handleDateTimeChange = (value: string) => {
    setDateTime(value);
    if (value.trim()) {
      const result = dateToTimestamp(value, isMilliseconds);
      setTimestamp(result.success ? result.result : "Invalid date");
    } else {
      setTimestamp("");
    }
  };

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

  const useCurrentTimestamp = () => {
    const current = getCurrentTimestamp(isMilliseconds);
    setTimestamp(current);
    const dateResult = timestampToDate(current, isMilliseconds);
    setDateTime(dateResult.success ? dateResult.result : "");
  };

  const useCurrentDateTime = () => {
    const current = getCurrentDateTime();
    setDateTime(current);
    const timestampResult = dateToTimestamp(current, isMilliseconds);
    setTimestamp(timestampResult.success ? timestampResult.result : "");
  };

  const clear = () => {
    setTimestamp("");
    setDateTime("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Unix Timestamp Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert Unix timestamps to human-readable dates and vice versa
          </p>
        </div>

        {/* Current Timestamp Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Current Timestamp
            </CardTitle>
            <CardDescription>
              The current Unix timestamp (updates every second)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="font-mono text-lg bg-muted p-3 rounded-md">
                  {currentTimestamp}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(currentTimestamp)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={useCurrentTimestamp}>
                Use
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="milliseconds-mode"
                checked={isMilliseconds}
                onCheckedChange={setIsMilliseconds}
              />
              <Label htmlFor="milliseconds-mode">
                Use milliseconds instead of seconds
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isMilliseconds
                ? "Timestamps will be treated as milliseconds since epoch"
                : "Timestamps will be treated as seconds since epoch"}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Timestamp to Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Unix Timestamp
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(timestamp)}
                  disabled={!timestamp}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Enter a Unix timestamp to convert to date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp-input">
                  Timestamp ({isMilliseconds ? "milliseconds" : "seconds"})
                </Label>
                <Input
                  id="timestamp-input"
                  type="number"
                  placeholder={isMilliseconds ? "1635724800000" : "1635724800"}
                  value={timestamp}
                  onChange={(e) => handleTimestampChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-output">Human-readable Date</Label>
                <Input
                  id="date-output"
                  value={dateTime}
                  readOnly
                  className="bg-muted"
                  placeholder="Date will appear here..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Date to Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Date & Time
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={useCurrentDateTime}
                    className="h-8 px-2"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(dateTime)}
                    disabled={!dateTime}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Enter a date to convert to Unix timestamp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datetime-input">Date & Time</Label>
                <Input
                  id="datetime-input"
                  type="datetime-local"
                  value={dateTime.replace(" ", "T")}
                  onChange={(e) =>
                    handleDateTimeChange(e.target.value.replace("T", " "))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timestamp-output">
                  Unix Timestamp ({isMilliseconds ? "milliseconds" : "seconds"})
                </Label>
                <Input
                  id="timestamp-output"
                  value={timestamp}
                  readOnly
                  className="bg-muted font-mono"
                  placeholder="Timestamp will appear here..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={clear} variant="outline">
            Clear All
          </Button>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Unix Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              A Unix timestamp is the number of seconds (or milliseconds) that
              have elapsed since January 1, 1970, 00:00:00 UTC. It&apos;s a
              standardized way to represent dates and times in computer systems.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Common Use Cases:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Database timestamps</li>
                  <li>API responses</li>
                  <li>Log file entries</li>
                  <li>System scheduling</li>
                  <li>Data synchronization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Facts:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Epoch: January 1, 1970, 00:00:00 UTC</li>
                  <li>Also known as POSIX time</li>
                  <li>Language and timezone independent</li>
                  <li>32-bit limit: January 19, 2038</li>
                  <li>64-bit systems extend far into the future</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
