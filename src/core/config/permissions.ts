export const PERMISSIONS = {
    [ROLES.ADMIN]: [
      'view_dashboard',
      'manage_agents',
      'view_transactions',
      'approve_transactions',
      // ... other admin permissions
    ],
    [ROLES.CO_ADMIN]: [
      'view_dashboard',
      'manage_agents',
      'view_transactions',
      // ... other co-admin permissions
    ],
    [ROLES.MAKER]: [
      'view_dashboard',
      'view_transactions',
      'create_transaction',
      // ... other maker permissions
    ],
    [ROLES.CHECKER]: [
      'view_dashboard',
      'approve_transactions',
      // ... other checker permissions
    ]
  };