/**
 * Configuration for endpoints that should skip encryption
 */

/**
 * Exact endpoint paths that should never be encrypted
 * These are checked using string.includes() so partial matches will work
 */
export const SKIP_ENCRYPTION_ENDPOINTS = [
  // System endpoints
  '/public-key',
  '/health',
  '/status',

  // Authentication endpoints
  '/auth/login',
  '/auth/logout',
  '/auth/refresh',
  '/auth/verify',

  // API endpoints that should skip encryption
  '/orders/get-checker-orders',

  // Add more endpoints as needed
  // Example: '/api/v1/users/public-profile',
  // Example: '/api/v1/settings/public',
] as const;

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
 * GET and DELETE requests typically don't need encryption
 */
export const SKIP_ENCRYPTION_METHODS = [
  'get',
  'delete',
  'head',
  'options',
] as const;

/**
 * HTTP methods that should be encrypted (when they have data)
 * Only these methods with request bodies will be considered for encryption
 */
export const ENCRYPT_METHODS = ['post', 'put', 'patch'] as const;

/**
 * Helper function to check if an endpoint should skip encryption
 */
export function shouldSkipEncryption(url: string): boolean {
  // Check exact endpoint matches
  const skipByEndpoint = SKIP_ENCRYPTION_ENDPOINTS.some((endpoint) =>
    url.includes(endpoint)
  );

  // Check pattern matches
  const skipByPattern = SKIP_ENCRYPTION_PATTERNS.some((pattern) =>
    pattern.test(url)
  );

  return skipByEndpoint || skipByPattern;
}

/**
 * Helper function to check if an HTTP method should be encrypted
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
