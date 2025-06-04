export const HEADER_KEYS = {
  PARTNER_ID: import.meta.env.VITE_PARTNER_ID,
  API_KEY: import.meta.env.VITE_API_KEY,
};

export const API = {
  AUTH: {
    LOGIN: `/users/login`,
    LOGOUT: `/auth/logout`,
    REGISTER: `/auth/register`,
    FORGOT_PASSWORD: `/users/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
    VERIFY_EMAIL: `/auth/verify-email`,
    CHANGE_PASSWORD: `/users/reset-password`,
    REFRESH_TOKEN: `/refresh/accessToken`,
  },
  USER: {
    GET_ROLES: '/roles',
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
    CHECKER_ORDERS: `/orders/get-checker-orders`,
    CHECKER_ORDERS_BY_PARTNER_ID: `/orders/get-checker-orders-by-partner-order-id`,
    UPDATE_ORDER_DETAILS: `/orders/update-order-details`,
    UNASSIGN_CHECKER: `/orders/unassign-checker`,
    ORDER_STATUS_COUNTS: `/orders/order-status-counts`,
  },
  CHECKER: {
    ASSIGN: {
      LIST: `/orders/unassigned-orders`,
      TAKE_REQUEST: `/orders/update-checker`,
      SEARCH_FILTER: ``,
    },
    VIEW_ALL: {
      SEARCH_FILTER: `/checker/view-all/search-filter`,
    },
    COMPLETED_TRANSACTIONS: {
      SEARCH_FILTER: `/checker/completed-transactions/search-filter`,
    },
    UPDATE_INCIDENT: {
      LIST: `/update-incident`,
      UPDATE: (id: string) => `/update-incident/${id}`,
      SEARCH_FILTER: `/update-incident/search-filter`,
      CHECKER_ORDER: `/orders/get-checker-orders`,
      UNASSIGN: `orders/unassign-checker`,
      REGENERATE_ESIGN_LINK: `/ekyc/generate-e-sign`,
    },
  },
  FEATURES: {
    ENABLE_GEMINI_FLASH: `/features/gemini-flash/enable`,
  },
  NUSERS: {
    PARTNERS: {
      LIST: `/partners`,
      CREATE: `/partners`,
      STATUS_UPDATE: `/partners`,
      UPDATE: `/partners`,
      PRODUCTS: `/products`,
    },
    USER: {
      LIST: `/users`,
      CREATE: `/users`,
      STATUS_UPDATE: `/users`,
      UPDATE: `/users`,
      PRODUCTS: `/users`,
    },
  },
  CONFIG: {
    GET_CONFIG: `/config`,
    GET_PURPOSE_TYPES: `/config?type=purpose_type`,
    GET_TRANSACTION_TYPES: `/config?type=transaction_type`,
  },
  PRODUCTS: {
    GET_PRODUCTS: '/products',
  },
  TRANSACTION: {
    GET_TRANSACTIONS: `/transaction_type`,
  },
  PURPOSE: {
    GET_PURPOSES: `/purpose`,
  },
} as const;

/**
 * Type-safe endpoint getter
 * Usage: getEndpoint('AUTH.LOGIN')
 */
export function getEndpoint(path: string): string {
  return path.split('.').reduce((obj: any, key: string) => obj[key], API);
}
