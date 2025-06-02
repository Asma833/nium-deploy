/**
 * Centralized configuration for encryption endpoint rules
 * This file defines which endpoints should skip encryption and how they should be matched
 */

import { API } from './apis';

/**
 * Configuration for specific endpoint matching rules
 * Each entry defines how a particular endpoint should be matched
 */
export const ENDPOINT_MATCHING_RULES = {
  // Special case: 'users' endpoint should only match exact paths, not sub-paths like 'users/login'
  users: {
    endpoint: API.NUSERS.USER.CREATE,
    matchType: 'exact-only' as const,
    description:
      'User creation and management endpoints - exact match only to avoid conflicts with auth endpoints',
  },

  // Standard matching for other endpoints
  'auth-logout': {
    endpoint: API.AUTH.LOGOUT,
    matchType: 'standard' as const,
    description: 'Authentication logout endpoint',
  },
  'auth-refresh': {
    endpoint: API.AUTH.REFRESH_TOKEN,
    matchType: 'standard' as const,
    description: 'Token refresh endpoint',
  },
  'auth-forgot-password': {
    endpoint: API.AUTH.FORGOT_PASSWORD,
    matchType: 'standard' as const,
    description: 'Forgot password endpoint',
  },
  'checker-orders': {
    endpoint: API.ORDERS.CHECKER_ORDERS,
    matchType: 'standard' as const,
    description: 'Checker orders endpoint',
  },
  orders: {
    endpoint: API.ORDERS.ORDERS,
    matchType: 'standard' as const,
    description: 'Checker orders endpoint',
  },

  // Add more endpoints here as needed:

  // Example: If you want to skip encryption for all partner endpoints
  // 'partners': {
  //   endpoint: API.NUSERS.PARTNERS.CREATE,
  //   matchType: 'standard',
  //   description: 'Partner creation and management endpoints'
  // },

  // Example: If you have conflicting paths like /config and /config/setup
  // 'config': {
  //   endpoint: API.CONFIG.GET_CONFIG,
  //   matchType: 'exact-only',
  //   description: 'Config endpoint - exact match only to avoid conflicts'
  // },

  // Example: Public endpoints that should never be encrypted
  // 'health-check': {
  //   endpoint: '/health',
  //   matchType: 'standard',
  //   description: 'Health check endpoint'
  // }
} as const;

/**
 * Extract just the endpoints for backward compatibility
 */
export const SKIP_ENCRYPTION_ENDPOINTS = Object.values(
  ENDPOINT_MATCHING_RULES
).map((rule) => rule.endpoint);

/**
 * Get the matching rule for a specific endpoint
 */
export function getEndpointMatchingRule(endpoint: string) {
  return Object.values(ENDPOINT_MATCHING_RULES).find(
    (rule) => rule.endpoint === endpoint
  );
}

/**
 * Check if an endpoint should use exact-only matching
 */
export function shouldUseExactOnlyMatching(endpoint: string): boolean {
  const rule = getEndpointMatchingRule(endpoint);
  return rule?.matchType === 'exact-only';
}

/**
 * Helper function to normalize endpoint paths for comparison
 */
export function normalizeEndpointPath(path: string): string {
  return path.replace(/^\/+/, '');
}

/**
 * Advanced endpoint matching logic based on configured rules
 */
export function matchesEndpointRule(url: string, endpoint: string): boolean {
  const normalizedUrl = normalizeEndpointPath(url);
  const normalizedEndpoint = normalizeEndpointPath(endpoint);

  // Check if this endpoint has special matching rules
  if (shouldUseExactOnlyMatching(endpoint)) {
    // For 'exact-only' endpoints (like 'users'), only match exact paths or with trailing slash
    return (
      normalizedUrl === normalizedEndpoint ||
      normalizedUrl === normalizedEndpoint + '/'
    );
  }

  // Standard matching: exact match, sub-paths, or query parameters
  return (
    normalizedUrl === normalizedEndpoint ||
    normalizedUrl.startsWith(normalizedEndpoint + '/') ||
    normalizedUrl.startsWith(normalizedEndpoint + '?')
  );
}

/**
 * Type definitions for better IDE support
 */
export type EndpointMatchType = 'exact-only' | 'standard';

export type EndpointRule = {
  endpoint: string;
  matchType: EndpointMatchType;
  description: string;
};

export type EndpointRulesConfig = Record<string, EndpointRule>;
