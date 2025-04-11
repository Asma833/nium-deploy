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
