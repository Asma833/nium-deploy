import { formatDate } from './dateFormat';

export const formatDateWithFallback = (date?: string | null): string => {
  if (date === null || date === undefined || date === 'N/A') {
    return 'N/A';
  }
  return formatDate(date);
};
