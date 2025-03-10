import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TablePaginationProps } from '../common-components.types';

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOption,
  setPageSize,
  setCurrentPage,
  filteredDataLength,
  paginationMode,
  onPageChange
}: TablePaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    if (paginationMode === 'dynamic' && onPageChange) {
      // In dynamic mode, call the provided callback to fetch data for the new page
      onPageChange(page, pageSize);
    }
    
    // Always update the current page state
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    const newSize = Number(size);
    
    if (paginationMode === 'dynamic' && onPageChange) {
      // When changing page size in dynamic mode, reset to page 1 and fetch new data
      onPageChange(1, newSize);
      setCurrentPage(1);
    }
    
    // Always update the page size state
    setPageSize(newSize);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2">
      <p className="text-sm text-gray-700">
        Showing {filteredDataLength > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, filteredDataLength)} of {filteredDataLength} entries
      </p>
      <div className="flex gap-3">
        <div>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="text-black">
              <span className="flex items-center">
                <span className="mr-2 text-muted-foreground">Rows per page:</span>
                <SelectValue placeholder="Select rows per page" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOption?.map((size: number) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white text-black"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${pageNum}`}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(Number(pageNum))}
                  className={currentPage === pageNum ? "paginationActive" : "paginationInactive"}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-white text-black"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
