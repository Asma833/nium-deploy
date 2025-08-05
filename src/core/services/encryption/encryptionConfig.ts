/**
 * Configuration for endpoints that should skip encryption
 */

import { SKIP_ENCRYPTION_ENDPOINTS, matchesEndpointRule } from '@/core/constant/encryptionEndpoints';

/**
 * Exact endpoint paths that should never be encrypted
 * These are checked for exact matches or when followed by a path separator or query string
 */
// SKIP_ENCRYPTION_ENDPOINTS is now imported from encryptionEndpoints.ts

/**
 * Regex patterns for endpoints that should skip encryption
 * These provide more flexible matching for endpoint groups
 */
export const SKIP_ENCRYPTION_PATTERNS = [
  /^\/api\/v\d+\/public\//, // Any public API endpoints (e.g., /api/v1/public/*)
  /^\/api\/v\d+\/health/, // Health check endpoints (e.g., /api/v1/health, /api/v2/health-check)
  /\/download\//, // File download endpoints (e.g., /api/files/download/*)
  /\/export\//, // Export endpoints (e.g., /api/reports/export/*)
  /\/webhook\//, // Webhook endpoints (e.g., /api/webhook/*)
  /\/callback\//, // Callback endpoints (e.g., /api/payment/callback/*)

  // Add more patterns as needed
  // Example: /\/api\/v\d+\/reports\/.*\/download$/,  // Report download endpoints
  // Example: /\/api\/v\d+\/files\/.*\/preview$/,     // File preview endpoints
] as const;

/**
 * HTTP methods that should never be encrypted
 * Only DELETE, HEAD, and OPTIONS requests skip encryption entirely
 */
export const SKIP_ENCRYPTION_METHODS = ['head', 'options'] as const;

/**
 * HTTP methods that should be encrypted (when they have data)
 * POST, PUT, PATCH encrypt request body; GET needs encryption headers for encrypted responses
 */
export const ENCRYPT_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

/**
 * Helper function to check if an endpoint should skip encryption
 */
export function shouldSkipEncryption(url: string): boolean {
  // Check exact endpoint matches using centralized matching rules
  const skipByEndpoint = SKIP_ENCRYPTION_ENDPOINTS.some((endpoint) => {
    return matchesEndpointRule(url, endpoint);
  });

  // Check pattern matches
  const skipByPattern = SKIP_ENCRYPTION_PATTERNS.some((pattern) => pattern.test(url));

  return skipByEndpoint || skipByPattern;
}

/**
 * Helper function to check if an HTTP method should be encrypted
 * Now includes GET requests for encrypted response handling
 */
export function shouldEncryptMethod(method: string): boolean {
  return ENCRYPT_METHODS.includes(method.toLowerCase() as any);
}

export default {
  SKIP_ENCRYPTION_ENDPOINTS,
  SKIP_ENCRYPTION_PATTERNS,
  SKIP_ENCRYPTION_METHODS,
  ENCRYPT_METHODS,
  shouldSkipEncryption,
  shouldEncryptMethod,
};
