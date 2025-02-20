export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGET_PASSWORD: '/forget-password',
    SEND_PASSWORD_RESET: '/send-password-reset-link',
    RESET_LINK_CONFIRMATION: '/reset-link-confirmation'
  },
  ADMIN: {
    DASHBOARD: '/dashboard',
    USER_MANAGEMENT: {
      N_USER: '/user-management/n-user',
      AGENT_BRANCH: '/user-management/agent-branch-user-creation',
      AGENT_PROFILE: '/user-management/agent-profile-creation',
      CREATE_AGENT: '/user-management/agent-profile-creation/create-new-agent'
    }
  }
} as const;
