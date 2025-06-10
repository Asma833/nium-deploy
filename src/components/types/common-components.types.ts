import { Order } from '@/features/checker/types/updateIncident.types';

export type CommonProps = {
  className?: string;
  children?: React.ReactNode;
};

export type TriggerDialogButtonProps = {
  text: string;
  className?: string;
  iconType?: string;
  isLoading?: boolean;
};

export type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOption: number[];
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  filteredDataLength: number;
  paginationMode?: 'static' | 'dynamic'; // Make paginationMode optional
  onPageChange?: any;
  totalRecords?: number;
};

export type TableDataLoaderProps = {
  text?: string;
};

export type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export type Column<_T> = {
  key: number | string;
  id: string;
  name: string;
  className?: string;
  cell?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
};

export interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  tableWrapperClass?: string;
  renderLeftSideActions?: () => JSX.Element;
  initialPageSize?: number;
  pageSizeOption?: number[];
  defaultSortColumn?: keyof T | string;
  defaultSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  filter?: any;
  paginationMode?: 'static' | 'dynamic';
  loading?: boolean;
  renderComponents?: JSX.Element;
  onPageChange?: (page: number, pageSize: number) => Promise<T[]>;
  totalRecords?: number;
  refreshAction?: {
    isRefreshButtonVisible: boolean;
    refreshButtonText?: string;
    onRefresh: () => void;
    isLoading: boolean;
    hasError: boolean | string | null | Error;
  };
}

export type IconType = 'default' | 'upload' | 'download';

export type DialogWrapperProps = {
  triggerBtnText?: string;
  renderContent?: React.ReactNode;
  title?: string;
  description?: string;
  showFooter?: boolean;
  showHeader?: boolean;
  isLoading?: boolean;
  iconType?: IconType;
  triggerBtnClassName?: string;
  className?: string;
  onSave?: () => void;
  footerBtnText?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

export type DashboardContentWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export type GeneralWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export type ViewAllTableProps = {
  tableData: Order[];
  checkerOrdersLoading: boolean;
  checkerOrdersError: string;
  refreshData: () => void;
  disableColumns?: string[];
};

export type FieldWrapperPropsType = {
  id?: string;
  label?: string;
  labelClass?: string;
  name?: string;
  children: React.ReactNode;
  childrenClass?: string;
  className?: string;
  rowCols?: number | string;
  flexdirection?: string;
  error?: string | null;
};

export type rejectionComment = {
  id: string;
  document: string;
  comment: string;
  date: string;
};

export type RejectionSummaryProps = {
  className?: string;
  rejectionComments: rejectionComment[];
};
