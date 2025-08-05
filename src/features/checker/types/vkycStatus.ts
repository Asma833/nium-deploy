export const VKYC_STATUSES = {
  NOT_AVAILABLE: 'N/A',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
} as const;

export type VkycStatus = (typeof VKYC_STATUSES)[keyof typeof VKYC_STATUSES];

export const DISABLED_VKYC_STATUSES: VkycStatus[] = [VKYC_STATUSES.COMPLETED];

export const ACTION_NEEDED_VKYC_STATUSES: VkycStatus[] = [
  VKYC_STATUSES.NOT_AVAILABLE,
  VKYC_STATUSES.EXPIRED,
  VKYC_STATUSES.REJECTED,
];
