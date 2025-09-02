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
    ORDERS: '/fxorders',
    LIST: `/fxorders`,
    GET_MAKER_ORDERS: `/fxorders/maker`,
    CREATE: `/orders`,
    GET_BY_ID: (id: string) => `/orders/${id}`,
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    CHECKER_ORDERS: `/fxorders/get-checker-orders`,
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
      REGENERATE_VKYC_LINK: `/videokyc/generate-v-kyc`,
    },
  },
  MAKER: {
    GENERATE_ORDER: `/fxorders/generate-order-maker`,
  },
  FEATURES: {
    ENABLE_GEMINI_FLASH: `/features/gemini-flash/enable`,
  },
  USER_MANAGEMENT: {
    AGENT_BRANCH_USER: {
      LIST: `/agent-branch-users`,
      CREATE: `/agent-branch-users`,
      STATUS_UPDATE: `/agent-branch-users`,
    },
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
    GET_DOCUMENT_TYPES: (id: string) => `trans-purpose-document/${id}/documents`,
  },
  DOCUMENTS: {
    UPLOAD: `/documents/upload`,
    UPLOAD_WITH_MERGE: `/documents/upload-with-merge`,
    UPDATE: `/documents/update`,
    MERGE_PDF: `/documents/merge-pdf`,
  },
  PRODUCTS: {
    GET_PRODUCTS: '/products',
  },
  TRANSACTION: {
    GET_TRANSACTIONS: `/transaction_type`,
    GET_ALL_TRANSACTIONS: `/transaction_type/all`,
    GET_ALL_TRANSACTIONS_TYPES: `/transaction_type/all`,
    GET_TRANSACTIONS_TYPES: `/transaction_type`,
    GET_MAPPED_PURPOSES: `/transaction-purpose-map`,
    GET_MAPPED_PURPOSES_BY_ID: (id: string) => `/transaction-purpose-map/purposes/${id}`,
  },
  PURPOSE: {
    GET_PURPOSES: `/fx/purposes`,
    CREATE_PURPOSE: `/fx/purpose`,
    UPDATE_PURPOSE: `/fx/purpose/`,
    TRANSACTION_MAPPING: `/transaction-purpose-map`,
    GET_TRANSACTION_PURPOSES: `/transaction-purpose-map`,
    GET_ALL_TRANSACTIONS_TYPES: `/transaction_type/all`,
    GET_TRANSACTIONS_TYPES: `/transaction_type`,
    GET_MAPPED_PURPOSES: `/transaction-purpose-map`,
    GET_MAPPED_PURPOSES_BY_ID: (id: string) => `/transaction-purpose-map/purposes/${id}`,
  },
  TRANSACTION_PURPOSE_MAP: {
    CREATE: `/transaction-purpose-map`,
    GET_DOCUMENTS: (transactionTypeId: string) => `/trans-purpose-document/${transactionTypeId}/documents`,
  },
  DOCUMENT_MASTER: {
    GET_DOCUMENTS: `/fx/documents`,
    CREATE_DOCUMENT: `/fx/document`,
    UPDATE_DOCUMENT: `/fx/document`,
    DELETE_DOCUMENT: (id: string) => `/fx/document/${id}`,
    DOC_PURPOSE_TRANS_MAPPING: `/trans-purpose-document/map`,
    DELETE_MAPPING_DOCUMENT: (id: string) => `/trans-purpose-document/${id}`,
    UPDATE_MAPPING_DOCUMENT: `/trans-purpose-document`,
  },
} as const;

/**
 * Type-safe endpoint getter
 * Usage: getEndpoint('AUTH.LOGIN')
 */
export function getEndpoint(path: string): string {
  return path.split('.').reduce((obj: any, key: string) => obj[key], API);
}
