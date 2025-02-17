import { useState, useMemo } from 'react';

export function useTablePagination<T>(
  data: T[],
  initialPageSize: number,
  pageSizeOptions: number[]
) {
  const [pageSize, setPageSize] = useState<number>(
    pageSizeOptions?.[0] || initialPageSize
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil((data?.length || 0) / pageSize);
  }, [data, pageSize]);

  return {
    paginatedData,
    totalPages,
    currentPage,
    pageSize,
    setPageSize,
    setCurrentPage
  };
}
