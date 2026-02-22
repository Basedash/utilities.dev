"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { UtilityPageHero } from "@/components/utility/utility-page-hero";
import { UtilityPageSections } from "@/components/utility/utility-page-sections";
import {
  Copy,
  Trash2,
  Key,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import {
  decodeJWT,
  getExpirationStatus,
  formatTimestamp,
  isJWTExpired,
  type DecodedJWT,
} from "./utils";
import manifest from "./manifest";

export default function JwtDecoderPage() {
  const [inputToken, setInputToken] = useState("");
  const tokenResult = useMemo<{
    decodedJWT: DecodedJWT | null;
    isValid: boolean | null;
    errorMessage: string;
  }>(() => {
    if (!inputToken.trim()) {
      return { decodedJWT: null, isValid: null, errorMessage: "" };
    }

    const result = decodeJWT(inputToken);
    if (result.success && result.data) {
      return { decodedJWT: result.data, isValid: true, errorMessage: "" };
    }

    return {
      decodedJWT: null,
      isValid: false,
      errorMessage: result.error || "Invalid JWT token",
    };
  }, [inputToken]);
  const { decodedJWT, isValid, errorMessage } = tokenResult;

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
    setInputToken("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <UtilityPageHero manifest={manifest} />

        {/* Validation Status */}
        {isValid !== null && (
          <div className="mb-6">
            <Card
              className={`border-2 ${
                isValid
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Valid JWT Token
                      </span>
                      {decodedJWT?.payload?.exp && (
                        <>
                          {(() => {
                            const expStatus = getExpirationStatus(
                              decodedJWT.payload.exp
                            );
                            return expStatus ? (
                              <Badge
                                variant="outline"
                                className={`ml-4 ${
                                  expStatus.color === "red"
                                    ? "border-red-500 text-red-700 dark:text-red-300"
                                    : expStatus.color === "yellow"
                                    ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                                    : "border-green-500 text-green-700 dark:text-green-300"
                                }`}
                              >
                                {expStatus.message}
                              </Badge>
                            ) : null;
                          })()}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        Invalid JWT Token
                      </span>
                      <span className="text-sm text-red-700 dark:text-red-300 ml-2">
                        {errorMessage}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              JWT Token Input
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
                  onClick={() => handleCopy(inputToken)}
                  disabled={!inputToken}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Paste your JWT token here to decode it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="jwt-input">JWT Token</Label>
              <Textarea
                id="jwt-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="min-h-[120px] resize-none font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Decoded Content */}
        {decodedJWT && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Header
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopy(JSON.stringify(decodedJWT.header, null, 2))
                      }
                      className="h-8 px-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  JWT header contains metadata about the token
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      JSON
                    </Label>
                    <pre className="mt-1 rounded-md bg-muted p-3 text-sm overflow-x-auto">
                      {JSON.stringify(decodedJWT.header, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Base64 Encoded
                    </Label>
                    <div className="mt-1 rounded-md bg-muted p-3 text-sm break-all font-mono">
                      {decodedJWT.headerBase64}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payload
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopy(JSON.stringify(decodedJWT.payload, null, 2))
                      }
                      className="h-8 px-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  JWT payload contains the claims and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Claims breakdown */}
                  {(decodedJWT.payload.iat ||
                    decodedJWT.payload.exp ||
                    decodedJWT.payload.nbf) && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Time Claims
                      </Label>
                      <div className="grid gap-2 text-sm">
                        {decodedJWT.payload.iat && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Issued At:</span>
                            <span>
                              {formatTimestamp(decodedJWT.payload.iat)}
                            </span>
                          </div>
                        )}
                        {decodedJWT.payload.exp && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Expires At:</span>
                            <span
                              className={
                                isJWTExpired(inputToken)
                                  ? "text-red-600 dark:text-red-400"
                                  : ""
                              }
                            >
                              {formatTimestamp(decodedJWT.payload.exp)}
                            </span>
                          </div>
                        )}
                        {decodedJWT.payload.nbf && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Not Before:</span>
                            <span>
                              {formatTimestamp(decodedJWT.payload.nbf)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      JSON
                    </Label>
                    <pre className="mt-1 rounded-md bg-muted p-3 text-sm overflow-x-auto">
                      {JSON.stringify(decodedJWT.payload, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Base64 Encoded
                    </Label>
                    <div className="mt-1 rounded-md bg-muted p-3 text-sm break-all font-mono">
                      {decodedJWT.payloadBase64}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signature Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Signature
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(decodedJWT.signature)}
                      className="h-8 px-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  JWT signature is used to verify the token&apos;s authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3 text-sm break-all font-mono">
                  {decodedJWT.signature}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Signature Verification
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        The signature can only be verified with the secret key
                        used to sign the token. This tool only decodes the token
                        without verifying its authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <UtilityPageSections manifest={manifest} />
      </div>
    </div>
  );
}
