import { format } from 'date-fns';
import dayjs from 'dayjs';

/**
 * Formats a given date string into 'dd/MM/yyyy' format.
 * @param dateString ISO date string (e.g., "2025-03-25T09:43:41.645Z")
 * @returns formatted date or '-' if the date is invalid
 */

export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr || typeof dateStr !== 'string') return 'N/A';

  const cleaned = dateStr.trim().toLowerCase();
  if (['null', 'undefined', 'na', 'n/a', ''].includes(cleaned)) return 'N/A';

  // Try to parse with dayjs first
  const date = dayjs(dateStr);
  if (date.isValid()) return date.format('DD/MM/YYYY');

  // Fallback using native Date object (covers cases like "07/10/2025")
  const nativeDate = new Date(dateStr);
  if (!isNaN(nativeDate.getTime())) {
    return dayjs(nativeDate).format('DD/MM/YYYY');
  }

  return dateStr; 
};


export const formatToDateString = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  return format(date, 'dd-MM-yyyy');
};

export const isStartAndEndDateValid = (
  startDate: string | Date,
  endDate: string | Date
): { isError: boolean; message: string } => {
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (!parsedStartDate || !parsedEndDate) {
    return {
      isError: true,
      message: 'Invalid date format',
    };
  }
  if (parsedStartDate > parsedEndDate)
    return {
      isError: true,
      message: 'Start date should be less than End date',
    };

  return {
    isError: false,
    message: '',
  };
};
