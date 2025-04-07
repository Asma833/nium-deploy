export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGET_PASSWORD: '/forget-password',
    SEND_PASSWORD_RESET: '/send-password-reset-link',
    RESET_LINK_CONFIRMATION: '/reset-link-confirmation',
    RESET_PASSWORD: '/reset-password',
  },
  ADMIN: {
    DASHBOARD: '/dashboard',
    USER_MANAGEMENT: {
      N_USER: '/user-management/n-user',
      AGENT_BRANCH: '/user-management/agent-branch-user-creation',
      CREATE_BRANCH_NEW_USER: '/user-management/agent-branch-user-registration',
      AGENT_PROFILE: '/user-management/agent-profile-creation',
      CREATE_AGENT: '/user-management/agent-profile-creation/create-new-agent',
    },
    MASTER: {
      RATE_MASTER: {
        RATE_MARGIN: '/master/rate-margin',
      },
    },
  },
  CHECKER: {
    DASHBOARD: '/dashboard',
    ASSIGN: '/assign',
    VIEWALL: '/viewall',
    UPDATE_INCIDENT: '/update-incident',
    COMPLETEDTRANSACTIONS: '/completed-transactions',
  },
  COADMIN: {
    NUSER: '/users',
    CREATEUSER: '/users/create-user',
    UPDATEUSER: '/users/update-user/:id',
    PARTNER: '/partners',
    CREATEPARTNER: '/partners/create-partner',
    UPDATEPARTNER: '/partners/update-partner/:id',
    VIEWALL: '/viewall',
  },
} as const;
