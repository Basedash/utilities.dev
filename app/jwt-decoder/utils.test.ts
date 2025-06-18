import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  decodeBase64URL,
  encodeBase64URL,
  decodeJWT,
  validateJWT,
  isJWTExpired,
  getExpirationStatus,
  formatTimestamp,
  formatTimeRemaining,
  extractClaims,
  hasRequiredClaims,
  getAlgorithm,
  isSecureAlgorithm,
  createJWTMock,
  type JWTHeader,
  type JWTPayload,
} from "./utils";

describe("JWT Decoder Utils", () => {
  const mockCurrentTime = 1640995200; // 2022-01-01 00:00:00

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockCurrentTime * 1000));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("decodeBase64URL", () => {
    test("decodes valid Base64URL strings", () => {
      expect(decodeBase64URL("SGVsbG8")).toBe("Hello");
      expect(decodeBase64URL("SGVsbG8gV29ybGQ")).toBe("Hello World");
    });

    test("handles padding correctly", () => {
      expect(decodeBase64URL("SGVsbG8g")).toBe("Hello ");
      expect(decodeBase64URL("SGVsbG8")).toBe("Hello");
      expect(decodeBase64URL("SGVsbA")).toBe("Hell");
    });

    test("replaces URL-safe characters", () => {
      // Test string that would contain + and / in regular base64
      const urlSafeString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      expect(() => decodeBase64URL(urlSafeString)).not.toThrow();
    });

    test("throws error for invalid Base64URL", () => {
      expect(() => decodeBase64URL("invalid!@#")).toThrow(
        "Invalid Base64URL encoding"
      );
    });

    test("handles empty string", () => {
      expect(decodeBase64URL("")).toBe("");
    });
  });

  describe("encodeBase64URL", () => {
    test("encodes strings to Base64URL", () => {
      expect(encodeBase64URL("Hello")).toBe("SGVsbG8");
      expect(encodeBase64URL("Hello World")).toBe("SGVsbG8gV29ybGQ");
    });

    test("removes padding", () => {
      expect(encodeBase64URL("Hello ")).toBe("SGVsbG8g");
      expect(encodeBase64URL("Hell")).toBe("SGVsbA");
    });

    test("replaces URL-unsafe characters", () => {
      const result = encodeBase64URL('{"alg":"HS256","typ":"JWT"}');
      expect(result).not.toContain("+");
      expect(result).not.toContain("/");
      expect(result).not.toContain("=");
    });

    test("handles empty string", () => {
      expect(encodeBase64URL("")).toBe("");
    });

    test("throws error for unencodable input", () => {
      // This is hard to test as btoa handles most strings, but we test the error path
      const originalBtoa = global.btoa;
      global.btoa = vi.fn(() => {
        throw new Error("Mock btoa error");
      });

      expect(() => encodeBase64URL("test")).toThrow(
        "Failed to encode Base64URL"
      );

      global.btoa = originalBtoa;
    });
  });

  describe("decodeJWT", () => {
    const validJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    test("decodes valid JWT successfully", () => {
      const result = decodeJWT(validJWT);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.header).toEqual({
        alg: "HS256",
        typ: "JWT",
      });
      expect(result.data!.payload).toEqual({
        sub: "1234567890",
        name: "John Doe",
        iat: 1516239022,
      });
      expect(result.data!.signature).toBe(
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      );
    });

    test("handles JWT with extra claims", () => {
      const jwtWithClaims = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        {
          sub: "user123",
          exp: mockCurrentTime + 3600,
          iss: "test-issuer",
          aud: "test-audience",
        }
      );

      const result = decodeJWT(jwtWithClaims);
      expect(result.success).toBe(true);
      expect(result.data!.payload.sub).toBe("user123");
      expect(result.data!.payload.exp).toBe(mockCurrentTime + 3600);
      expect(result.data!.payload.iss).toBe("test-issuer");
      expect(result.data!.payload.aud).toBe("test-audience");
    });

    test("rejects empty token", () => {
      const result = decodeJWT("");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Token must be a non-empty string");
    });

    test("rejects null token", () => {
      const result = decodeJWT(null as unknown as string);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Token must be a non-empty string");
    });

    test("rejects whitespace-only token", () => {
      const result = decodeJWT("   ");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Token cannot be empty");
    });

    test("rejects invalid JWT format", () => {
      const result = decodeJWT("invalid.jwt");
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Invalid JWT format. JWT should have 3 parts separated by dots."
      );
    });

    test("rejects JWT with too many parts", () => {
      const result = decodeJWT("a.b.c.d");
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Invalid JWT format. JWT should have 3 parts separated by dots."
      );
    });

    test("rejects JWT with invalid Base64URL encoding", () => {
      const result = decodeJWT("invalid!.part2.part3");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid Base64URL encoding");
    });

    test("rejects JWT with invalid JSON", () => {
      const invalidBase64 = encodeBase64URL("invalid json {");
      const result = decodeJWT(`${invalidBase64}.${invalidBase64}.signature`);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Unexpected");
    });
  });

  describe("validateJWT", () => {
    test("validates JWT without expiration", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123" }
      );

      const result = validateJWT(jwt);
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
    });

    test("validates non-expired JWT", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123", exp: mockCurrentTime + 3600 }
      );

      const result = validateJWT(jwt);
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.expiresIn).toBe(3600);
    });

    test("detects expired JWT", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123", exp: mockCurrentTime - 3600 }
      );

      const result = validateJWT(jwt);
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(true);
      expect(result.expiresIn).toBe(-3600);
    });

    test("handles invalid JWT", () => {
      const result = validateJWT("invalid.jwt");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("handles JWT expiring at exact current time", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123", exp: mockCurrentTime }
      );

      const result = validateJWT(jwt);
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.expiresIn).toBe(0);
    });
  });

  describe("isJWTExpired", () => {
    test("returns false for non-expired JWT", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123", exp: mockCurrentTime + 3600 }
      );

      expect(isJWTExpired(jwt)).toBe(false);
    });

    test("returns true for expired JWT", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123", exp: mockCurrentTime - 3600 }
      );

      expect(isJWTExpired(jwt)).toBe(true);
    });

    test("returns false for JWT without expiration", () => {
      const jwt = createJWTMock(
        { alg: "HS256", typ: "JWT" },
        { sub: "user123" }
      );

      expect(isJWTExpired(jwt)).toBe(false);
    });

    test("returns false for invalid JWT", () => {
      expect(isJWTExpired("invalid.jwt")).toBe(false);
    });
  });

  describe("getExpirationStatus", () => {
    test("returns null for undefined expiration", () => {
      expect(getExpirationStatus(undefined)).toBeNull();
    });

    test("returns expired status", () => {
      const status = getExpirationStatus(mockCurrentTime - 3600);
      expect(status).toEqual({
        status: "expired",
        message: "Token has expired",
        color: "red",
        timeRemaining: 0,
      });
    });

    test("returns expiring status (within 1 hour)", () => {
      const status = getExpirationStatus(mockCurrentTime + 1800); // 30 minutes
      expect(status).toEqual({
        status: "expiring",
        message: "Token expires soon",
        color: "yellow",
        timeRemaining: 1800,
      });
    });

    test("returns valid status", () => {
      const status = getExpirationStatus(mockCurrentTime + 7200); // 2 hours
      expect(status).toEqual({
        status: "valid",
        message: "Token is valid",
        color: "green",
        timeRemaining: 7200,
      });
    });

    test("handles edge case of exactly 1 hour remaining", () => {
      const status = getExpirationStatus(mockCurrentTime + 3600);
      expect(status!.status).toBe("valid");
      expect(status!.timeRemaining).toBe(3600);
    });
  });

  describe("formatTimestamp", () => {
    test("formats timestamp correctly", () => {
      const formatted = formatTimestamp(mockCurrentTime);
      expect(formatted).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M/
      );
    });

    test("handles undefined timestamp", () => {
      expect(formatTimestamp(undefined)).toBe("N/A");
    });

    test("handles zero timestamp", () => {
      const formatted = formatTimestamp(0);
      expect(formatted).toBe("N/A");
    });

    test("formats future timestamp", () => {
      const futureTime = mockCurrentTime + 86400; // 1 day later
      const formatted = formatTimestamp(futureTime);
      expect(formatted).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M/
      );
    });
  });

  describe("formatTimeRemaining", () => {
    test("formats seconds correctly", () => {
      expect(formatTimeRemaining(30)).toBe("30 seconds");
      expect(formatTimeRemaining(1)).toBe("1 second");
    });

    test("formats minutes correctly", () => {
      expect(formatTimeRemaining(90)).toBe("1 minute");
      expect(formatTimeRemaining(150)).toBe("2 minutes");
    });

    test("formats hours correctly", () => {
      expect(formatTimeRemaining(3660)).toBe("1 hour");
      expect(formatTimeRemaining(7200)).toBe("2 hours");
    });

    test("formats days correctly", () => {
      expect(formatTimeRemaining(86400)).toBe("1 day");
      expect(formatTimeRemaining(172800)).toBe("2 days");
    });

    test("formats negative time (expired)", () => {
      expect(formatTimeRemaining(-30)).toBe("Expired");
      expect(formatTimeRemaining(-90)).toBe("Expired");
      expect(formatTimeRemaining(-3660)).toBe("Expired");
      expect(formatTimeRemaining(-86400)).toBe("Expired");
    });

    test("handles zero", () => {
      expect(formatTimeRemaining(0)).toBe("Expired");
    });

    test("formats large values", () => {
      expect(formatTimeRemaining(604800)).toBe("7 days"); // 1 week
      expect(formatTimeRemaining(2592000)).toBe("1 month"); // ~1 month
    });
  });

  describe("extractClaims", () => {
    test("extracts standard claims", () => {
      const payload: JWTPayload = {
        sub: "user123",
        iss: "test-issuer",
        aud: "test-audience",
        exp: mockCurrentTime + 3600,
        iat: mockCurrentTime,
        nbf: mockCurrentTime,
        jti: "token-id",
      };

      const claims = extractClaims(payload);
      expect(claims).toEqual({
        Subject: "user123",
        Issuer: "test-issuer",
        Audience: "test-audience",
        "Expiration Time": mockCurrentTime + 3600,
        "Issued At": mockCurrentTime,
        "Not Before": mockCurrentTime,
        "JWT ID": "token-id",
      });
    });

    test("extracts custom claims", () => {
      const payload: JWTPayload = {
        sub: "user123",
        customClaim1: "value1",
        customClaim2: { nested: "value" },
        customClaim3: [1, 2, 3],
      };

      const claims = extractClaims(payload);
      expect(claims.customClaim1).toBe("value1");
      expect(claims.customClaim2).toEqual({ nested: "value" });
      expect(claims.customClaim3).toEqual([1, 2, 3]);
    });

    test("handles empty payload", () => {
      const claims = extractClaims({});
      expect(claims).toEqual({});
    });

    test("handles payload with undefined values", () => {
      const payload: JWTPayload = {
        sub: "user123",
        exp: undefined,
        customClaim: undefined,
      };

      const claims = extractClaims(payload);
      expect(claims.Subject).toBe("user123");
      expect(claims["Expiration Time"]).toBeUndefined();
      expect(claims.customClaim).toBeUndefined();
    });
  });

  describe("hasRequiredClaims", () => {
    const payload: JWTPayload = {
      sub: "user123",
      iss: "test-issuer",
      aud: "test-audience",
      exp: mockCurrentTime + 3600,
    };

    test("returns true when all required claims are present", () => {
      expect(hasRequiredClaims(payload, ["sub", "iss"])).toBe(true);
      expect(hasRequiredClaims(payload, ["sub", "aud", "exp"])).toBe(true);
    });

    test("returns false when required claims are missing", () => {
      expect(hasRequiredClaims(payload, ["sub", "missing"])).toBe(false);
      expect(hasRequiredClaims(payload, ["nbf"])).toBe(false);
    });

    test("returns true for empty required claims array", () => {
      expect(hasRequiredClaims(payload, [])).toBe(true);
    });

    test("returns false when required claim is undefined", () => {
      const payloadWithUndefined: JWTPayload = {
        sub: "user123",
        exp: undefined,
      };
      expect(hasRequiredClaims(payloadWithUndefined, ["exp"])).toBe(false);
    });

    test("handles empty payload", () => {
      expect(hasRequiredClaims({}, ["sub"])).toBe(false);
      expect(hasRequiredClaims({}, [])).toBe(true);
    });
  });

  describe("getAlgorithm", () => {
    test("returns algorithm from header", () => {
      expect(getAlgorithm({ alg: "HS256" })).toBe("HS256");
      expect(getAlgorithm({ alg: "RS256" })).toBe("RS256");
      expect(getAlgorithm({ alg: "none" })).toBe("none");
    });

    test("returns 'none' for missing algorithm", () => {
      expect(getAlgorithm({})).toBe("none");
      expect(getAlgorithm({ typ: "JWT" })).toBe("none");
    });

    test("handles non-string algorithm", () => {
      expect(getAlgorithm({ alg: 123 as unknown as string })).toBe(123);
      expect(getAlgorithm({ alg: null as unknown as string })).toBe(null);
    });
  });

  describe("isSecureAlgorithm", () => {
    test("identifies secure algorithms", () => {
      expect(isSecureAlgorithm({ alg: "HS256" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "HS384" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "HS512" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "RS256" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "RS384" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "RS512" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "ES256" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "ES384" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "ES512" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "PS256" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "PS384" })).toBe(true);
      expect(isSecureAlgorithm({ alg: "PS512" })).toBe(true);
    });

    test("identifies insecure algorithms", () => {
      expect(isSecureAlgorithm({ alg: "none" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "NONE" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "None" })).toBe(false);
    });

    test("handles missing algorithm", () => {
      expect(isSecureAlgorithm({})).toBe(false);
    });

    test("handles unknown algorithms", () => {
      expect(isSecureAlgorithm({ alg: "UNKNOWN" })).toBe(false);
      expect(isSecureAlgorithm({ alg: "MD5" })).toBe(false);
    });
  });

  describe("createJWTMock", () => {
    test("creates valid JWT mock", () => {
      const header: JWTHeader = { alg: "HS256", typ: "JWT" };
      const payload: JWTPayload = {
        sub: "user123",
        exp: mockCurrentTime + 3600,
      };

      const jwt = createJWTMock(header, payload);
      const parts = jwt.split(".");

      expect(parts).toHaveLength(3);

      // Verify the JWT can be decoded back
      const decoded = decodeJWT(jwt);
      expect(decoded.success).toBe(true);
      expect(decoded.data!.header).toEqual(header);
      expect(decoded.data!.payload).toEqual(payload);
    });

    test("creates JWT with empty header and payload", () => {
      const jwt = createJWTMock({}, {});
      const decoded = decodeJWT(jwt);

      expect(decoded.success).toBe(true);
      expect(decoded.data!.header).toEqual({});
      expect(decoded.data!.payload).toEqual({});
    });

    test("creates JWT with complex payload", () => {
      const header: JWTHeader = { alg: "RS256", typ: "JWT", kid: "key-id" };
      const payload: JWTPayload = {
        sub: "user123",
        iss: "https://issuer.example.com",
        aud: ["audience1", "audience2"],
        exp: mockCurrentTime + 3600,
        iat: mockCurrentTime,
        nbf: mockCurrentTime,
        jti: "unique-token-id",
        customClaim: { nested: { data: "value" } },
        roles: ["admin", "user"],
      };

      const jwt = createJWTMock(header, payload);
      const decoded = decodeJWT(jwt);

      expect(decoded.success).toBe(true);
      expect(decoded.data!.header).toEqual(header);
      expect(decoded.data!.payload).toEqual(payload);
    });

    test("creates JWT that can be validated", () => {
      const header: JWTHeader = { alg: "HS256", typ: "JWT" };
      const payload: JWTPayload = {
        sub: "user123",
        exp: mockCurrentTime + 3600,
      };

      const jwt = createJWTMock(header, payload);
      const validation = validateJWT(jwt);

      expect(validation.isValid).toBe(true);
      expect(validation.isExpired).toBe(false);
      expect(validation.expiresIn).toBe(3600);
    });
  });

  describe("integration tests", () => {
    test("full JWT lifecycle with expiration", () => {
      // Create JWT
      const header: JWTHeader = { alg: "RS256", typ: "JWT" };
      const payload: JWTPayload = {
        sub: "user123",
        iss: "test-issuer",
        aud: "test-audience",
        exp: mockCurrentTime + 1800, // 30 minutes
        iat: mockCurrentTime,
      };

      const jwt = createJWTMock(header, payload);

      // Decode JWT
      const decoded = decodeJWT(jwt);
      expect(decoded.success).toBe(true);

      // Validate JWT
      const validation = validateJWT(jwt);
      expect(validation.isValid).toBe(true);
      expect(validation.isExpired).toBe(false);

      // Check expiration status
      const status = getExpirationStatus(payload.exp);
      expect(status!.status).toBe("expiring");
      expect(status!.color).toBe("yellow");

      // Check required claims
      expect(hasRequiredClaims(payload, ["sub", "iss", "aud"])).toBe(true);

      // Check algorithm security
      expect(isSecureAlgorithm(header)).toBe(true);
    });

    test("handles malformed JWT gracefully", () => {
      const malformedJWTs = [
        "not.a.jwt.token",
        "..",
        "a.b",
        "a.",
        ".b.c",
        "",
        "   ",
        "a..c",
        "a.b.",
      ];

      malformedJWTs.forEach((jwt) => {
        const decoded = decodeJWT(jwt);
        expect(decoded.success).toBe(false);
        expect(decoded.error).toBeDefined();

        const validation = validateJWT(jwt);
        expect(validation.isValid).toBe(false);

        expect(isJWTExpired(jwt)).toBe(false);
      });
    });
  });
});
