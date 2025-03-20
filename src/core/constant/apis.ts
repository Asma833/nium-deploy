export const getBaseUrl = () => {
  return import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_APP_API_URL_DEV
    : import.meta.env.VITE_APP_API_URL_PROD;
};

export const API = {
  AUTH: {
    LOGIN: `/users/login`,
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
    CHECKER_ORDERS: `/orders/get-checker-orders`,
    UPDATE_ORDER_DETAILS: `/orders/update-order-details`,
    UNASSIGN_CHECKER: `/orders/unassign-checker`,
    ORDER_STATUS_COUNTS: `/orders/order-status-counts`,
  },
  CHECKER: {
    ASSIGN: {
      LIST:`/orders`,
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
      CHECKER_ORDER:`/orders/get-checker-orders`,
      UNASSIGN:`orders/unassign-checker`
    },
  },
  FEATURES: {
    ENABLE_GEMINI_FLASH: `/features/gemini-flash/enable`,
  },
  NUSERS: {
    // PARTNERS_LIST: `/partners`,
    // CREATE: `/partners`,
    // STATUS_UPDATE:`/partners`,
    // UPDATE:`/partners`,
    // PRODUCTS:`/products`
    PARTNERS_LIST: `/users`,
    CREATE: `/users`,
    STATUS_UPDATE:`/users`,
    UPDATE:`/users`,
    PRODUCTS:`/users`
  },
  CONFIG: {
    GET_CONFIG: `/config`,
    GET_PURPOSE_TYPES: `/config?type=purpose_type`,
    GET_TRANSACTION_TYPES: `/config?type=transaction_type`,
  },
} as const;

/**
 * Type-safe endpoint getter
 * Usage: getEndpoint('AUTH.LOGIN')
 */
export function getEndpoint(path: string): string {
  return path.split(".").reduce((obj: any, key: string) => obj[key], API);
}
