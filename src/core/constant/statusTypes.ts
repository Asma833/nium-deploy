// constants/statusTypes.ts

export const STATUS_TYPES = {
  COMPLETED: 'completed',
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
  NA: 'N/A',
};

export const STATUS_MAP: Record<string, string> = {
  [STATUS_TYPES.COMPLETED]: STATUS_TYPES.APPROVED, 
  [STATUS_TYPES.PENDING]: 'pending',
  [STATUS_TYPES.REJECTED]: 'rejected',
};
