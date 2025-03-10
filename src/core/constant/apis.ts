/** API version prefix */
// const version = '/version';

/**
 * API Endpoints organized by domain
 */
export const API = {
  AUTH: {
    // LOGIN: `/users/login`,
    LOGIN: `/auth/users/login`,
    LOGOUT: `/auth/logout`,
    REGISTER: `/auth/register`,
    REFRESH_TOKEN: `/auth/refresh-token`,
    FORGOT_PASSWORD: `/users/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
    VERIFY_EMAIL: `/auth/verify-email`,
    CHANGE_PASSWORD: `/users/reset-password`,
  },
  USER: {
    GET_PROFILE: `/users/profile`,
    UPDATE_PROFILE: `/users/profile`,
    GET_PREFERENCES: `/users/preferences`,
    UPDATE_PREFERENCES: `/users/preferences`,
  },
  ORDERS: {
    LIST: `/orders`,
    CREATE: `/orders`,
    GET_BY_ID: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
  },
  CHECKER: {
    ASSIGN: {
      TAKE_REQUEST: `/checker/assign/take-request`,
      SEARCH_FILTER: `/checker/assign/search-filter`,
    },
  },
  FEATURES: {
    ENABLE_GEMINI_FLASH: `/features/gemini-flash/enable`,
  },
} as const;

/**
 * Type-safe endpoint getter
 * Usage: getEndpoint('AUTH.LOGIN')
 */
export function getEndpoint(path: string): string {
  return path.split(".").reduce((obj: any, key: string) => obj[key], API);
}
