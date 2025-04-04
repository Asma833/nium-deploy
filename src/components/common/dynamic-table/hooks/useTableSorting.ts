import { useState, useMemo } from 'react';

export function useTableSorting<T>(
  data: T[],
  defaultSortColumn?: string,
  defaultSortDirection: 'asc' | 'desc' = 'asc'
) {
  const [sortColumn, setSortColumn] = useState<string | undefined>(
    defaultSortColumn
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    defaultSortDirection
  );

  const sortedData = useMemo(() => {
    if (!sortColumn || !Array.isArray(data)) return data;

    return [...data].sort((a, b) => {
      if (!a || !b) return 0;

      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const toggleSort = (columnId: string) => {
    setSortColumn(columnId);
    setSortDirection(
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };

  return {
    sortedData,
    sortColumn,
    sortDirection,
    toggleSort,
  };
}
