"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import manifest from "./manifest";
import {
  checkPasswordStrength,
  type StrengthLevel,
  type PasswordStrengthResult,
} from "./utils";

const LEVEL_LABELS: Record<StrengthLevel, string> = {
  "very-weak": "Very Weak",
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
  "very-strong": "Very Strong",
};

const LEVEL_COLORS: Record<StrengthLevel, string> = {
  "very-weak": "bg-red-500",
  weak: "bg-orange-500",
  fair: "bg-yellow-500",
  strong: "bg-green-500",
  "very-strong": "bg-green-600",
};

const CHECK_LABELS: Record<keyof PasswordStrengthResult["checks"], string> = {
  length: "8+ characters",
  hasLower: "Lowercase",
  hasUpper: "Uppercase",
  hasNumber: "Number",
  hasSymbol: "Symbol",
  noCommonPattern: "No common patterns",
  noSequential: "No sequences",
};

export default function PasswordStrengthCheckerPage() {
  const [password, setPassword] = useState("");

  const result = useMemo<PasswordStrengthResult | null>(() => {
    if (password === "") return null;
    return checkPasswordStrength(password);
  }, [password]);

  const handleClear = () => setPassword("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <UtilityPageHero manifest={manifest} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Password Input
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Enter a password to check its strength (never shared or stored)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="password-input">Password</Label>
                <Textarea
                  id="password-input"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[120px] resize-none font-mono text-sm"
                  autoComplete="off"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strength Analysis</CardTitle>
              <CardDescription>
                Heuristic feedback only; not a security guarantee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`${LEVEL_COLORS[result.level]} text-white border-0`}
                    >
                      {LEVEL_LABELS[result.level]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Score: {result.score}/10
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${LEVEL_COLORS[result.level]}`}
                      style={{ width: `${result.score * 10}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(Object.keys(result.checks) as Array<
                      keyof PasswordStrengthResult["checks"]
                    >).map((key) => {
                      const passed = result.checks[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2"
                        >
                          {passed ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              passed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {CHECK_LABELS[key]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Suggestions
                    </Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {result.feedback.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter a password to see strength analysis.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
