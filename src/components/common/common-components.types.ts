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
  loading?: "lazy" | "eager";
};

export type Column<T> = {
  key: number | string;
  id: string;
  name: string;
  className?: string;
  cell?: (
    value: string | number | Date | React.ReactNode | null,
    row: T
  ) => React.ReactNode;
  sortable?: boolean;
};

export type DynamicTableProps<T> = {
  columns: any;
  tableWrapperClass?: string;
  renderLeftSideActions?: () => React.ReactNode;
  data: T[];
  initialPageSize?: number;
  pageSizeOption?: number[];
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  filterComponents?: React.ReactNode;
  renderComponents?: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  filter?: any;
};

export type IconType = "default" | "upload" | "download";

export type DialogWrapperProps = {
  triggerBtnText: string;
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
};

export type DashboardContentWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
