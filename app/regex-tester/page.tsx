"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
  Info,
} from "lucide-react";

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups?: { [key: string]: string };
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    sticky: false,
    unicode: false,
    dotAll: false,
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValidRegex, setIsValidRegex] = useState<boolean | null>(null);
  const [regexError, setRegexError] = useState("");

  const flagString = useMemo(() => {
    let flagStr = "";
    if (flags.global) flagStr += "g";
    if (flags.ignoreCase) flagStr += "i";
    if (flags.multiline) flagStr += "m";
    if (flags.sticky) flagStr += "y";
    if (flags.unicode) flagStr += "u";
    if (flags.dotAll) flagStr += "s";
    return flagStr;
  }, [flags]);

  useEffect(() => {
    if (!pattern.trim()) {
      setMatches([]);
      setIsValidRegex(null);
      setRegexError("");
      return;
    }

    try {
      const regex = new RegExp(pattern, flagString);
      setIsValidRegex(true);
      setRegexError("");

      if (!testString) {
        setMatches([]);
        return;
      }

      const foundMatches: RegexMatch[] = [];

      if (flags.global) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });

          // Prevent infinite loop for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });
        }
      }

      setMatches(foundMatches);
    } catch (error) {
      setIsValidRegex(false);
      setRegexError(
        error instanceof Error ? error.message : "Invalid regex pattern"
      );
      setMatches([]);
    }
  }, [pattern, testString, flagString, flags.global]);

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`before-${i}`} className="text-foreground">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium"
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="after" className="text-foreground">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setPattern("");
    setTestString("");
    setMatches([]);
    setIsValidRegex(null);
    setRegexError("");
  };

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Regex Tester
          </h1>
          <p className="text-muted-foreground text-lg">
            Test regular expressions with real-time matching and detailed
            results
          </p>
        </div>

        {/* Regex Pattern Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Regular Expression Pattern
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
                  onClick={() => handleCopy(`/${pattern}/${flagString}`)}
                  disabled={!pattern}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Enter your regular expression pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regex-pattern">Pattern</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono text-muted-foreground">
                  /
                </span>
                <Input
                  id="regex-pattern"
                  placeholder="Enter regex pattern..."
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="font-mono"
                />
                <span className="text-lg font-mono text-muted-foreground">
                  /{flagString}
                </span>
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-3">
              <Label>Flags</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-global"
                    checked={flags.global}
                    onCheckedChange={() => handleFlagChange("global")}
                  />
                  <Label htmlFor="flag-global" className="text-sm font-mono">
                    g - Global
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-ignoreCase"
                    checked={flags.ignoreCase}
                    onCheckedChange={() => handleFlagChange("ignoreCase")}
                  />
                  <Label
                    htmlFor="flag-ignoreCase"
                    className="text-sm font-mono"
                  >
                    i - Ignore Case
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-multiline"
                    checked={flags.multiline}
                    onCheckedChange={() => handleFlagChange("multiline")}
                  />
                  <Label htmlFor="flag-multiline" className="text-sm font-mono">
                    m - Multiline
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-sticky"
                    checked={flags.sticky}
                    onCheckedChange={() => handleFlagChange("sticky")}
                  />
                  <Label htmlFor="flag-sticky" className="text-sm font-mono">
                    y - Sticky
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-unicode"
                    checked={flags.unicode}
                    onCheckedChange={() => handleFlagChange("unicode")}
                  />
                  <Label htmlFor="flag-unicode" className="text-sm font-mono">
                    u - Unicode
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-dotAll"
                    checked={flags.dotAll}
                    onCheckedChange={() => handleFlagChange("dotAll")}
                  />
                  <Label htmlFor="flag-dotAll" className="text-sm font-mono">
                    s - Dot All
                  </Label>
                </div>
              </div>
            </div>

            {/* Regex Validation Status */}
            {isValidRegex !== null && (
              <div
                className={`flex items-center gap-2 p-3 rounded-md ${
                  isValidRegex
                    ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                }`}
              >
                {isValidRegex ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Valid regex pattern
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      {matches.length} match{matches.length !== 1 ? "es" : ""}
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Invalid regex:
                    </span>
                    <span className="text-sm text-red-700 dark:text-red-300">
                      {regexError}
                    </span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Test String Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test String
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(testString)}
                  disabled={!testString}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Enter text to test your regex pattern against
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="test-string">Text</Label>
                <Textarea
                  id="test-string"
                  placeholder="Enter text to test..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Matched text with highlighting and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Highlighted Matches</Label>
                  <div className="min-h-[200px] p-3 border rounded-md bg-muted font-mono text-sm whitespace-pre-wrap">
                    {testString ? (
                      highlightMatches(testString, matches)
                    ) : (
                      <span className="text-muted-foreground">
                        Test string will appear here with matches highlighted...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match Details */}
        {matches.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Match Details ({matches.length} match
                {matches.length !== 1 ? "es" : ""})
              </CardTitle>
              <CardDescription>
                Detailed information about each match and capture groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Match {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Position: {match.index}-
                        {match.index + match.match.length}
                      </span>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="font-medium">Full Match: </span>
                        <code className="bg-muted px-1 py-0.5 rounded font-mono">
                          "{match.match}"
                        </code>
                      </div>
                      {match.groups.length > 0 && (
                        <div>
                          <span className="font-medium">Capture Groups: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.groups.map((group, groupIndex) => (
                              <Badge
                                key={groupIndex}
                                variant="secondary"
                                className="font-mono"
                              >
                                ${groupIndex + 1}: "{group || ""}"
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {match.namedGroups &&
                        Object.keys(match.namedGroups).length > 0 && (
                          <div>
                            <span className="font-medium">Named Groups: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(match.namedGroups).map(
                                ([name, value]) => (
                                  <Badge
                                    key={name}
                                    variant="secondary"
                                    className="font-mono"
                                  >
                                    {name}: "{value || ""}"
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Regex Tester
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              Regular expressions (regex) are powerful patterns used for
              matching character combinations in strings. This tool helps you
              test and debug regex patterns with real-time feedback.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Features:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time pattern testing</li>
                  <li>Match highlighting</li>
                  <li>Capture group details</li>
                  <li>All regex flags supported</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Common Patterns:
                </h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                  <li>\d+ - Numbers</li>
                  <li>\w+ - Words</li>
                  <li>^.+$ - Full string</li>
                  <li>[a-zA-Z]+ - Letters only</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Cases:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Form validation</li>
                  <li>Text parsing</li>
                  <li>Search and replace</li>
                  <li>Data extraction</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
