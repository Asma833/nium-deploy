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

export const ORDER_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  DELETED: 'deleted',
} as const;

export const DISABLED_ORDER_STATUSES = [null, undefined, 'completed'];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUSES.PENDING]: 'Pending',
  [ORDER_STATUSES.COMPLETED]: 'Approved',
  [ORDER_STATUSES.REJECTED]: 'Rejected',
  [ORDER_STATUSES.DELETED]: 'Deleted',
};

export const ORDER_STATUS_CLASSNAMES: Record<string, string> = {
  [ORDER_STATUSES.PENDING]: 'status-badge pending',
  [ORDER_STATUSES.COMPLETED]: 'status-badge approved',
  [ORDER_STATUSES.REJECTED]: 'status-badge rejected',
  [ORDER_STATUSES.DELETED]: 'status-badge deleted',
};
