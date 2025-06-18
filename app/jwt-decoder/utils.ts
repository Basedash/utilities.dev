/**
 * JWT Header interface
 */
export interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  iss?: string; // issuer
  sub?: string; // subject
  aud?: string | string[]; // audience
  exp?: number; // expiration time
  nbf?: number; // not before
  iat?: number; // issued at
  jti?: string; // JWT ID
  [key: string]: unknown;
}

/**
 * Decoded JWT result
 */
export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  headerBase64: string;
  payloadBase64: string;
}

/**
 * JWT decoding result
 */
export interface JWTDecodeResult {
  success: boolean;
  data?: DecodedJWT;
  error?: string;
}

/**
 * JWT validation result
 */
export interface JWTValidationResult {
  isValid: boolean;
  isExpired?: boolean;
  expiresIn?: number;
  error?: string;
}

/**
 * Token expiration status
 */
export interface TokenExpirationStatus {
  status: "expired" | "expiring" | "valid";
  message: string;
  color: string;
  timeRemaining?: number;
}

/**
 * Decodes a Base64URL string
 */
export const decodeBase64URL = (str: string): string => {
  // Replace URL-safe characters
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  const padding = base64.length % 4;
  const paddedBase64 = padding ? base64 + "=".repeat(4 - padding) : base64;

  try {
    return atob(paddedBase64);
  } catch {
    throw new Error("Invalid Base64URL encoding");
  }
};

/**
 * Encodes a string to Base64URL
 */
export const encodeBase64URL = (str: string): string => {
  try {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch {
    throw new Error("Failed to encode Base64URL");
  }
};

/**
 * Decodes a JWT token
 */
export const decodeJWT = (token: string): JWTDecodeResult => {
  if (!token || typeof token !== "string") {
    return {
      success: false,
      error: "Token must be a non-empty string",
    };
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return {
      success: false,
      error: "Token cannot be empty",
    };
  }

  try {
    const parts = trimmedToken.split(".");
    if (parts.length !== 3) {
      return {
        success: false,
        error: "Invalid JWT format. JWT should have 3 parts separated by dots.",
      };
    }

    const [headerBase64, payloadBase64, signature] = parts;

    // Decode header
    const headerJson = decodeBase64URL(headerBase64);
    const header = JSON.parse(headerJson) as JWTHeader;

    // Decode payload
    const payloadJson = decodeBase64URL(payloadBase64);
    const payload = JSON.parse(payloadJson) as JWTPayload;

    return {
      success: true,
      data: {
        header,
        payload,
        signature,
        headerBase64,
        payloadBase64,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid JWT token",
    };
  }
};

/**
 * Validates a JWT token structure and expiration
 */
export const validateJWT = (token: string): JWTValidationResult => {
  const decodeResult = decodeJWT(token);

  if (!decodeResult.success || !decodeResult.data) {
    return {
      isValid: false,
      error: decodeResult.error,
    };
  }

  const { payload } = decodeResult.data;
  const now = Math.floor(Date.now() / 1000);

  // Check expiration
  if (payload.exp) {
    const isExpired = now > payload.exp;
    const expiresIn = payload.exp - now;

    return {
      isValid: true,
      isExpired,
      expiresIn,
    };
  }

  return {
    isValid: true,
    isExpired: false,
  };
};

/**
 * Checks if a JWT token is expired
 */
export const isJWTExpired = (token: string): boolean => {
  const validation = validateJWT(token);
  return validation.isExpired === true;
};

/**
 * Gets the expiration status of a JWT token
 */
export const getExpirationStatus = (
  exp?: number
): TokenExpirationStatus | null => {
  if (!exp) return null;

  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = exp - now;

  if (timeRemaining <= 0) {
    return {
      status: "expired",
      message: "Token has expired",
      color: "red",
      timeRemaining: 0,
    };
  } else if (timeRemaining < 3600) {
    // Less than 1 hour
    return {
      status: "expiring",
      message: "Token expires soon",
      color: "yellow",
      timeRemaining,
    };
  } else {
    return {
      status: "valid",
      message: "Token is valid",
      color: "green",
      timeRemaining,
    };
  }
};

/**
 * Formats a Unix timestamp to a readable date string
 */
export const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return "N/A";

  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  } catch {
    return "Invalid date";
  }
};

/**
 * Formats time remaining in a human-readable format
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return "Expired";

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(seconds / unit.seconds);
    if (value > 0) {
      return `${value} ${unit.name}${value !== 1 ? "s" : ""}`;
    }
  }

  return "Less than a second";
};

/**
 * Extracts claims from JWT payload
 */
export const extractClaims = (
  payload: JWTPayload
): { [key: string]: unknown } => {
  const standardClaims = {
    iss: "Issuer",
    sub: "Subject",
    aud: "Audience",
    exp: "Expiration Time",
    nbf: "Not Before",
    iat: "Issued At",
    jti: "JWT ID",
  };

  const claims: { [key: string]: unknown } = {};

  // Add standard claims
  Object.entries(standardClaims).forEach(([key, description]) => {
    if (payload[key] !== undefined) {
      claims[description] = payload[key];
    }
  });

  // Add custom claims
  Object.entries(payload).forEach(([key, value]) => {
    if (!(key in standardClaims)) {
      claims[key] = value;
    }
  });

  return claims;
};

/**
 * Checks if JWT has required claims
 */
export const hasRequiredClaims = (
  payload: JWTPayload,
  requiredClaims: string[]
): boolean => {
  return requiredClaims.every((claim) => payload[claim] !== undefined);
};

/**
 * Gets JWT algorithm from header
 */
export const getAlgorithm = (header: JWTHeader): string | unknown => {
  return header.alg !== undefined ? header.alg : "none";
};

/**
 * Checks if JWT uses a secure algorithm
 */
export const isSecureAlgorithm = (header: JWTHeader): boolean => {
  const algorithm = getAlgorithm(header);
  const algorithmString =
    typeof algorithm === "string" ? algorithm : String(algorithm);
  const secureAlgorithms = [
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512",
  ];
  return secureAlgorithms.includes(algorithmString);
};

/**
 * Creates a JWT token (for testing purposes - header and payload only)
 */
export const createJWTMock = (
  header: JWTHeader,
  payload: JWTPayload
): string => {
  try {
    const headerBase64 = encodeBase64URL(JSON.stringify(header));
    const payloadBase64 = encodeBase64URL(JSON.stringify(payload));
    const signature = "mock-signature";

    return `${headerBase64}.${payloadBase64}.${signature}`;
  } catch {
    throw new Error("Failed to create JWT mock");
  }
};
