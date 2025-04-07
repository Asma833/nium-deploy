import { format } from 'date-fns';

/**
 * Formats a given date string into 'dd/MM/yyyy' format.
 * @param dateString ISO date string (e.g., "2025-03-25T09:43:41.645Z")
 * @returns formatted date or '-' if the date is invalid
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString || dateString.trim() === '' || dateString === 'null') {
    return '-';
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return format(date, 'dd/MM/yyyy');
};

export const format2Date = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  return format(date, 'dd-MM-yyyy');
};

export const isStartAndEndDateValid = (
  date1: string | Date,
  date2: string | Date
): { isError: boolean; message: string } => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  if (!date1Obj || !date2Obj) {
    return {
      isError: true,
      message: 'Invalid date format',
    };
  }
  if (date1Obj > date2Obj)
    return {
      isError: true,
      message: 'Start date should be less than End date',
    };

  return {
    isError: false,
    message: '',
  };
};
