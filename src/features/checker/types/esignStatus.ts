export const ESIGN_STATUSES = {
  NOT_GENERATED: 'not generated',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
} as const;

export type EsignStatus = (typeof ESIGN_STATUSES)[keyof typeof ESIGN_STATUSES];

export const DISABLED_ESIGN_STATUSES: EsignStatus[] = [
  ESIGN_STATUSES.NOT_GENERATED,
  ESIGN_STATUSES.COMPLETED,
  ESIGN_STATUSES.EXPIRED,
  ESIGN_STATUSES.REJECTED,
];
