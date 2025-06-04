import { API } from './apis';

/**
 * Configuration for specific endpoint matching rules
 */
export const ENDPOINT_MATCHING_RULES = {
  users: {
    endpoint: API.AUTH.LOGIN,
    matchType: 'exact-only' as const,
    description:
      'User creation and management endpoints - exact match only to avoid conflicts with auth endpoints',
  },
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
  orders: {
    endpoint: API.ORDERS.CHECKER_ORDERS,
    matchType: 'exact-only' as const,
    description: 'Checker orders endpoint',
  },
  'unassign-orders': {
    endpoint: API.CHECKER.ASSIGN.LIST,
    matchType: 'exact-only' as const,
    description: 'Unassign orders endpoint',
  },
  partner: {
    endpoint: API.NUSERS.USER.CREATE,
    matchType: 'exact-only' as const,
    description: 'Create partners endpoint',
  },
  partnerlist: {
    endpoint: API.NUSERS.USER.LIST,
    matchType: 'exact-only' as const,
    description: 'Partner list endpoint',
  },
  viewAll: {
    endpoint: API.ORDERS.LIST,
    matchType: 'exact-only' as const,
    description: 'Partner list endpoint',
  },
} as const;

/**
 * Type definitions
 */
export type EndpointMatchType = 'exact-only' | 'standard';

export type EndpointRule = {
  endpoint: string;
  matchType: EndpointMatchType;
  description: string;
};

export type EndpointRulesConfig = Record<string, EndpointRule>;

/**
 * Extract endpoints for backward compatibility
 */
export const SKIP_ENCRYPTION_ENDPOINTS = Object.values(
  ENDPOINT_MATCHING_RULES
).map((rule) => rule.endpoint);

/**
 * Normalize endpoint path for clean comparison
 */
export function normalizeEndpointPath(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * Get matching rule based on actual URL
 */
export function getEndpointMatchingRuleByUrl(
  url: string
): EndpointRule | undefined {
  const normalizedUrl = normalizeEndpointPath(url);

  return Object.values(ENDPOINT_MATCHING_RULES).find((rule) => {
    const normalizedEndpoint = normalizeEndpointPath(rule.endpoint);

    if (rule.matchType === 'exact-only') {
      return (
        normalizedUrl === normalizedEndpoint ||
        normalizedUrl === normalizedEndpoint + '/'
      );
    } else {
      return (
        normalizedUrl === normalizedEndpoint ||
        normalizedUrl.startsWith(normalizedEndpoint + '/') ||
        normalizedUrl.startsWith(normalizedEndpoint + '?')
      );
    }
  });
}

/**
 * Determine if the given URL should be encrypted
 */
export function shouldEncryptEndpoint(url: string): boolean {
  const rule = getEndpointMatchingRuleByUrl(url);
  return rule?.matchType === 'exact-only';
}

/**
 * Determine if a URL matches a specific endpoint, using rule logic
 */
export function matchesEndpointRule(url: string, endpoint: string): boolean {
  const normalizedUrl = normalizeEndpointPath(url);
  const normalizedEndpoint = normalizeEndpointPath(endpoint);

  const rule = getEndpointMatchingRuleByUrl(endpoint);

  if (rule?.matchType === 'exact-only') {
    return (
      normalizedUrl === normalizedEndpoint ||
      normalizedUrl === normalizedEndpoint + '/'
    );
  }

  return (
    normalizedUrl === normalizedEndpoint ||
    normalizedUrl.startsWith(normalizedEndpoint + '/') ||
    normalizedUrl.startsWith(normalizedEndpoint + '?')
  );
}
