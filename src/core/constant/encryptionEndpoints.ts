import { API } from './apis';

/**
 * Configuration for specific endpoint matching rules
 */

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

export const ENDPOINT_MATCHING_RULES: EndpointRulesConfig = {
  'auth-logout': {
    endpoint: API.AUTH.LOGOUT,
    matchType: 'exact-only' as const,
    description: 'Authentication logout endpoint',
  },
  'auth-refresh': {
    endpoint: API.AUTH.REFRESH_TOKEN,
    matchType: 'exact-only' as const,
    description: 'Token refresh endpoint',
  },
  'auth-forgot-password': {
    endpoint: API.AUTH.FORGOT_PASSWORD,
    matchType: 'exact-only' as const,
    description: 'Forgot password endpoint',
  },
  'unassign-orders': {
    endpoint: API.CHECKER.UPDATE_INCIDENT.UNASSIGN,
    matchType: 'standard' as const,
    description: 'Unassign orders endpoint',
  },
  'take-request': {
    endpoint: API.CHECKER.ASSIGN.TAKE_REQUEST,
    matchType: 'exact-only' as const,
    description: 'Take request endpoint for checker orders',
  },
  'generate-e-sign': {
    endpoint: API.CHECKER.UPDATE_INCIDENT.REGENERATE_ESIGN_LINK,
    matchType: 'exact-only' as const,
    description: 'Generate e-sign link endpoint',
  },
  'upload-documents': {
    endpoint: API.DOCUMENTS.UPLOAD,
    matchType: 'exact-only' as const,
    description: 'Upload documents endpoint',
  },
  'generate-vkyc': {
    endpoint: API.CHECKER.UPDATE_INCIDENT.REGENERATE_VKYC_LINK,
    matchType: 'standard' as const,
    description: 'Generate vkyc link endpoint',
  }
} as const;

/**
 * Extract endpoints for backward compatibility
 */
export const SKIP_ENCRYPTION_ENDPOINTS = Object.values(ENDPOINT_MATCHING_RULES).map((rule) => rule.endpoint);

/**
 * Normalize endpoint path for clean comparison
 */
export function normalizeEndpointPath(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * Get matching rule based on actual URL
 * Prioritizes more specific rules over general ones
 */
export function getEndpointMatchingRuleByUrl(url: string): EndpointRule | undefined {
  const normalizedUrl = normalizeEndpointPath(url);

  // Convert to array and sort by specificity (longer endpoints first)
  const sortedRules = Object.values(ENDPOINT_MATCHING_RULES).sort((a, b) => {
    // First sort by endpoint length (longer = more specific)
    const lengthDiff = b.endpoint.length - a.endpoint.length;
    if (lengthDiff !== 0) return lengthDiff;

    // Then prioritize exact-only over standard
    if (a.matchType === 'exact-only' && b.matchType === 'standard') return -1;
    if (a.matchType === 'standard' && b.matchType === 'exact-only') return 1;

    return 0;
  });

  return sortedRules.find((rule) => {
    const normalizedEndpoint = normalizeEndpointPath(rule.endpoint);

    if (rule.matchType === 'exact-only') {
      return normalizedUrl === normalizedEndpoint || normalizedUrl === normalizedEndpoint + '/';
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
  // If we find any matching rule, we should NOT encrypt (skip encryption)
  // The matchType only controls HOW the matching is done, not WHETHER to encrypt
  return !rule;
}

/**
 * Determine if a URL matches a specific endpoint, using rule logic
 */
export function matchesEndpointRule(url: string, endpoint: string): boolean {
  const normalizedUrl = normalizeEndpointPath(url);
  const normalizedEndpoint = normalizeEndpointPath(endpoint);

  const rule = getEndpointMatchingRuleByUrl(endpoint);

  if (rule?.matchType === 'exact-only') {
    return normalizedUrl === normalizedEndpoint || normalizedUrl === normalizedEndpoint + '/';
  }

  return (
    normalizedUrl === normalizedEndpoint ||
    normalizedUrl.startsWith(normalizedEndpoint + '/') ||
    normalizedUrl.startsWith(normalizedEndpoint + '?')
  );
}
