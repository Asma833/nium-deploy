import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  pageSizeOption?: number[];
  setPageSize: (pageSize: number) => void;
  filteredDataLength: number;
  totalRecords: number;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  pageSize,
  pageSizeOption = [10, 15, 20, 25],
  setPageSize,
  filteredDataLength,
  totalRecords,
}: TablePaginationProps) => {
  // Generate page numbers to display (max 5)
  const generatePageNumbers = () => {
    // If totalPages <= 5, display all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first and last page
    const pages = new Set<number>([1, totalPages]);

    // Add current page and one page before and after
    pages.add(currentPage);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    // Fill in any gaps if we have less than 5 pages
    const pagesArray = Array.from(pages).sort((a, b) => a - b);
    if (pagesArray.length < 5) {
      // Add more pages before or after current page to reach 5
      if (currentPage <= 3) {
        // Add more pages after current
        while (pagesArray.length < 5 && pagesArray[pagesArray.length - 2] < totalPages - 1) {
          const nextPage = pagesArray[pagesArray.length - 2] + 1;
          pagesArray.splice(pagesArray.length - 1, 0, nextPage);
        }
      } else {
        // Add more pages before current
        while (pagesArray.length < 5 && pagesArray[1] > 2) {
          const prevPage = pagesArray[1] - 1;
          pagesArray.splice(1, 0, prevPage);
        }
      }
    }

    return pagesArray;
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    // Reset to page 1 when page size changes
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    // Don't do anything if trying to go to same page or invalid page
    if (page === currentPage || page < 1 || page > totalPages) return;

    // Call the parent's setCurrentPage method
    setCurrentPage(page);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-between items-center mt-4 flex-col md:flex-row gap-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm md:text-nowrap">
          Showing <span className="font-medium">{filteredDataLength === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span>{' '}
          to <span className="font-medium">{Math.min(currentPage * pageSize, totalRecords)}</span> of{' '}
          <span className="font-medium">{totalRecords}</span> results
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Show</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOption.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-label="Go to previous page"
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            const isCurrentPage = page === currentPage;
            const prevPage = index > 0 ? pageNumbers[index - 1] : null;
            const nextPage = index < pageNumbers.length - 1 ? pageNumbers[index + 1] : null;

            // Show ellipsis before current page if there's a gap > 1 from previous page
            const showEllipsisBefore = prevPage !== null && page - prevPage > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsisBefore && <PaginationItem>...</PaginationItem>}
                <PaginationItem>
                  <Button
                    variant={isCurrentPage ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8"
                  >
                    {page}
                  </Button>
                </PaginationItem>
              </React.Fragment>
            );
          })}

          <PaginationItem>
            <PaginationNext
              aria-label="Go to next page"
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
